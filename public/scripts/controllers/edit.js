angular.module('rdfvis.controllers').controller('EditCtrl', EditCtrl);

EditCtrl.$inject = ['$scope', 'propertyGraphService', 'queryService'];

function EditCtrl ($scope, pGraph, query) {
  var vm = this;
  vm.selected = null;
  vm.isNode = true;
  vm.isVariable = true;
  vm.isLiteral = false;
  vm.uris = [];
  vm.cur = -1;
  vm.variable = null;
  vm.literal  = null;

  vm.newValue = '';
  vm.newFilterType = "";
  vm.newFilterData = {};

  vm.varActive = false;
  vm.litActive = false;
  vm.valActive = false;

  vm.save = setData;
  vm.cancel = getData;
  vm.removeValue = removeValue;
  vm.addValue = addValue;
  vm.addNewFilter = addNewFilter;

  pGraph.edit = editSelected;
  vm.filters = pGraph.filters;

  /* Data that can be edited in this panel.
   * Editable of Node: properties ?
   * Editable of Property: isLit, literal
   * Editable of RDFResource: isVar, variable, uris, cur
   * Editable of Variable: alias, filters, opts */

  function clearData () {
    vm.selected = null;
    vm.isNode = true;
    vm.isVariable = true;
    //vm.properties = [];
    vm.uris = [];
    vm.cur = -1;
    vm.isLiteral = false;
    vm.variable = null;
    vm.literal  = null;
  }

  function getData () {
    if (!vm.selected) return null;
    vm.isNode = vm.selected.isNode();
    vm.isVariable = vm.selected.isVariable();
    vm.uris = vm.selected.uris.slice();
    vm.cur = vm.selected.cur;
    vm.variable = vm.selected.variable;
    vm.isLiteral = vm.selected.isLiteral();
    if (vm.isLiteral) {
      vm.literal = vm.selected.literal;
    } else {
      vm.literal = null;
    }
    vm.varActive = vm.isVariable;
    vm.litActive = vm.isLiteral;
    vm.valActive = (vm.cur >= 0);
  }

  function setData () {
    if (vm.isVariable) vm.selected.mkVariable();
    else vm.selected.mkConst();
    var enter = vm.uris.filter(uri => {
      return (vm.selected.values.data.indexOf(uri) < 0)
    });
    var exit = vm.selected.values.data.filter(uri => {
      return (vm.uris.indexOf(uri) < 0);
    });

    enter.forEach(uri => { vm.selected.values.add(uri); });
    exit.forEach(uri => { vm.selected.values.delete(uri); });
    getData();
    $scope.$emit('update', '');
  }

  function copyObj (obj) { return Object.assign({}, obj); }

  function editSelected (obj) {
    if (obj) vm.selected = obj;
    getData();
    $scope.$emit('setSelected', obj);
    $scope.$emit('tool', 'edit');
  }

  function removeValue (value) {
    var i = vm.uris.indexOf(value);
    if (i > -1) vm.uris.splice(i, 1);
  }

  function addValue () {
    var i = vm.uris.indexOf(vm.newValue);
    if (i < 0 && vm.newValue) {
      vm.uris.push(vm.newValue);
      vm.newValue = '';
    }
  }

  function addNewFilter (targetVar) {
    if (vm.newFilterType == "") return false;
    targetVar.addFilter(vm.newFilterType, copyObj(vm.newFilterData));
    vm.newFilterType = "";
    vm.newFilterData = {};
  }

}

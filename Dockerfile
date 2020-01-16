FROM node:11

WORKDIR /app

EXPOSE 8080
COPY . .
RUN yarn install

CMD ["yarn", "start"]

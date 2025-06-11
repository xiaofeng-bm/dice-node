FROM registry.cn-beijing.aliyuncs.com/node-20/node:node-20 as build-stage
# FROM node:20.5.1-alpine3.18 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM registry.cn-beijing.aliyuncs.com/node-20/node:node-20 as production-stage
# FROM node:20.5.1-alpine3.18 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

EXPOSE 3005 3010

CMD ["node", "/app/main.js"]

# TODO -- have to update the prod image to omit dev deps 

FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm" , "start" ]
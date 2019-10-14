FROM node:10.15

RUN npm install -g @angular/cli

WORKDIR /usr/src/app

COPY ./orders/package.json ./
RUN npm install --silent

EXPOSE 4200

CMD ["/usr/local/bin/ng", "serve", "--host", "0.0.0.0"]
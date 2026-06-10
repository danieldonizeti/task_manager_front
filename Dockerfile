

#IMAGE
FROM node:20-alpine AS builder

#Pasta de trabalho dentro do container
WORKDIR  /app

#Copiando o primeiro package json
COPY package*.json ./

#Instalando do zero para linux
RUN npm ci

#Copiando o resto do projeto
COPY . .


#Gerando arquivos estaticos na /dist
RUN npm run build

#Image do Nginx
FROM nginx:alpine

#copiando os arquivos buildados para do Nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

#Expondo a porta 80
EXPOSE 80

#Iniciando
CMD ["nginx", "-g", "daemon off;"]
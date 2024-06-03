FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]

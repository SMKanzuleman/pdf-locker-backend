FROM node:18

# Install QPDF in the system
RUN apt-get update && apt-get install -y qpdf

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Create uploads folder
RUN mkdir -p uploads

EXPOSE 7860
CMD ["node", "server.js"]

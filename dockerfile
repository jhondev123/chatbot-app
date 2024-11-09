# Use a imagem base do Node.js
FROM node:22.9.0

# Instala as dependências do sistema para o puppeteer
RUN apt-get update && apt-get install -y \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libpangocairo-1.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libasound2 \
    libpangoft2-1.0-0 \
    libxkbcommon0 \
    && rm -rf /var/lib/apt/lists/*

# Cria um diretório para o app
WORKDIR /app

# Copia o código do projeto para o container
COPY . /app

# Instala as dependências do projeto
RUN npm install

# Define o comando para executar o script start.js
CMD ["node", "chatbot.js"]

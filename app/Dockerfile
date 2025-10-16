# Imagem base Debian
FROM debian:bookworm

# Variáveis de ambiente
ENV DEBIAN_FRONTEND=noninteractive \
    DISPLAY=:0 \
    XAUTHORITY=/root/.Xauthority \
    ELECTRON_DISABLE_SECURITY_WARNINGS=true

# Instala dependências básicas do Electron + X11
RUN apt-get update && apt-get install -y \
    x11-apps \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    libx11-xcb1 \
    libdrm2 \
    libgbm1 \
    libxkbcommon0 \
    libxrandr2 \
    libxcursor1 \
    libxcomposite1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libglib2.0-0 \
    libnotify4 \
    ca-certificates \
    wget \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# (Opcional) Instala Node.js e Electron globalmente
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g electron --unsafe-perm=true --allow-root

# Diretório de trabalho
WORKDIR /app

# Copie seu app Electron (ajuste conforme seu projeto)
# COPY . .

CMD ["bash"]
# xhost +local:docker
# docker exec -it electron-app bash
# electron /app

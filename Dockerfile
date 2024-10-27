FROM node:22-alpine 

WORKDIR /app

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN npm install -g pnpm@9.7.0

COPY . .

RUN pnpm install

RUN npm run build

CMD ["pnpm", "start:prod"]

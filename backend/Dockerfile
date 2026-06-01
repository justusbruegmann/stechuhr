FROM node:22-alpine AS builder

WORKDIR  /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npx tsc


FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3500

CMD ["node", "dist/app.js"]

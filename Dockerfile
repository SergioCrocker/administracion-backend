# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar dependencias desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules

# Copiar el código de la aplicación
COPY . .

# Cambiar propietario de los archivos
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no privilegiado
USER nodejs

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]

# ============================================
# ÉTAPE 1 — Build
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copie package.json d'abord
# (optimisation cache)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code
COPY . .

# Compile React pour la production
RUN npm run build

# ============================================
# ÉTAPE 2 — Serveur Nginx
# ============================================
FROM nginx:alpine AS runtime

# Copie les fichiers compilés vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration Nginx pour React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
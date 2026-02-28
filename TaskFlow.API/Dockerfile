# ============================================
# ÉTAPE 1 — Build
# ============================================
# Image de base pour compiler le code
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Dossier de travail dans le container
WORKDIR /app

# Copie les fichiers de dépendances d'abord
# (optimisation cache Docker)
COPY *.csproj ./

# Restaure les packages NuGet
RUN dotnet restore

# Copie tout le reste du code
COPY . ./

# Compile et publie l'application
RUN dotnet publish -c Release -o /app/publish

# ============================================
# ÉTAPE 2 — Runtime
# ============================================
# Image plus légère juste pour exécuter
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

WORKDIR /app

# Copie seulement les fichiers compilés
COPY --from=build /app/publish .

# Port exposé
EXPOSE 5229

# Commande de démarrage
ENTRYPOINT ["dotnet", "TaskFlow.API.dll"]
# test-Mern

Outil Simplifié d'Analyse des Paniers d'Achat
Description
Outil Simplifié d'Analyse des Paniers d'Achat est un tableau de bord interactif conçu pour fournir des informations clés sur les ventes d'un site e-commerce. Il aide les administrateurs à analyser les produits les plus populaires, la répartition des ventes par catégorie et à suivre les tendances à travers des visualisations simples et des statistiques.

Fonctionnalités
Ventes Totales : Affiche le montant total des ventes pour une période spécifique.
Produits les Plus Vendus : Liste des 5 produits les plus vendus, triés par quantité.
Répartition des Ventes par Catégorie : Pourcentage des ventes totales par catégorie.
Tableau de Produits : Détail des produits avec nom, prix, nombre de ventes et date d'ajout.
Visualisation : Graphiques en barres et secteurs pour illustrer les ventes par catégorie et par produit.
Filtres : Permet de filtrer les statistiques par période de temps (derniers 7 jours, 30 jours, ou 12 derniers mois).
Prérequis
Avant de démarrer le projet, assurez-vous que vous disposez des éléments suivants :

Node.js (version 16 ou supérieure)
npm (version 8 ou supérieure)
MongoDB : Base de données NoSQL utilisée pour stocker les informations sur les produits et les ventes.
Installation
1. Cloner le Repository
Clonez ce repository dans votre répertoire local :

bash
Copier le code
git clone https://github.com/Elhilali-hA/test-Mern.git
cd votre-repository
2. Installation des Dépendances
Installez les dépendances nécessaires pour le backend et le frontend :

bash
Copier le code
npm install
3. Chargement des Données
Placez le fichier compressé contenant les données (fichier CSV ou JSON) dans le répertoire data/.

Ensuite, chargez les données dans la base MongoDB en exécutant le script suivant :

bash
Copier le code
npm run load-data
Ce script va remplir les collections MongoDB products et sales avec les données fournies.

4. Lancer le Backend
Lancez le serveur Backend avec la commande suivante :

bash
Copier le code
npm run start:backend
Le backend sera accessible sur http://localhost:5000.

5. Lancer le Frontend
Lancez le serveur Frontend avec Vue3 pour voir le tableau de bord :

bash
Copier le code
npm run start:frontend
Le frontend sera disponible sur http://localhost:8080.

API Endpoints
Voici les endpoints API disponibles pour obtenir les statistiques et les informations relatives aux ventes.

1. GET /analytics/total_sales
Description : Retourne le montant total des ventes pour la période sélectionnée.
Réponse :
json
Copier le code
{
  "total_sales": 50000
}
2. GET /analytics/trending_products
Description : Retourne une liste des 3 produits les plus vendus avec leur nom, quantité vendue et montant total des ventes.
Réponse :
json
Copier le code
[
  {
    "name": "Produit A",
    "quantity_sold": 120,
    "total_sales": 1500
  },
  {
    "name": "Produit B",
    "quantity_sold": 100,
    "total_sales": 1200
  },
  ...
]
3. GET /analytics/category_sales
Description : Retourne la répartition des ventes par catégorie.
Réponse :
json
Copier le code
{
  "categories": [
    {
      "category_name": "Électronique",
      "sales_percentage": 40
    },
    {
      "category_name": "Mode",
      "sales_percentage": 30
    },
    ...
  ]
}
4. GET /products
Description : Retourne une liste des produits avec le nombre total de ventes pour chaque produit.
Réponse :
json
Copier le code
[
  {
    "product_name": "Produit A",
    "total_sales": 1500
  },
  {
    "product_name": "Produit B",
    "total_sales": 1200
  },
  ...
]
Technologies utilisées
Frontend : Vue.js (Vue3), Chart.js
Backend : Node.js avec Typescript
Base de données : MongoDB
Visualisation : Chart.js pour les graphiques
Structure du Projet
Voici la structure du répertoire du projet :

bash
Copier le code
/backend
  /controllers        # Logique de traitement des données
  /models             # Modèles de données pour MongoDB
  /routes             # Définition des routes API
  server.ts           # Point d'entrée du serveur backend
/frontend
  /components         # Composants Vue.js pour le tableau de bord
  /views              # Vues du tableau de bord
  main.js             # Point d'entrée Vue3
README.md            # Fichier README
data/                 # Dossier contenant les fichiers de données
Documentation du Code
Le code est bien structuré et documenté pour faciliter sa compréhension et sa maintenance. Les fonctions de calcul et les routes API sont définies avec des types TypeScript stricts pour garantir la sécurité des données et la qualité du code.


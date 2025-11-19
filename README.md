# 📚 SwapShelf

Une API REST pour faciliter l'échange de livres entre utilisateurs. Construite avec **Bun**, **Express**, **Drizzle ORM** et **TypeScript**, SwapShelf suit une architecture hexagonale avec des principes Domain-Driven Design (DDD).

## 🚀 Fonctionnalités

- **Gestion des utilisateurs** : Inscription, authentification JWT
- **Catalogue de livres** : CRUD complet avec recherche par titre
- **Système d'échanges** : Proposition, validation et gestion des échanges de livres
- **Authentification** : Protection des routes via middleware JWT
- **Validation robuste** : Schémas Zod pour toutes les entrées
- **Tests complets** : Suite de tests avec Jest et Supertest

## 🏗️ Architecture

### Architecture Hexagonale + DDD

```
src/modules/
├── users/
│   ├── core/           # Logique métier (services, modèles)
│   ├── inbound/        # Adaptateurs entrants (REST API)
│   └── outbound/       # Adaptateurs sortants (repositories DB)
├── books/
├── exchanges/
└── auth/
```

**Principes appliqués :**
- **Séparation des responsabilités** : Chaque module est isolé
- **Injection de dépendances** : Ports & adaptateurs
- **Domain-Driven Design** : Entités riches avec logique métier encapsulée
- **Clean Architecture** : Le domaine ne dépend pas de l'infrastructure

## 🛠️ Stack Technique

- **Runtime** : [Bun](https://bun.sh) v1.3.0
- **Framework** : Express v5.1.0
- **Base de données** : SQLite (via libSQL)
- **ORM** : Drizzle ORM v0.44.7
- **Validation** : Zod v4.1.12
- **Authentification** : JWT + bcrypt
- **Tests** : Jest + Supertest
- **Langage** : TypeScript v5

## 📦 Installation

### Prérequis

- [Bun](https://bun.sh/docs/installation) >= 1.3.0

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/yann-bot/swapshelf.git
   cd swapshelf
   ```

2. **Installer les dépendances**
   ```bash
   bun install
   ```

3. **Configurer les variables d'environnement**
   
   Créer un fichier `.env` à la racine :
   ```env
   PORT=3000
   DB_FILE_NAME=file:./local.db
   JWT_SECRET=votre_secret_jwt_super_securise
   ```

4. **Initialiser la base de données**
   ```bash
   bunx drizzle-kit push
   ```

5. **Lancer le serveur**
   ```bash
   bun run dev
   ```

Le serveur démarre sur `http://localhost:3000` 🎉

## 🧪 Tests

Exécuter tous les tests :
```bash
bun test
```

Tester un module spécifique :
```bash
bun test ./src/modules/users/users.test.ts
bun test ./src/modules/books/books.test.ts
bun test ./src/modules/auth/auth.test.ts
bun test ./src/modules/exchanges/exchange.test.ts
```

## 📖 Documentation API

### Authentification

#### Inscription d'un utilisateur
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "motdepasse123",
  "role": "client"
}
```

#### Connexion
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse :**
```json
{
  "message": "Authentificated",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Livres

#### Créer un livre (authentifié)
```http
POST /books
Authorization: Bearer <votre_token>
Content-Type: application/json

{
  "title": "Clean Code",
  "description": "A Handbook of Agile Software Craftsmanship",
  "author": "Robert C. Martin",
  "available": true,
  "condition": "bon"
}
```

#### Rechercher des livres par titre
```http
GET /books/:title
Authorization: Bearer <votre_token>
```

**Exemple :** `GET /books/Clean` retourne tous les livres contenant "Clean" dans le titre.

### Échanges

#### Proposer un échange (authentifié)
```http
POST /exchanges
Authorization: Bearer <votre_token>
Content-Type: application/json

{
  "my_book_id": "uuid-de-mon-livre",
  "target_book_id": "uuid-du-livre-souhaité"
}
```

#### Lister tous les échanges (authentifié)
```http
GET /exchanges
Authorization: Bearer <votre_token>
```

## 🗂️ Structure des Données

### User
```typescript
{
  id: string,
  name: string,
  email: string,
  password: string (hashé),
  role: 'client' | 'admin',
  created_at: Date
}
```

### Book
```typescript
{
  id: string,
  owner_id: string,
  title: string,
  description: string,
  author: string,
  available: boolean,
  condition: 'neuf' | 'bon' | 'use',
  created_at: Date
}
```

### Exchange
```typescript
{
  id: string,
  requester_id: string,
  my_book_id: string,
  target_book_id: string,
  status: 'pending' | 'accepted' | 'rejected' | 'completed',
  created_at: Date
}
```

## 🔒 Gestion des Erreurs

L'API utilise un système d'erreurs personnalisées :

- **400 Bad Request** : Données invalides (validation Zod échouée)
- **401 Unauthorized** : Token manquant ou invalide
- **403 Forbidden** : Permissions insuffisantes
- **404 Not Found** : Ressource introuvable
- **409 Conflict** : Ressource déjà existante (email dupliqué, etc.)
- **500 Internal Server Error** : Erreur serveur

Format des erreurs :
```json
{
  "error": "Message d'erreur descriptif"
}
```

## 🧩 Patterns & Bonnes Pratiques

- ✅ **Architecture hexagonale** : Découplage domaine/infrastructure
- ✅ **DDD** : Entités riches (`ExchangeEntity`) avec logique métier
- ✅ **Repository Pattern** : Abstraction de la persistance
- ✅ **Dependency Injection** : Inversion de contrôle via constructeurs
- ✅ **Validation forte** : Schémas Zod côté routes
- ✅ **Tests exhaustifs** : Couverture des cas nominaux et d'erreur
- ✅ **Gestion d'erreurs centralisée** : Middleware Express
- ✅ **TypeScript strict** : Types forts partout

## 📝 Scripts Disponibles

```bash
bun run dev          # Lance le serveur en mode développement
bun test             # Exécute tous les tests
bun test:coverage    # Execute tous les tests et affiche le graphique  de couverture
bunx drizzle-kit push    # Applique les migrations DB
bunx drizzle-kit studio  # Interface graphique pour la DB
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Forker le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request


## 👨‍💻 Auteur

**Yann Ouafete**

---



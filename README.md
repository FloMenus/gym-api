# Gym API

Cette API permet de gérer des salles de sport, leurs utilisateurs, leurs équipements et un système de gamification basé sur des challenges et des badges.

## Fonctionnalités

### Gestion des utilisateurs et rôles

- **Utilisateurs** : chaque compte possède un rôle.
- **Rôles disponibles** :
  - **User** : utilisateur classique, participe aux activités.
  - **Owner** : gère une ou plusieurs salles de sport.  
    ➝ La création d’un compte *owner* se fait via une route dédiée.
  - **Admin** : rôle avec privilèges étendus pour superviser l’ensemble du système.
- **Sécurité** : chaque route est protégée par un middleware qui vérifie si l’utilisateur possède le rôle nécessaire.

### Structure des salles

- **Salle de sport** : entité principale gérée par un *owner*.
- **Ajout de salle** :  
  - Les *owners* ne peuvent pas créer directement une salle de sport.  
  - Ils doivent soumettre une **demande de création** via une route spécifique.  
  - Chaque demande est étudiée par un **administrateur**, qui peut l’**accepter** ou la **refuser**.
- **Salle d’entraînement** : chaque salle de sport peut contenir plusieurs espaces d’entraînement.
- **Types d’exercice** : associés aux salles d’entraînement (ex. cardio, musculation).
- **Équipements** : chaque salle d’entraînement peut disposer de plusieurs équipements (haltères, tapis, machines, etc.).

### Système de challenges

- **Challenge** : activité spéciale avec :
  - Une **difficulté**.
  - Une **date limite**.
  - Un ou plusieurs **types d’exercice**.
  - Un ou plusieurs **équipements**.
- **Participation** : chaque utilisateur peut rejoindre un challenge.
- **Validation** : si l’utilisateur réussit le challenge, il peut le marquer comme accompli.

### Sessions d’entraînement

- Les utilisateurs peuvent enregistrer leurs **sessions d’entraînement**.
- Chaque session permet de donner :
  - Une note pour la session d'entrainement.
  - Les **calories brûlées**.

### Système de badges

- **Types de badges** :
  - **CALORIES** : liés aux calories brûlées.
  - **SESSIONS** : liés au nombre de sessions effectuées.
  - **CHALLENGES** : liés aux challenges réussis.
- **Attribution** : les badges sont recalculés chaque jour à minuit.
- **Exemples** :
  - Réussir **10 challenges**.
  - Effectuer **3 sessions d’entraînement**.

## Technologie

- TypeScript (JavaScript)
- Zod (Validation de formulaire)
- Cron (Execution de code à un moment précis)
- Prisma (ORM)
- PostgresSQL (Base de données)
- Docker
- Postman

## Installation

**Cloner le projet**
```bash
git clone https://github.com/FloMenus/gym-api.git
```

Ou télécharger le projet <a href="https://github.com/FloMenus/gym-api">ici</a>

```bash
cd gym-api
```

**Copier les variables d'environnement**
```bash
cp .env.example .env
```

**Lancer le conteneur Docker**
```bash
docker compose up --build
```

## Utilisation avec Postman

Le fichier à la racine du projet `postman.json`, permet de facilement importer une collection et d'utiliser les principales fonctionnalités de l'API.

## Configuration de la base de données

- Base: `gym_db`
- User: `gym_user` 
- Password: `gym_password`
- Port: `5432`

## Routes

### Authentification
- Récupération du profil utilisateur `GET http://localhost:3000/auth/`
- Connexion de l'utilisateur `POST http://localhost:3000/auth/login`
- Inscription de l'utilisateur `POST http://localhost:3000/auth/register`
- Inscription du gestionnaire de salle `POST http://localhost:3000/auth/register-owner`
- Promotion d'un utilisateur en tant qu'administrateur `POST http://localhost:3000/auth/`

### Type d'exercice
- Récupération de tous les types d'exercice `GET http://localhost:3000/exerciseType/`
- Récupération d'un type d'exercice `GET http://localhost:3000/exerciseType/:id`
- Ajout d'un type d'exercice `POST http://localhost:3000/exerciseType/`
- Modification d'un type d'exercice `PUT http://localhost:3000/exerciseType/:id`
- Suppression d'un type d'exercice `DELETE http://localhost:3000/exerciseType/:id`

### Salle de sport
- Récupération de toutes les salles de sport `GET http://localhost:3000/gym/`
- Récupération d'une salle de sport `GET http://localhost:3000/gym/:id`
- Ajout d'une salle de sport `POST http://localhost:3000/gym/`
- Modification d'une salle de sport `PUT http://localhost:3000/gym/:id`
- Suppression d'une salle de sport `DELETE http://localhost:3000/gym/:id`

### Equipement d'une salle de sport
- Récupération de tous les équipements d'une salle de sport `GET http://localhost:3000/equipment/all-from-gym/:id`
- Récupération d'un équipement `GET http://localhost:3000/equipment/:id`
- Ajout dun équipement `POST http://localhost:3000/equipment/`
- Modification d'un équipement `PUT http://localhost:3000/equipment/:id`
- Suppression d'un équipement `DELETE http://localhost:3000/equipment/:id`

### Demande d'ajout d'une salle de sport
- Récupération de toutes les demandes d'ajout de salle de sport `GET http://localhost:3000/gym-request/all-from-gym/`
- Récupération d'une demande d'ajout de salle de sport `GET http://localhost:3000/gym-request/:id`
- Ajout d'une demande d'ajout de salle de sport `POST http://localhost:3000/gym-request/`
- Soumission de la décision d'ajout d'une salle de sport `POST http://localhost:3000/gym-request/submit-decission/:id`

### Salle d'entrainement
- Récupération de toutes les salles d'entrainement `GET http://localhost:3000/training-room/`
- Récupération de toutes les salles d'entrainement par salle de sport `GET http://localhost:3000/training-room/gym/:gymId`
- Récupération de toutes les salles d'entrainement par type d'exercice `GET http://localhost:3000/training-room/exercise-type/:exerciseTypeId`
- Ajout d'une salle d'entrainement `POST http://localhost:3000/training-room/`
- Modification d'une salle d'entrainement `PUT http://localhost:3000/training-room/`

### Challenge
- Récupération de tous les challenges `GET http://localhost:3000/challenge/`
- Récupération d'un challenge `GET http://localhost:3000/challenge/:id`
- Ajout d'un challenge `POST http://localhost:3000/challenge/`
- Modification d'un challenge `PUT http://localhost:3000/challenge/:id`
- Suppression d'un challenge `DELETE http://localhost:3000/challenge/:id`

### Participation d'un challenge
- Récupération de toutes les participations à tous les challenges `GET http://localhost:3000/challenge-participation/`
- Récupération de toutes les participations à un challenge d'un utilisateur `GET http://localhost:3000/challenge-participation/user/:userId`
- Récupération de toutes les participations à un challenge `GET http://localhost:3000/challenge-participation/challenge/:challengeId`
- Récupération d'une paticipation `GET http://localhost:3000/challenge-participation/:id`
- Ajout d'une participation à un challenge `POST http://localhost:3000/challenge-participation/`
- Modification pour challenge réussi `POST http://localhost:3000/challenge-participation/complete`
- Modification d'une participation d'un challenge `PUT http://localhost:3000/challenge-participation/:id`

### Badge
- Récupération de tous les badges `GET http://localhost:3000/badge/`
- Récupération de tous les badges de l'utilisateur connecté `GET http://localhost:3000/badge/user/`
- Récupération d'un badge `GET http://localhost:3000/badge/:id`
- Ajout d'un badge `POST http://localhost:3000/badge/`
- Modification d'un badge `PUT http://localhost:3000/badge/:id`
- Suppression d'un badge `DELETE http://localhost:3000/badge/:id`
- Execution forcée pour attribution des badges `DELETE http://localhost:3000/badge/execute`


### Relation entre utilisateur
- Récupération de toutes les relations d'un utilisateur `GET http://localhost:3000/relation/`
- Récupération des relations acceptées d'un utilisateur `GET http://localhost:3000/relation/accept`
- Récupération des relations en attente d'un utilisateur `GET http://localhost:3000/relation/pending`
- Envoie d'une demande d'ami `POST http://localhost:3000/relation/`
- Modification d'une demande d'ami (accepter ou refuser) `PUT http://localhost:3000/relation/`
- Suppression d'un ami `DELETE http://localhost:3000/relation/:id`


## Crédit
- <a href="https://github.com/FloMenus/" target="_blank">Florent MENUS</a>
- <a href="https://github.com/tomdepussay" target="_blank">Tom DEPUSSAY</a>
- <a href="https://github.com/Faalco91" target="_blank">Ouaïl AMARIR</a>
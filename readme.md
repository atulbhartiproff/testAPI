# Game Recommendation API

A full-stack game recommendation API built with Node.js, Express, and PostgreSQL. Supports both content-based and collaborative filtering recommendations based on user interactions.

## Features

* **Users, Games, and Interactions** tables with relational integrity.
* **Content-Based Filtering**: Recommend games based on genre of last played game.
* **Collaborative Filtering**: Recommend games based on what similar users played and liked.
* **Hybrid Approach Ready**: Can combine content and collaborative recommendations.
* **Flexible Interaction Types**: `play`, `like`, `rate`.
* **Scalable**: Designed to handle hundreds of users and thousands of games.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* dotenv for environment variables

## Database Schemas

### Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);
```

### Games Table

```sql
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    genre TEXT,
    platform TEXT,
    description TEXT
);
```

### Interactions Table

```sql
CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Users

* `POST /users` : Add a new user.
* `GET /users` : List all users.

### Games

* `POST /games` : Add a new game.
* `GET /games` : List all games.

### Interactions

* `POST /interactions` : Log user interaction with a game.
* `GET /interactions/:userId` : Fetch all interactions for a user.

### Recommendations

* `GET /recommendations/:userId` : Content-based recommendations.
* `GET /collab/:userId` : Collaborative filtering recommendations.

## Usage

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your `DATABASE_URL`.
4. Run migrations or create the database tables using the provided schemas.
5. Start the server:

```bash
node src/app.js
```

6. Use Postman or any HTTP client to test endpoints.

## Sample Data

* Users: Atul, Nisha, David
* Games: Elden Ring, Dark Souls, Valorant, Stardew Valley, etc.
* Interactions: `play`, `like`, `rate` with various ratings.

## Notes

* Ensure at least some overlapping interactions between users to see collaborative recommendations.
* Ratings and action types are used to weigh recommendations.
* Content-based filtering currently recommends based on the genre of the last played game.

## Future Improvements

* Hybrid recommendation system combining content and collaborative filtering.
* Text similarity on game descriptions using embeddings.
* Caching and performance optimizations for large datasets.
* Frontend integration with user-friendly recommendation UI.

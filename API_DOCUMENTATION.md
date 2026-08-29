# API Documentation — Steam Game Info & Analytics Website

**Base URL:** `/api`
**Backend:** FastAPI
**Auth:** Bearer token (JWT) in the `Authorization` header, required only for endpoints marked 🔒

---

## Table of Contents

- [Games](#games)
- [Genres & Categories](#genres--categories)
- [Companies](#companies)
- [Sales Charts](#sales-charts)
- [Auth](#auth)
- [Users (Personal)](#users-personal)
- [Common Response Objects](#common-response-objects)
- [Error Format](#error-format)

---

## Games

### `GET /api/games`
List and search games.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `q` | string | No | Search by game name |
| `genre` | string | No | Filter by genre name |
| `category` | string | No | Filter by category/tag name |
| `min_price` | integer | No | Minimum price (cents) |
| `max_price` | integer | No | Maximum price (cents) |
| `platform` | string | No | `windows` \| `mac` \| `linux` |
| `page` | integer | No | Page number (default: 1) |
| `page_size` | integer | No | Results per page (default: 20, max: 100) |

**Response `200`**
```json
{
  "total": 1532,
  "page": 1,
  "page_size": 20,
  "results": [
    {
      "appid": 730,
      "name": "Counter-Strike 2",
      "header_image": "https://...",
      "price_final": 0,
      "is_free": true,
      "genres": ["Action", "Free to Play"]
    }
  ]
}
```

---

### `GET /api/games/{appid}`
Get full details for a single game.

**Path Parameters**

| Param | Type | Description |
|---|---|---|
| `appid` | integer | Steam App ID |

**Response `200`** — see [Game object](#game-object)

**Response `404`** — game not found

---

### `GET /api/games/{appid}/players`
Get historical live player-count data for a game.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `range` | string | No | `24h` \| `7d` \| `30d` \| `all` (default: `24h`) |

**Response `200`**
```json
{
  "appid": 730,
  "range": "24h",
  "data": [
    { "recorded_at": "2026-08-29T10:00:00Z", "player_count": 812345 },
    { "recorded_at": "2026-08-29T11:00:00Z", "player_count": 798211 }
  ]
}
```

---

## Genres & Categories

### `GET /api/genres`
List all genres.

**Response `200`**
```json
[
  { "id": 1, "description": "Action" },
  { "id": 2, "description": "RPG" }
]
```

### `GET /api/categories`
List all Steam tags/categories.

**Response `200`**
```json
[
  { "id": 1, "description": "Single-player" },
  { "id": 2, "description": "Multi-player" }
]
```

---

## Companies

### `GET /api/companies`
List companies (developers/publishers).

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `q` | string | No | Search by company name |
| `country` | string | No | Filter by country |
| `page` | integer | No | Page number |

**Response `200`**
```json
{
  "total": 4210,
  "results": [
    { "id": 12, "name": "Valve", "country": "United States", "founded_year": 1996 }
  ]
}
```

### `GET /api/companies/{id}`
Get company details plus the list of games it developed/published.

**Response `200`**
```json
{
  "id": 12,
  "name": "Valve",
  "founded_year": 1996,
  "country": "United States",
  "headquarters": "Bellevue, Washington",
  "website": "https://www.valvesoftware.com",
  "developed_games": [{ "appid": 730, "name": "Counter-Strike 2" }],
  "published_games": [{ "appid": 730, "name": "Counter-Strike 2" }]
}
```

**Response `404`** — company not found

---

## Sales Charts

### `GET /api/sales-charts`
Best-seller rankings for a given period.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `period` | string | Yes | `weekly` \| `monthly` \| `yearly` |
| `date` | string (YYYY-MM-DD) | No | Reference date within the period (default: latest available) |

**Response `200`**
```json
{
  "period_type": "weekly",
  "period_start": "2026-08-24",
  "period_end": "2026-08-30",
  "rankings": [
    { "rank": 1, "appid": 730, "name": "Counter-Strike 2" },
    { "rank": 2, "appid": 570, "name": "Dota 2" }
  ]
}
```

---

## Auth

### `POST /api/auth/register`
Register a new user. Login is optional site-wide — this is only needed for personal features.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "plaintext-password",
  "full_name": "Jane Doe"
}
```

**Response `201`**
```json
{ "id": 45, "email": "user@example.com", "full_name": "Jane Doe" }
```

**Response `409`** — email already registered

---

### `POST /api/auth/login`
Log in and receive an access token.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "plaintext-password"
}
```

**Response `200`**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Response `401`** — invalid credentials

---

### `POST /api/auth/logout` 🔒
Log out (invalidate current token, if using a token blocklist — optional depending on implementation).

**Response `204`** — no content

---

## Users (Personal)

All endpoints below require a valid Bearer token.

### `GET /api/users/me` 🔒
Get the current user's profile.

**Response `200`**
```json
{
  "id": 45,
  "email": "user@example.com",
  "username": "janedoe",
  "full_name": "Jane Doe",
  "phone_number": null,
  "avatar_url": null,
  "country": null,
  "created_at": "2026-01-15T09:00:00Z"
}
```

### `PUT /api/users/me` 🔒
Update the current user's profile.

**Request Body** (all fields optional)
```json
{
  "username": "janedoe",
  "full_name": "Jane Doe",
  "phone_number": "+1234567890",
  "country": "Germany"
}
```

**Response `200`** — updated user object

---

### `GET /api/users/me/search-history` 🔒
Get the current user's search history.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `limit` | integer | No | Max results (default: 50) |

**Response `200`**
```json
[
  { "search_query": "counter strike", "searched_at": "2026-08-29T08:12:00Z" },
  { "search_query": "rpg games", "searched_at": "2026-08-28T19:40:00Z" }
]
```

---

### `GET /api/users/me/favorite-games` 🔒
List the current user's favorite games.

**Response `200`**
```json
[
  { "appid": 730, "name": "Counter-Strike 2", "added_at": "2026-08-01T12:00:00Z" }
]
```

### `POST /api/users/me/favorite-games` 🔒
Add a game to favorites.

**Request Body**
```json
{ "appid": 730 }
```

**Response `201`** — the created favorite entry

**Response `409`** — already in favorites

### `DELETE /api/users/me/favorite-games/{appid}` 🔒
Remove a game from favorites.

**Response `204`** — no content

---

### `GET /api/users/me/favorite-genres` 🔒
List the current user's favorite genres.

**Response `200`**
```json
[{ "id": 1, "description": "Action" }]
```

### `POST /api/users/me/favorite-genres` 🔒
Add a favorite genre.

**Request Body**
```json
{ "genre_id": 1 }
```

**Response `201`** — the created favorite entry

---

## Common Response Objects

### Game object

```json
{
  "appid": 730,
  "name": "Counter-Strike 2",
  "type": "game",
  "is_free": true,
  "short_description": "...",
  "detailed_description": "...",
  "header_image": "https://...",
  "release_date": "2012-08-21",
  "is_released": true,
  "price_initial": 0,
  "price_final": 0,
  "discount_percent": 0,
  "currency": "USD",
  "platforms": { "windows": true, "mac": false, "linux": true },
  "metacritic_score": 83,
  "positive_reviews": 1500000,
  "negative_reviews": 200000,
  "genres": ["Action", "Free to Play"],
  "categories": ["Multi-player", "Steam Achievements"],
  "developers": ["Valve"],
  "publishers": ["Valve"],
  "screenshots": ["https://...", "https://..."],
  "movies": ["https://..."]
}
```

---

## Error Format

All error responses follow this shape:

```json
{
  "detail": "Human-readable error message"
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request / validation error |
| `401` | Missing or invalid auth token |
| `403` | Authenticated but not allowed |
| `404` | Resource not found |
| `409` | Conflict (e.g., duplicate entry) |
| `500` | Server error |

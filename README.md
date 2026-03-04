# 🎬 ReelTalk

A fullstack movie catalog and social discussion platform built using the **MEVN stack** (MongoDB, Express, Vue, Node.js).  
ReelTalk allows users to discover, rate, and discuss movies while administrators manage and moderate the platform.

---

## 🚀 Overview

ReelTalk is a community-driven movie platform where users can:

- Discover and browse movies  
- Rate and like films  
- Participate in threaded discussions  
- Manage personal watchlists  
- Contribute movies to the catalog  

Administrators have extended privileges for content management and moderation.

---

## 🧩 Core Features

## 👥 User Features

### Public Access

- View movies in a responsive card layout  
- Search movies by title  
- Filter movies by genre  
- Sort movies (Highest Rated, Most Liked, Trending, A–Z)  
- Paginated movie browsing  

### Authentication

- User registration (Username, Email, Password)  
- Secure login with JWT authentication  
- Role-based access control (User / Admin)  

### Logged-In Users

- Add movies via OMDb API integration  
- View full movie details  
- Like / Unlike movies  
- Rate movies (1–5 stars)  
- Add movies to personal watchlist  
- Remove movies from watchlist  
- Comment on movies  
- Reply to comments (threaded discussions)  
- Edit or delete own comments  
- React to comments (Like / Dislike)  

---

## 🛠 Admin Features

- Admin Dashboard with platform metrics  
- View all movies in table format  
- Create movies  
- Update movies  
- Delete movies  
- Moderate comments (Edit / Delete any comment)  
- Movies sorted alphabetically (A–Z)  
- Comments sorted newest-first (by `createdAt`)  
- Movie analytics tables (views, likes, ratings)  
- Metric tooltips explaining metric formulas  

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|------|------|------|
| POST | /users/register | Register new user |
| POST | /users/login | Authenticate and receive JWT |

### Movies

| Method | Endpoint | Description |
|------|------|------|
| GET | /movies/getMovies | Fetch movies with filters & pagination |
| GET | /movies/getMovie/:id | Fetch single movie |
| POST | /movies/addMovie | Add movie (authenticated) |
| PATCH | /movies/updateMovie/:id | Update movie |
| DELETE | /movies/deleteMovie/:id | Delete movie |
| PATCH | /movies/likeMovie/:id | Like / Unlike movie |
| PATCH | /movies/rateMovie/:id | Rate movie |

### Comments

| Method | Endpoint | Description |
|------|------|------|
| PATCH | /movies/addComment/:id | Add comment |
| PATCH | /movies/replyComment/:movieId/:commentId | Reply to comment |
| PATCH | /movies/editComment/:movieId/:commentId | Edit comment |
| DELETE | /movies/deleteComment/:movieId/:commentId | Delete comment |
| PATCH | /movies/reactComment/:movieId/:commentId | Like / Dislike comment |

### Watchlist

| Method | Endpoint | Description |
|------|------|------|
| PATCH | /movies/watchlist/:movieId | Toggle watchlist |
| GET | /movies/watchlist | Get user watchlist |

### Admin

| Method | Endpoint | Description |
|------|------|------|
| GET | /movies/admin/dashboard | Platform statistics |

---

# 📊 Feature Completion Status

---

## 1. Core Application Features

| Feature | Description | Status |
|------|------|------|
| User Registration | Allow users to create an account using email and password | ✅ Complete |
| User Login (JWT) | Authenticate users securely using JSON Web Tokens | ✅ Complete |
| Admin Dashboard | Provide administrators with platform metrics and overview | ✅ Complete |
| Add Movie (OMDb Integration) | Allow users to add movies fetched from OMDb API | ✅ Complete |
| Update Movie | Allow movie creator or admin to modify movie details | ✅ Complete |
| Delete Movie | Allow movie creator or admin to remove movies | ✅ Complete |
| Duplicate Movie Guard | Prevent duplicate movie entries based on title and year | ✅ Complete |
| View Single Movie | Display complete movie details and engagement metrics | ✅ Complete |
| Search by Title | Enable users to search movies by title | ✅ Complete |
| Filter by Genre | Enable filtering of movies by genre | ✅ Complete |
| Sort Movies | Allow sorting by newest, highest rated, most liked, and trending | ✅ Complete |
| Movie Pagination | Display movies with page navigation | ✅ Complete |

---

## 2. Engagement Features

| Feature | Description | Status |
|------|------|------|
| Like Movie | Allow users to like or unlike movies | ✅ Complete |
| Rate Movie | Allow users to rate movies and calculate average rating | ✅ Complete |
| Watchlist | Allow users to save movies to their personal watchlist | ✅ Complete |
| Add Comment | Allow users to comment on movies | ✅ Complete |
| Nested Replies | Allow replies to existing comments | ✅ Complete |
| Edit Comment | Allow users to edit their comments | ✅ Complete |
| Delete Comment | Allow users to delete their comments | ✅ Complete |
| Like Comment | Allow users to like comments | ✅ Complete |
| Dislike Comment | Allow users to dislike comments | ✅ Complete |
| Prevent Duplicate Comment Reactions | Ensure users cannot react multiple times to the same comment | ✅ Complete |
| Comment Pagination | Paginate top-level comments while preserving replies | ✅ Complete |

---

## 3. Trending & Discovery

| Feature | Description | Status |
|------|------|------|
| Trending Movies Section | Display top trending movies based on engagement score | ✅ Complete |
| Trending Ranking Badge | Display ranking numbers for trending movies | ✅ Complete |
| Trending Sorting | Sort movies based on engagement score | ✅ Complete |
| Advanced Trending Algorithm | Trending score based on likes, comments, and ratings | ✅ Complete |

---

## 4. Admin & Moderation Tools

| Feature | Description | Status |
|------|------|------|
| Admin Movie Management | Admins can update or delete any movie | ✅ Complete |
| Admin Comment Moderation | Admins can view and delete any comment | ✅ Complete |
| Admin Metrics Dashboard | Display system-wide statistics for users, movies, comments, ratings, likes, and platform averages | ✅ Complete |
| Admin Movie Search | Allow admin to filter movies by title and genre | ✅ Complete |
| Admin Pagination | Paginate movies and comments in admin dashboard | ✅ Complete |
| Admin Movie Analytics | Display rankings by views, likes, and ratings | ✅ Complete |

---

## 5. Performance & Architecture

| Feature | Description | Status |
|------|------|------|
| JWT Authentication Middleware | Protect routes using token validation | ✅ Complete |
| Structured API Controllers | Organized backend controllers for maintainability | ✅ Complete |
| RESTful API Design | Consistent REST endpoints across backend services | ✅ Complete |
| Axios API Layer | Centralized frontend API service for backend communication | ✅ Complete |
| Database Indexing | Improve query performance using indexed fields | ✅ Complete |

---

## 6. UI / UX Improvements

| Feature | Description | Status |
|------|------|------|
| Responsive Layout | Ensure usability across desktop and mobile devices | ✅ Complete |
| Card-based Movie UI | Display movies in modern card format | ✅ Complete |
| Pagination Controls | Provide user-friendly navigation between pages | ✅ Complete |
| Toast Notifications | Provide success/error feedback to users | ✅ Complete |
| Trending Ranking Badge UI | Highlight trending movies visually | ✅ Complete |
| Metric Help Widget | Tooltip explaining how each metric is calculated | ✅ Complete |

---

## 📂 Project Structure

```text
reeltalk
│
├── server
│   ├── controllers
│   │   ├── userController.js
│   │   └── movieController.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Movie.js
│   │
│   ├── routes
│   │   ├── userRoutes.js
│   │   └── movieRoutes.js
│   │
│   ├── middleware
│   │   └── auth.js
│   │
│   └── server.js
│
├── client
│   ├── src
│   │   ├── components
│   │   │   └── MovieCard.vue
│   │   │
│   │   ├── pages
│   │   │   ├── Movies.vue
│   │   │   ├── MovieDetails.vue
│   │   │   ├── Watchlist.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── AdminDashboard.vue
│   │   │
│   │   ├── router
│   │   │   └── index.js
│   │   │
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── main.js
│   │   └── style.css
│   │
│   └── vite.config.js
│
└── README.md

```

---

## 🏗 Tech Stack

- **Frontend:** Vue 3 + Vite  
- **Backend:** Node.js + Express  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT  
- **External APIs:** OMDb API, Giphy API  
- **Deployment:** Render (Backend), Vercel (Frontend)
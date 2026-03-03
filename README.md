## Movie Catalog Fullstack

## App Name: ReelTalk

## 1. Features

### All Users:

- View movies from the catalog  
- Movies are displayed in a card layout  
- Simple registration with only 3 fields  


### Admin Users Only:

- An Admin Dashboard to display all movies in a table and create movies  
- Add Movie button  
- “addMovie” as id  
- Administrators can add new movies to the catalog  
- Administrators can filter movies by title and genre  
- Administrators can update and delete movies  
- Administrators can update and delete user comments  
- Movies are automatically sorted alphabetically from A–Z by title  
- Comments are automatically sorted by createdAt date from newest to oldest   

### Logged In Users:

- View A Single Movie Card  
  - Each movie should have fields like  
    - title, director, year, description, genre, comments  
  - View Movie button for each movie card  
    - “View Movie” as text  
- Users must be able to register and log in using an email and password  
- Users can add their favorite or recently watched movies  
- Users can comment on movies and reply to other viewers’ comments to engage in discussions  
- Users can add movies to their personal watchlist  
- Users can rate movies and like or dislike them   

---

## 2. Page Endpoints

- Register - /register  
- Login - /login  
- Movies - /movies  
  - User Accessible  
- Admin Dashboard - /movies  
  - Admin Accessible  

---

## 3. Deployment Instructions

4. Push your movieApp-client as repo in Github. Then host the app in Vercel.  

5. In the individual repo, in a new s85 folder, create a new file called movieAppClient.json  
   - Copy the template given by your instructor  
   - Add the Vercel hosted link  

6. Add, commit and push your updates to your individual repo.  

7. Add the individual repo link in Boodle as s85 - App Building - FS - 2  

---

## 4. Stretch Goals

### Stretch Goal 1:

- Add comments to movies  
- Add a button for adding comment.  
- Add an id, “addComment”  

### Stretch Goal 2

Admin Users Only:

- Add buttons to Update and Delete movies in the Admin Dashboard  
- Update button  
  - “Update” as text  
- Delete button  
  - “Delete” as text  

---

## 5. movieAppClient.json Requirement

```json
{
"url": "Hosted Vercel URL",
"endpoints": {
"register": "/register",
"login": "/login",
"movies": "/movies"
}
}
```

- Create a movieAppClient.json file using this format. Do not change the endpoints, only add the hosted Vercel URL to the url section.

- For reference: this is the link to the backend API hosted in Render - https://movie-catalog-5baq.onrender.com and the git repo: https://github.com/normanchingcuanco/movie-catalog/tree/master


## Completed Features

### 1. Core Application Features

| Feature | Status | Purpose |
|---------|--------|---------|
| User Registration (Email + Password) | ✅ Built | Allow users to create an account |
| User Login (JWT Auth) | ✅ Built | Authenticate users securely |
| Admin Dashboard (Summary Endpoint) | ✅ Built | Admin can view platform statistics |
| Add Movie (Auto OMDb Fetch - Community Enabled) | ✅ Built | Logged-in users can add movies via OMDb |
| Update Movie (Creator or Admin) | ✅ Built | Movie owner or admin can update movie details |
| Delete Movie (Creator or Admin) | ✅ Built | Movie owner or admin can remove movies |
| Duplicate Movie Guard (Title + Year) | ⚠️ Partially Implemented | Prevent duplicate entries |
| View Single Movie | ✅ Built | Display full movie details |
| Search Movies by Title | ✅ Built | Improve user experience |
| Filter Movies by Genre | ✅ Built | Refined browsing |
| Pagination (Movies) | ✅ Built | Performance scaling |
| Sort by Highest Rated | ✅ Built | Display top-rated movies |
| Sort by Most Liked | ✅ Built | Display most liked movies |
| Sort by Trending | ✅ Built | Rank movies by rating + likes |
| Track Movie Creator (createdBy) | ✅ Built | Identify which user added the movie |

---

### 2. Engagement & Social Features

| Feature | Status | Purpose |
|---------|--------|---------|
| Like Movie | ✅ Built | Increase engagement |
| Prevent Duplicate Movie Likes | ✅ Built | Maintain data integrity |
| Movie Rating System (1–5 Stars) | ✅ Built | Allow user review scoring |
| Automatic Average Rating | ✅ Built | Display calculated rating |
| Add to Watchlist | ✅ Built | Personal user movie list |
| Remove from Watchlist | ✅ Built | Manage personal list |
| View Personal Watchlist | ✅ Built | Display saved movies |
| Add Comment | ✅ Built | Enable discussion |
| Reply to Comment (Threaded) | ✅ Built | Nested conversation |
| Edit Own Comment | ✅ Built | Allow user corrections |
| Delete Own Comment | ✅ Built | User control over content |
| Admin Edit Any Comment | ✅ Built | Moderation capability |
| Admin Delete Any Comment | ✅ Built | Moderation capability |
| Like Comment | ✅ Built | Comment engagement |
| Dislike Comment | ✅ Built | Balanced feedback |
| Prevent Duplicate Comment Reactions | ⚠️ Partially Implemented | Data integrity |

---

### 3. Authentication & Role Control

| Feature | Status | Purpose |
|---------|--------|---------|
| JWT Authentication | ✅ Built | Secure protected routes |
| Role-Based Access Control | ✅ Built | Separate admin and user privileges |
| Creator-Based Authorization | ✅ Built | Only movie owner or admin can modify movie |
| Admin Override Permissions | ✅ Built | Admin full moderation rights |

---

### 4. API Endpoints Implemented

| Feature | Status | Purpose |
|---------|--------|---------|
| POST /users/register | ✅ Built | Register new user |
| POST /users/login | ✅ Built | Login and receive JWT |
| GET /movies/getMovies | ✅ Built | Fetch movies with filters |
| GET /movies/getMovie/:id | ✅ Built | Fetch single movie |
| POST /movies/addMovie | ✅ Built | Add new movie (logged-in users) |
| PATCH /movies/updateMovie/:id | ✅ Built | Update movie (owner or admin) |
| DELETE /movies/deleteMovie/:id | ✅ Built | Delete movie (owner or admin) |
| PATCH /movies/likeMovie/:id | ✅ Built | Like / Unlike movie |
| PATCH /movies/rateMovie/:id | ✅ Built | Rate movie |
| PATCH /movies/addComment/:id | ✅ Built | Add comment |
| PATCH /movies/replyComment/:movieId/:commentId | ✅ Built | Reply to comment |
| PATCH /movies/editComment/:movieId/:commentId | ✅ Built | Edit comment |
| DELETE /movies/deleteComment/:movieId/:commentId | ✅ Built | Delete comment |
| PATCH /movies/reactComment/:movieId/:commentId | ✅ Built | Like / Dislike comment |
| PATCH /movies/watchlist/:movieId | ✅ Built | Toggle watchlist |
| GET /movies/watchlist | ✅ Built | Get user watchlist |
| GET /movies/admin/dashboard | ✅ Built | Admin dashboard summary |

---

### 5. Advanced Moderation & Future Community Features

| Feature | Status | Purpose |
|---------|--------|---------|
| Soft Delete Instead of Hard Delete | ❌ Not Built | Allow data recovery and audit trail |
| Report Comment System | ❌ Not Built | Community-driven moderation |
| Report Movie System | ❌ Not Built | Flag inappropriate content |
| Ban / Suspend User | ❌ Not Built | Admin enforcement control |
| Movie Approval Workflow | ❌ Not Built | Admin review before public visibility |
| Content Visibility Toggle (Public/Private) | ❌ Not Built | Control movie exposure |
| Rate Limiting (Anti-Spam) | ❌ Not Built | Prevent abuse and spam |
| Comment Moderation Queue | ❌ Not Built | Admin review flagged comments |
| User Profile Page (Contribution History) | ❌ Not Built | Display user-added movies and activity |

---

### 6. System Optimization & Architecture Improvements

| Feature | Status | Purpose |
|---------|--------|---------|
| Database Indexing for Performance | ⚠️ Partially Implemented | Improve query speed |
| Pagination for Comments | ❌ Not Built | Optimize large discussion threads |
| Centralized Error Handling Middleware | ❌ Not Built | Cleaner API structure |
| Standardized API Response Format | ❌ Not Built | Consistent API design |
| Input Validation Middleware (Joi / Express Validator) | ❌ Not Built | Stronger request validation |
| Logging & Monitoring (Winston / Morgan) | ❌ Not Built | Production-level observability |
| API Documentation (Swagger / Postman Docs) | ❌ Not Built | Developer-friendly integration |
| Caching Layer (Redis) | ❌ Not Built | Improve read performance |
| Environment-Based Configuration | ✅ Built | Production deployment readiness |
<template>

<!-- ================= GLOBAL TOAST ================= -->
<div v-if="successMsg || errorMsg" class="toast-wrapper">
  <div class="toast" :class="successMsg ? 'toast-success' : 'toast-error'">
    {{ successMsg || errorMsg }}
  </div>
</div>

<div class="container">

<h2>Admin Dashboard</h2>

<!-- ================= METRICS ================= -->
<div class="cards">

  <div class="card metric-card">
    <div class="label">
      Total Users
      <span class="metric-help">
        ⓘ
        <span class="metric-tooltip">
          Total Users = number of registered users in the database
        </span>
      </span>
    </div>
    <div class="value">{{ metrics.totalUsers }}</div>
  </div>

  <div class="card metric-card">
    <div class="label">
      Total Movies
      <span class="metric-help">
        ⓘ
        <span class="metric-tooltip">
          Total Movies = number of movie documents stored in the database
        </span>
      </span>
    </div>
    <div class="value">{{ metrics.totalMovies }}</div>
  </div>

  <div class="card metric-card">
    <div class="label">
      Average Platform Rating
      <span class="metric-help">
        ⓘ
        <span class="metric-tooltip">
          Average Platform Rating = average of all movie ratings across the platform
        </span>
      </span>
    </div>
    <div class="value">{{ Number(metrics.averagePlatformRating || 0).toFixed(1) }}</div>
  </div>

  <div class="card metric-card">
    <div class="label">
      Total Comments
      <span class="metric-help">
        ⓘ
        <span class="metric-tooltip">
          Total Comments = total number of comments across all movies
        </span>
      </span>
    </div>
    <div class="value">{{ metrics.totalComments }}</div>
  </div>

  <div class="card metric-card">
    <div class="label">
      Total Ratings
      <span class="metric-help">
        ⓘ
        <span class="metric-tooltip">
          Total Ratings = total number of user ratings across all movies
        </span>
      </span>
    </div>
    <div class="value">{{ metrics.totalRatings }}</div>
  </div>

  <div class="card metric-card">
    <div class="label">
      Total Movie Likes
      <span class="metric-help">
        ⓘ
        <span class="metric-tooltip">
          Total Movie Likes = sum of all likes arrays across movies
        </span>
      </span>
    </div>
    <div class="value">{{ metrics.totalMovieLikes }}</div>
  </div>

</div>

<hr />

<!-- ================= MOVIE ANALYTICS ================= -->

<div class="section-header">
<h3>Top Movies by Views</h3>
</div>

<div class="table-wrapper">

<table v-if="movies.length">

<thead>
<tr>
<th>Rank</th>
<th>Title</th>
<th>Views</th>
</tr>
</thead>

<tbody>

<tr
v-for="(movie, index) in movies
.slice()
.sort((a,b)=>(b.views||0)-(a.views||0))
.slice(0,5)"
:key="'views-'+movie._id"
>

<td>{{ index + 1 }}</td>
<td>{{ movie.title }}</td>
<td>{{ movie.views || 0 }}</td>

</tr>

</tbody>

</table>

</div>

<hr />

<!-- ================= TOP MOVIES BY LIKES ================= -->

<div class="section-header">
<h3>Top Movies by Likes</h3>
</div>

<div class="table-wrapper">

<table v-if="movies.length">

<thead>
<tr>
<th>Rank</th>
<th>Title</th>
<th>Likes</th>
</tr>
</thead>

<tbody>

<tr
v-for="(movie, index) in movies
.slice()
.sort((a,b)=>(b.likes?.length||0)-(a.likes?.length||0))
.slice(0,5)"
:key="'likes-'+movie._id"
>

<td>{{ index + 1 }}</td>
<td>{{ movie.title }}</td>
<td>{{ movie.likes?.length || 0 }}</td>

</tr>

</tbody>

</table>

</div>

<hr />

<!-- ================= TOP MOVIES BY RATING ================= -->

<div class="section-header">
<h3>Top Movies by Rating</h3>
</div>

<div class="table-wrapper">

<table v-if="movies.length">

<thead>
<tr>
<th>Rank</th>
<th>Title</th>
<th>Rating</th>
</tr>
</thead>

<tbody>

<tr
v-for="(movie, index) in movies
.slice()
.sort((a,b)=>(b.averageRating||0)-(a.averageRating||0))
.slice(0,5)"
:key="'rating-'+movie._id"
>

<td>{{ index + 1 }}</td>
<td>{{ movie.title }}</td>
<td>{{ (movie.averageRating || 0).toFixed(1) }}</td>

</tr>

</tbody>

</table>

</div>

<hr />

<!-- ================= SEARCH ================= -->
<form class="search-section card" @submit.prevent="searchMovies">

  <div class="search-fields">
    <input v-model="search" placeholder="Search by title..." />
    <input v-model="genre" placeholder="Filter by genre..." />
  </div>

  <div class="search-actions">
    <button class="primary">Search</button>
    <button type="button" class="secondary" @click="resetFilters">
      Reset
    </button>
  </div>

</form>

<hr />

<!-- ================= ADD MOVIE ================= -->
<h3>Add Movie (OMDb)</h3>

<form class="form" @submit.prevent="addMovieByTitle">
  <input v-model="newTitle" placeholder="Enter movie title" />
  <button class="primary">Add Movie</button>
</form>

<hr />

<!-- ================= MOVIES ================= -->

<div class="section-header" ref="moviesSection">
<h3>Movies</h3>
</div>

<div class="table-wrapper">

<table v-if="movies.length">

<thead>
<tr>
<th>Title</th>
<th>Director</th>
<th>Year</th>
<th>Genre</th>
<th>Description</th>
<th>Likes</th>
<th>Views</th>
<th>Rating</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

<tr v-for="movie in movies" :key="movie._id">

<td>{{ movie.title }}</td>
<td>{{ movie.director || "—" }}</td>
<td>{{ movie.year || "—" }}</td>
<td>{{ movie.genre || "—" }}</td>

<td class="description-cell">
{{ movie.description || "—" }}
</td>

<td>{{ movie.likes?.length || 0 }}</td>
<td>{{ movie.views || 0 }}</td>
<td>{{ (movie.averageRating || 0).toFixed(1) }}</td>

<td class="actions-cell">

<button class="primary" @click="startEdit(movie)">
Update
</button>

<button class="danger" @click="deleteMovie(movie._id)">
Delete
</button>

</td>

</tr>

</tbody>

</table>

</div>

<p v-if="!movies.length" class="muted">No movies found.</p>

<!-- ================= MOVIE PAGINATION ================= -->

<div v-if="movieTotalPages > 1" class="pagination">

<button
class="secondary"
:disabled="moviePage === 1"
@click="prevMoviePage"
>
‹
</button>

<button
v-for="page in moviePages"
:key="page"
:class="page === moviePage ? 'primary' : 'secondary'"
@click="goToMoviePage(page)"
>
{{ page }}
</button>

<button
class="secondary"
:disabled="moviePage === movieTotalPages"
@click="nextMoviePage"
>
›
</button>

</div>

<hr />

<!-- ================= COMMENTS ================= -->

<div class="section-header" ref="commentsSection">
<h3>All Comments</h3>

<button class="secondary" @click="resetComments">
Refresh
</button>

</div>

<div class="table-wrapper">

<table v-if="allComments.length">

<thead>
<tr>
<th>Movie</th>
<th>User</th>
<th>Comment</th>
<th>Parent</th>
<th>👍</th>
<th>👎</th>
<th>Created</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

<tr v-for="c in allComments" :key="c.commentId">

<td>
<router-link :to="`/movies/${c.movieId}`" class="movie-link">
{{ c.movieTitle }}
</router-link>
</td>

<td>{{ c.username }}</td>

<td class="comment-cell">
{{ c.comment }}
</td>

<td>
{{ c.parentCommentId ? "Reply" : "Top-level" }}
</td>

<td>{{ c.likes }}</td>
<td>{{ c.dislikes }}</td>

<td>{{ formatDate(c.createdAt) }}</td>

<td class="actions-cell">

<button class="primary" @click="startEditComment(c)">
Edit
</button>

<button class="danger" @click="deleteComment(c)">
Delete
</button>

</td>

</tr>

</tbody>

</table>

</div>

<p v-if="!allComments.length" class="muted">
No comments found.
</p>

<!-- ================= COMMENT PAGINATION ================= -->

<div v-if="commentTotalPages > 1" class="pagination">

<button
class="secondary"
:disabled="commentPage === 1"
@click="prevCommentPage"
>
‹
</button>

<button
v-for="page in commentPages"
:key="page"
:class="page === commentPage ? 'primary' : 'secondary'"
@click="goToCommentPage(page)"
>
{{ page }}
</button>

<button
class="secondary"
:disabled="commentPage === commentTotalPages"
@click="nextCommentPage"
>
›
</button>

</div>

</div>

</template>

<script>

import api from "../api"
import { useAuthStore } from "../auth"

export default {

setup() {
const auth = useAuthStore()
return { auth }
},

data() {
return {

metrics: {},

movies: [],
moviePage: 1,
movieLimit: 10,
movieTotalPages: 1,

allComments: [],
commentPage: 1,
commentLimit: 10,
commentTotalPages: 1,

search: "",
genre: "",

newTitle: "",

editingMovie: null,
editingComment: null,

successMsg: "",
errorMsg: ""

}
},

computed: {

moviePages() {
return Array.from({ length: this.movieTotalPages }, (_, i) => i + 1)
},

commentPages() {
return Array.from({ length: this.commentTotalPages }, (_, i) => i + 1)
}

},

async mounted() {
await this.refreshAll()
},

methods: {

authHeaders() {
return { Authorization: `Bearer ${this.auth.token}` }
},

formatDate(value) {
if (!value) return "—"
return new Date(value).toLocaleString()
},

scrollToMovies() {
const section = this.$refs.moviesSection

if (section) {
section.scrollIntoView({
behavior: "smooth",
block: "start"
})
}
},

scrollToComments() {
const section = this.$refs.commentsSection

if (section) {
section.scrollIntoView({
behavior: "smooth",
block: "start"
})
}
},

async refreshAll() {
await this.fetchMetrics()
await this.fetchMovies()
await this.fetchAllComments()
},

async fetchMetrics() {

const res = await api.get(
"/movies/admin/dashboard",
{ headers: this.authHeaders() }
)

this.metrics = res.data

},

async fetchMovies() {

const res = await api.get("/movies/getMovies", {
params: {
search: this.search,
genre: this.genre,
page: this.moviePage,
limit: this.movieLimit,
sort: "titleAsc"
}
})

this.movies = res.data.movies || []
this.movieTotalPages = res.data.totalPages || 1

},

goToMoviePage(page) {
this.moviePage = page
this.fetchMovies()

this.$nextTick(() => {
this.scrollToMovies()
})
},

nextMoviePage() {
if (this.moviePage < this.movieTotalPages) {
this.moviePage++
this.fetchMovies()

this.$nextTick(() => {
this.scrollToMovies()
})
}
},

prevMoviePage() {
if (this.moviePage > 1) {
this.moviePage--
this.fetchMovies()

this.$nextTick(() => {
this.scrollToMovies()
})
}
},

searchMovies() {
this.moviePage = 1
this.fetchMovies()

this.$nextTick(() => {
this.scrollToMovies()
})
},

resetFilters() {
this.search = ""
this.genre = ""
this.moviePage = 1
this.fetchMovies()

this.$nextTick(() => {
this.scrollToMovies()
})
},

async addMovieByTitle() {

if (!this.newTitle.trim()) return

await api.post(
"/movies/addMovie",
{ title: this.newTitle },
{ headers: this.authHeaders() }
)

this.newTitle = ""
this.fetchMovies()

this.$nextTick(() => {
this.scrollToMovies()
})

},

startEdit(movie) {
this.editingMovie = { ...movie }
},

async deleteMovie(id) {

await api.delete(
`/movies/deleteMovie/${id}`,
{ headers: this.authHeaders() }
)

this.fetchMovies()

this.$nextTick(() => {
this.scrollToMovies()
})

},

async fetchAllComments() {

const res = await api.get(
"/movies/admin/getAllComments",
{
params: {
page: this.commentPage,
limit: this.commentLimit
},
headers: this.authHeaders()
}
)

this.allComments = res.data.comments || []
this.commentTotalPages = res.data.totalPages || 1

},

resetComments() {
this.commentPage = 1
this.fetchAllComments()

this.$nextTick(() => {
this.scrollToComments()
})
},

goToCommentPage(page) {
this.commentPage = page
this.fetchAllComments()

this.$nextTick(() => {
this.scrollToComments()
})
},

nextCommentPage() {
if (this.commentPage < this.commentTotalPages) {
this.commentPage++
this.fetchAllComments()

this.$nextTick(() => {
this.scrollToComments()
})
}
},

prevCommentPage() {
if (this.commentPage > 1) {
this.commentPage--
this.fetchAllComments()

this.$nextTick(() => {
this.scrollToComments()
})
}
},

startEditComment(comment) {
this.editingComment = { ...comment }
},

async deleteComment(comment) {

await api.delete(
`/movies/deleteComment/${comment.movieId}/${comment.commentId}`,
{ headers: this.authHeaders() }
)

this.fetchAllComments()

this.$nextTick(() => {
this.scrollToComments()
})

}

}

}

</script>

<style scoped>

/* ================= CONTAINER ================= */
.container {
  padding: 40px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* ================= METRIC CARDS ================= */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 25px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 18px 22px;
  min-width: 200px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}

/* ================= SEARCH FORM ================= */

.search-section {
  margin: 35px 0;
  padding: 25px 30px;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-fields {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.search-fields input {
  flex: 1;
  min-width: 260px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid #ddd;
  font-size: 14px;
}

.search-actions {
  display: flex;
  gap: 16px;
}

.search-actions button {
  min-width: 120px;
}

/* ================= TABLE WRAPPER ================= */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

/* ================= TABLE ================= */
table {
  width: 100%;
  table-layout: fixed; /* 🔥 prevents overflow crush */
  border-collapse: collapse;
  margin-top: 25px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
}

th {
  background: linear-gradient(135deg, #c3472d, #a13b24);
  color: white;
  padding: 14px;
  font-size: 14px;
}

td {
  padding: 14px;
  border-top: 1px solid #eee;
  vertical-align: top;
  word-break: break-word;
}

/* Make description use more space */
.description-cell {
  max-width: 500px;
}

/* ================= ACTION BUTTONS ================= */
.actions-cell {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 120px;        /* 🔥 fixed width so it never gets cropped */
  flex-shrink: 0;      /* 🔥 prevents shrinking */
}

.actions-cell button {
  width: 100%;
}

/* ================= EDIT SECTION ================= */
.edit-section {
  margin-top: 35px;
  padding: 24px;
}

/* ================= TEXT ================= */
.muted {
  color: #666;
}

.error {
  color: red;
  font-weight: 600;
}

.success {
  color: green;
  font-weight: 600;
}

.form {
  margin-bottom: 40px;
}

.form button {
  margin-top: 12px;
}

.movie-link {
  color: #c3472d;
  font-weight: 600;
  text-decoration: none;
}

.movie-link:hover {
  text-decoration: underline;
}

.comment-cell {
  max-width: 400px;
  word-break: break-word;
}

/* ================= ALL COMMENTS SECTION BLOCK ================= */

.section-header {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #ddd;
}

/* ================= MODAL OVERLAY ================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* ================= MODAL CARD ================= */
.modal {
  background: white;
  width: 520px;
  max-width: 95%;
  padding: 30px;
  border-radius: 18px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.2s ease;
}

.modal input,
.modal textarea {
  width: 100%;
  margin-bottom: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 10px;
}

/* Optional smooth animation */
@keyframes fadeIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ================= ADD MOVIE STATUS ================= */

.success-message {
  margin-top: 12px;
  padding: 10px 14px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
}

.error-message {
  margin-top: 12px;
  padding: 10px 14px;
  background: #fdecea;
  color: #c62828;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
}

/* ================= TOAST NOTIFICATION ================= */

.toast-wrapper {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 9999;
}

.toast {
  min-width: 260px;
  padding: 14px 18px;
  border-radius: 14px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease forwards;
}

.toast-success {
  background: #2e7d32;
  color: white;
}

.toast-error {
  background: #c62828;
  color: white;
}

.pagination {
display:flex;
gap:8px;
margin-top:20px;
align-items:center;
flex-wrap:wrap;
}

.pagination button {
min-width:36px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {

  table {
    min-width: 900px; /* force horizontal scroll */
  }

  .actions-cell {
    min-width: 160px;
  }

}

/* ================= METRIC HELP ICON ================= */

.metric-help {
  position: relative;
  margin-left: 6px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.6;
}

.metric-help:hover {
  opacity: 1;
}

/* Tooltip */

.metric-tooltip {
  position: absolute;
  bottom: 140%;
  left: 50%;
  transform: translateX(-50%);

  background: #1e1e1e;
  color: white;

  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.metric-help:hover .metric-tooltip {
  opacity: 1;
}

</style>
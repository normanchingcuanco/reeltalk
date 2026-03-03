<template>

  <!-- ================= GLOBAL TOAST ================= -->
  <div v-if="successMsg || errorMsg" class="toast-wrapper">
    <div
      class="toast"
      :class="successMsg ? 'toast-success' : 'toast-error'"
    >
      {{ successMsg || errorMsg }}
    </div>
  </div>

  <div class="container">
    <h2>Admin Dashboard</h2>

    <!-- ================= METRICS ================= -->
    <div class="cards">
      <div class="card metric-card">
        <div class="label">Total Users</div>
        <div class="value">{{ metrics.totalUsers }}</div>
      </div>

      <div class="card metric-card">
        <div class="label">Total Movies</div>
        <div class="value">{{ metrics.totalMovies }}</div>
      </div>

      <div class="card metric-card">
        <div class="label">Total Comments</div>
        <div class="value">{{ metrics.totalComments }}</div>
      </div>

      <div class="card metric-card">
        <div class="label">Total Ratings</div>
        <div class="value">{{ metrics.totalRatings }}</div>
      </div>

      <div class="card metric-card">
        <div class="label">Total Movie Likes</div>
        <div class="value">{{ metrics.totalMovieLikes }}</div>
      </div>
    </div>

    <hr />

    <!-- ================= SEARCH SECTION ================= -->
    <form class="search-section card" @submit.prevent="fetchMovies">
      <div class="search-fields">
        <input v-model="search" placeholder="Search by title..." />
        <input v-model="genre" placeholder="Filter by genre..." />
      </div>

      <div class="search-actions">
        <button type="submit" class="primary">Search</button>
        <button type="button" class="secondary" @click="resetFilters">
          Reset
        </button>
      </div>
    </form>

    <hr />

    <!-- ================= ADD MOVIE ================= -->
    <h3>Add Movie (OMDb)</h3>

    <form class="form" @submit.prevent="addMovieByTitle">
      <input
        v-model="newTitle"
        placeholder="Enter movie title (e.g. Inception)"
      />
      <button type="submit" class="primary">
        Add Movie
      </button>
    </form>

    <hr />

    <!-- ================= MOVIES SECTION ================= -->
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

    <!-- ================= ALL COMMENTS ================= -->
    <hr />

    <div class="section-header">
      <h3>All Comments</h3>
      <button class="secondary" @click="fetchAllComments">
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
              <router-link
                :to="`/movies/${c.movieId}`"
                class="movie-link"
              >
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
  </div>

  <!-- ================= EDIT MOVIE MODAL ================= -->
  <div
    v-if="editingMovie"
    class="modal-overlay"
    @click.self="editingMovie = null"
  >
    <div class="modal">
      <h3>Edit Movie</h3>

      <input v-model="editingMovie.title" placeholder="Title" />
      <input v-model="editingMovie.director" placeholder="Director" />
      <input v-model="editingMovie.year" type="number" placeholder="Year" />
      <input v-model="editingMovie.genre" placeholder="Genre" />
      <textarea
        v-model="editingMovie.description"
        placeholder="Description"
      ></textarea>

      <div class="modal-actions">
        <button class="primary" @click="updateMovie">Save</button>
        <button class="secondary" @click="editingMovie = null">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <!-- ================= EDIT COMMENT MODAL ================= -->
  <div
    v-if="editingComment"
    class="modal-overlay"
    @click.self="editingComment = null"
  >
    <div class="modal">
      <h3>Edit Comment</h3>

      <textarea
        v-model="editingComment.comment"
        placeholder="Edit comment..."
      ></textarea>

      <div class="modal-actions">
        <button class="primary" @click="updateComment">
          Save
        </button>

        <button
          class="secondary"
          @click="editingComment = null"
        >
          Cancel
        </button>
      </div>
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
      allComments: [],
      search: "",
      genre: "",
      newTitle: "",
      editingMovie: null,
      editingComment: null,
      isAdding: false,
      errorMsg: "",
      successMsg: ""
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

    async refreshAll() {
      await this.fetchMetrics()
      await this.fetchMovies(false)   // disable scroll
      await this.fetchAllComments()
    },

    async fetchMetrics() {
      const res = await api.get("/movies/admin/dashboard", {
        headers: this.authHeaders()
      })
      this.metrics = res.data
    },

    // ✅ UPDATED: Uses admin endpoint (sorted A → Z from backend)
    async fetchMovies(shouldScroll = true) {
      const res = await api.get("/movies/getMovies", {
        params: {
          search: this.search || "",
          genre: this.genre || "",
          page: 1,
          limit: 50,
          sort: "titleAsc"
        }
      })

      this.movies = res.data.movies || []

      if (shouldScroll) {
        this.$nextTick(() => {
          const el = this.$refs.moviesSection
          if (el) {
            const y =
              el.getBoundingClientRect().top +
              window.pageYOffset -
              100

            window.scrollTo({
              top: y,
              behavior: "smooth"
            })
          }
        })
      }
    },

    resetFilters() {
      this.search = ""
      this.genre = ""
      this.fetchMovies()
    },

    async addMovieByTitle() {
      const title = this.newTitle.trim()
      if (!title) return

      this.isAdding = true
      this.errorMsg = ""
      this.successMsg = ""

      try {
        await api.post(
          "/movies/addMovie",
          { title },
          { headers: this.authHeaders() }
        )

        this.successMsg = `"${title}" was added successfully.`
        this.newTitle = ""

        await this.refreshAll()

      } catch (error) {
        this.errorMsg =
          error.response?.data?.message ||
          "Could not find movie in OMDb."

      } finally {
        this.isAdding = false

        setTimeout(() => {
          this.successMsg = ""
          this.errorMsg = ""
        }, 3000)
      }
    },

    /* ================= MOVIE EDIT ================= */

    startEdit(movie) {
      this.editingMovie = { ...movie }
    },

    async updateMovie() {
      try {
        await api.patch(
          `/movies/updateMovie/${this.editingMovie._id}`,
          this.editingMovie,
          { headers: this.authHeaders() }
        )

        this.editingMovie = null
        await this.fetchMovies(false)

        this.successMsg = "Movie updated successfully."

      } catch (error) {
        this.errorMsg =
          error.response?.data?.message ||
          "Failed to update movie."
      }

      setTimeout(() => {
        this.successMsg = ""
        this.errorMsg = ""
      }, 3000)
    },

    async deleteMovie(id) {
      this.successMsg = ""
      this.errorMsg = ""

      try {
        await api.delete(`/movies/deleteMovie/${id}`, {
          headers: this.authHeaders()
        })

        this.successMsg = "Movie successfully deleted."

        await this.fetchMovies(false)
        await this.fetchMetrics()

      } catch (error) {
        this.errorMsg =
          error.response?.data?.message ||
          "Failed to delete movie."
      }

      setTimeout(() => {
        this.successMsg = ""
        this.errorMsg = ""
      }, 3000)
    },

    /* ================= COMMENTS ================= */

    async fetchAllComments() {
      const res = await api.get("/movies/admin/getAllComments", {
        headers: this.authHeaders()
      })
      this.allComments = res.data.comments || []
    },

    startEditComment(comment) {
      this.editingComment = { ...comment }
    },

    async updateComment() {
      if (!this.editingComment?.comment?.trim()) return

      try {
        await api.patch(
          `/movies/editComment/${this.editingComment.movieId}/${this.editingComment.commentId}`,
          { comment: this.editingComment.comment },
          { headers: this.authHeaders() }
        )

        this.editingComment = null
        await this.fetchAllComments()

        this.successMsg = "Comment updated successfully."

      } catch (error) {
        this.errorMsg =
          error.response?.data?.message ||
          "Failed to update comment."
      }

      setTimeout(() => {
        this.successMsg = ""
        this.errorMsg = ""
      }, 3000)
    },

    async deleteComment(comment) {
      await api.delete(
        `/movies/deleteComment/${comment.movieId}/${comment.commentId}`,
        { headers: this.authHeaders() }
      )

      await this.fetchAllComments()
      await this.fetchMetrics()

      this.successMsg = "Comment deleted successfully."

      setTimeout(() => {
        this.successMsg = ""
      }, 3000)
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

</style>
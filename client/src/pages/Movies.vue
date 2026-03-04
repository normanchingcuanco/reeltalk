<template>
  <div class="container">
    <div class="add-movie card" v-if="auth.token">
      <h3>Add a Movie</h3>
      <p class="hint">Enter a title — details + poster will be fetched from OMDb.</p>

      <form class="form" @submit.prevent="addMovie">

        <input
          v-model="newTitle"
          placeholder="Enter movie title"
        />

        <button
          class="primary"
          :disabled="isAdding"
        >
          {{ isAdding ? "Adding..." : "Add Movie" }}
        </button>

      </form>

      <p v-if="addError" class="error">{{ addError }}</p>
      <p v-if="addSuccess" class="success">{{ addSuccess }}</p>
    </div>

    <hr />

    <div class="section-header">
      <h2>🔥 Trending Movies</h2>
    </div>

    <div class="grid trending">
      <MovieCard
        v-for="(movie, index) in trendingMovies"
        :key="movie._id"
        :movie="movie"
        :rank="index + 1"
        :watchlistIds="watchlistIds"
        @refresh="refreshAll"
        @watchlist-changed="refreshWatchlist"
      />
    </div>

    <hr />

    <div class="filter-bar search-section">
      <h2>All Movies</h2>
    </div>

    <div class="filter-bar search-section">

      <div class="search-fields">
        <input
          v-model="search"
          placeholder="Search by title..."
          @keyup.enter="applyFilters"
        />

        <input
          v-model="genre"
          placeholder="Filter by genre..."
          @keyup.enter="applyFilters"
        />
      </div>

      <div class="search-actions">

        <select v-model="sort">
          <option value="">Newest</option>
          <option value="highestRated">Highest Rated</option>
          <option value="mostLiked">Most Liked</option>
          <option
            value="trending"
            title="Trending Score = (likes × 2) + comments + (rating × 2)"
          >
            Trending 🔥
          </option>
        </select>

        <button class="primary" @click="applyFilters">
          Apply
        </button>

        <button class="secondary" @click="resetFilters">
          Reset
        </button>

      </div>

    </div>

    <div class="grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie._id"
        :movie="movie"
        :watchlistIds="watchlistIds"
        @refresh="refreshAll"
        @watchlist-changed="refreshWatchlist"
      />
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button class="primary" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        Previous
      </button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button class="primary" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import api from "../api"
import { useAuthStore } from "../auth"
import MovieCard from "../components/MovieCard.vue"

export default {
  components: { MovieCard },

  data() {
    return {
      movies: [],
      trendingMovies: [],
      search: "",
      genre: "",
      sort: "",
      currentPage: 1,
      totalPages: 1,
      limit: 12,

      newTitle: "",
      isAdding: false,
      addError: "",
      addSuccess: "",

      watchlistIds: []
    }
  },

  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  async mounted() {
    await this.fetchTrending()
    await this.refreshAll()
  },

  methods: {

    async fetchTrending() {
      const res = await api.get("/movies/getMovies", {
        params: {
          sort: "trending",
          limit: 10
        }
      })

      this.trendingMovies = res.data.movies || []
    },

    async fetchMovies() {
      const res = await api.get("/movies/getMovies", {
        params: {
          search: this.search,
          genre: this.genre,
          sort: this.sort,
          page: this.currentPage,
          limit: this.limit
        }
      })

      this.movies = res.data.movies || []
      this.totalPages = res.data.totalPages || 1
    },

    async refreshWatchlist() {
      if (!this.auth.token) {
        this.watchlistIds = []
        return
      }

      try {
        const res = await api.get("/movies/watchlist", {
          headers: { Authorization: `Bearer ${this.auth.token}` }
        })

        const list = res.data.watchlist || []
        this.watchlistIds = list.map((m) => String(m._id))
      } catch (e) {
        this.watchlistIds = []
      }
    },

    async refreshAll() {
      await this.fetchMovies()
      await this.refreshWatchlist()
    },

    applyFilters() {
      this.currentPage = 1
      this.fetchMovies()
    },

    resetFilters() {
      this.search = ""
      this.genre = ""
      this.sort = ""
      this.currentPage = 1
      this.fetchMovies()
    },

    changePage(page) {
      this.currentPage = page
      this.fetchMovies()
    },

    async addMovie() {
      this.addError = ""
      this.addSuccess = ""

      const title = this.newTitle.trim()
      if (!title) return

      try {
        this.isAdding = true

        await api.post(
          "/movies/addMovie",
          { title },
          { headers: { Authorization: `Bearer ${this.auth.token}` } }
        )

        this.newTitle = ""
        this.addSuccess = "Movie added!"
        this.currentPage = 1
        await this.refreshAll()
      } catch (error) {
        this.addError = error.response?.data?.message || "Failed to add movie."
      } finally {
        this.isAdding = false
      }
    }
  }
}
</script>

<style scoped>

/* ===============================
   DESKTOP FIX
=============================== */
@media (min-width: 1025px) {

  .container {
    max-width: none;        /* remove 1100px cap */
    margin: 0;              /* stop centering */
    padding-left: 40px;     /* normal spacing from sidebar */
    padding-right: 40px;
  }

  .cards {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

}

/* ===============================
   BASE (UNCHANGED)
=============================== */

/* =============================
   DESKTOP FULL WIDTH FIX
============================= */
@media (min-width: 1025px) {
  .container {
    max-width: none;
    margin: 0;
  }
}

/* ===============================
   MOVIE GRID
=============================== */

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

/* ===============================
   CARD
=============================== */

.card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 320px;
}

/* ===============================
   POSTER
=============================== */

.poster {
  width: 100%;
  height: auto;
  border-radius: 14px;
  display: block;
}

/* ===============================
   ADD MOVIE SECTION
=============================== */

.add-movie {
  margin-bottom: 40px;
  max-width: 520px;
}

/* ===============================
   SECTION SPACING (ADMIN STYLE)
=============================== */

.section-header {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #ddd;
}

.section-header h2 {
  margin-bottom: 10px;
  font-size: 22px;
}

.trending {
  margin-top: 20px;
  margin-bottom: 40px;
}

/* ===============================
   FILTER BAR
=============================== */

.filter-bar {
  margin: 35px 0;
  padding: 25px 30px;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: center;
}

.filter-bar button {
  justify-self: start;
}

/* ===============================
   MOBILE (DO NOT TOUCH)
=============================== */

@media (max-width: 768px) {

  .container {
    padding: 12px;
  }

  .cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .card {
    max-width: 100%;
  }

}

.add-movie.card {
  max-width: 700px;
  width: 100%;
}

</style>
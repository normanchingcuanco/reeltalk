<template>
  <div class="container">
    <h2>My Watchlist</h2>

    <div v-if="watchlist.length" class="grid">
      <MovieCard
        v-for="movie in watchlist"
        :key="movie._id"
        :movie="movie"
        :watchlistIds="watchlistIds"
        @refresh="refreshAll"
        @watchlist-changed="refreshAll"
      />
    </div>

    <p v-else>No movies in your watchlist yet.</p>
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
      watchlist: [],
      watchlistIds: []
    }
  },

  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  async mounted() {
    await this.refreshAll()
  },

  methods: {
    async refreshAll() {
      const res = await api.get("/movies/watchlist", {
        headers: { Authorization: `Bearer ${this.auth.token}` }
      })

      this.watchlist = res.data.watchlist || []
      this.watchlistIds = this.watchlist.map((m) => String(m._id))
    }
  }
}
</script>

<style scoped>

/* Container */
.container {
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Cards Grid */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  justify-items: center;
}

/* Card */
.card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 320px;
}

/* Poster */
.poster {
  width: 100%;
  height: auto;
  border-radius: 14px;
  display: block;
}

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

</style>
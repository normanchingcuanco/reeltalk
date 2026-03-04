<template>
  <div class="card movie-card">

    <div class="poster-wrapper">

      <div v-if="rank" class="rank-badge">
        #{{ rank }}
      </div>

      <img
        :src="posterSrc"
        class="poster"
      />

    </div>

    <div class="card-content">
      <h3 class="movie-title">{{ movie.title }}</h3>

      <p class="meta">
        <strong>{{ movie.year || "—" }}</strong> • {{ movie.genre || "—" }}
      </p>

      <p class="description">
        {{ truncatedDescription }}
      </p>

      <div class="stats">
        <span>⭐ {{ (movie.averageRating || 0).toFixed(1) }}</span>
        <span>❤️ {{ movie.likes?.length || 0 }}</span>
        <span>🗳 {{ movie.ratings?.length || 0 }}</span>
      </div>

      <div v-if="auth.token" class="actions">
        <button class="ghost" @click="toggleLike">
          {{ hasLiked ? "Unlike ❤️" : "Like ❤️" }}
        </button>

        <button class="secondary" @click="toggleWatchlist">
          {{ inWatchlist ? "Remove 📌" : "Watchlist 📌" }}
        </button>
      </div>

      <router-link :to="`/movies/${movie._id}`">
        <button class="primary view-btn">
          View Movie
        </button>
      </router-link>

    </div>

  </div>
</template>

<script>
import api from "../api"
import { useAuthStore } from "../auth"

export default {
  props: ["movie", "watchlistIds", "rank"],

  data() {
    return {
      selectedRating: "",
      isBusy: false
    }
  },

  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  computed: {
    posterSrc() {
      return (
        this.movie.posterUrl ||
        "https://via.placeholder.com/300x450?text=No+Poster"
      )
    },

    truncatedDescription() {
      if (!this.movie.description) return ""
      return this.movie.description.length > 110
        ? this.movie.description.substring(0, 110) + "..."
        : this.movie.description
    },

    hasLiked() {
      const userId = String(this.auth.userId || "")
      return (this.movie.likes || []).some((id) => String(id) === userId)
    },

    inWatchlist() {
      const movieId = String(this.movie?._id || "")
      const ids = (this.watchlistIds || []).map((id) => String(id))
      return ids.includes(movieId)
    }
  },

  methods: {
    async toggleLike() {
      if (!this.auth.token) return

      try {
        this.isBusy = true
        await api.patch(
          `/movies/likeMovie/${this.movie._id}`,
          {},
          { headers: { Authorization: `Bearer ${this.auth.token}` } }
        )
        this.$emit("refresh")
      } catch (e) {
        // ignore UI noise
      } finally {
        this.isBusy = false
      }
    },

    async rateMovie() {
      if (!this.auth.token || !this.selectedRating) return

      try {
        this.isBusy = true
        await api.patch(
          `/movies/rateMovie/${this.movie._id}`,
          { value: Number(this.selectedRating) },
          { headers: { Authorization: `Bearer ${this.auth.token}` } }
        )
        this.selectedRating = ""
        this.$emit("refresh")
      } catch (e) {
        // ignore UI noise
      } finally {
        this.isBusy = false
      }
    },

    async toggleWatchlist() {
      if (!this.auth.token) return

      try {
        this.isBusy = true
        await api.patch(
          `/movies/watchlist/${this.movie._id}`,
          {},
          { headers: { Authorization: `Bearer ${this.auth.token}` } }
        )

        this.$emit("watchlist-changed")
        this.$emit("refresh")
      } catch (e) {
        // ignore UI noise
      } finally {
        this.isBusy = false
      }
    }
  }
}
</script>

<style scoped>

  /* ============================= */
  /* MOVIE CARD - DESKTOP READY */
  /* ============================= */

  .movie-card {
    width: 100%;              /* 🔥 Let grid control width */
    max-width: 320px;         /* Prevent over-stretching */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  /* Poster wrapper */
  .poster-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative; /* Needed for rank badge positioning */
  }

  /* Trending Rank Badge */
  .rank-badge {
    position: absolute;
    top: 12px;
    left: 12px;

    background: linear-gradient(135deg, #ff7a18, #ff3d00);
    color: white;

    font-weight: 700;
    font-size: 13px;

    padding: 6px 10px;
    border-radius: 999px;

    box-shadow: 0 4px 12px rgba(0,0,0,0.25);

    z-index: 2;
  }

  /* Optional Top-3 Highlights */
  .rank-badge.top1 {
    background: linear-gradient(135deg, #FFD700, #FFB300);
    color: #1E1E1E;
  }

  .rank-badge.top2 {
    background: linear-gradient(135deg, #C0C0C0, #9E9E9E);
  }

  .rank-badge.top3 {
    background: linear-gradient(135deg, #CD7F32, #A0522D);
  }

  /* Poster */
  .poster {
    width: 100%;
    max-width: 260px;         /* Keeps poster nice */
    height: 390px;
    object-fit: cover;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }

  /* Content */
  .card-content {
    width: 100%;
    margin-top: 16px;
    text-align: center;
  }

  .movie-title {
    font-weight: 700;
    margin-bottom: 8px;
  }

  .meta {
    font-size: 13px;
    margin-bottom: 10px;
    color: #666;
  }

  .description {
    font-size: 14px;
    margin-bottom: 12px;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 18px;
    font-size: 13px;
    margin-bottom: 12px;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .view-btn {
    width: 100%;
  }

  /* ============================= */
  /* MOBILE - KEEP YOUR 2 COLUMN LOOK */
  /* ============================= */

  @media (max-width: 768px) {

    .movie-card {
      max-width: 100%;
      padding: 14px;
    }

    .poster {
      height: 300px;
    }

  }

</style>
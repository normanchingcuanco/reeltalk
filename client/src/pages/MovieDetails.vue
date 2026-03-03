<template>
  <div v-if="movie" class="container">

    <!-- ================= MOVIE HEADER ================= -->
    <div class="movie-header">
      <img v-if="movie.posterUrl" :src="movie.posterUrl" class="poster" />

      <div class="movie-info">
        <h2>{{ movie.title }}</h2>

        <p><strong>Director:</strong> {{ movie.director }}</p>
        <p><strong>Year:</strong> {{ movie.year }}</p>
        <p><strong>Genre:</strong> {{ movie.genre }}</p>

        <p class="description">{{ movie.description }}</p>

        <div class="stats">
          <span>⭐ {{ formattedRating }}</span>
          <span>❤️ {{ movie.likes?.length || 0 }}</span>
          <span>🗳 {{ movie.ratings?.length || 0 }} ratings</span>
        </div>

        <div v-if="auth.token" class="actions">
          <button class="primary" @click="toggleLike">
            {{ hasLiked ? "Unlike ❤️" : "Like ❤️" }}
          </button>

          <button class="primary" @click="toggleWatchlist">
            {{ inWatchlist ? "Remove 📌" : "Add to Watchlist 📌" }}
          </button>

          <select v-model="selectedRating" @change="rateMovie">
            <option disabled value="">Rate Movie</option>
            <option v-for="n in 5" :key="n" :value="n">
              {{ n }} ⭐
            </option>
          </select>
        </div>
      </div>
    </div>

    <hr />

    <!-- ================= COMMENTS ================= -->
    <h3>Comments</h3>

    <div v-if="auth.token" class="comment-section">

      <textarea
        v-model="newComment"
        placeholder="Write a comment..."
      ></textarea>

      <!-- Toolbar -->
      <div class="toolbar">
        <button class="primary" type="button" @click="toggleEmojiPanel">
          😊 Emoji
        </button>

        <button class="primary" type="button" @click="toggleGifPicker">
          🎬 GIF
        </button>
      </div>

      <!-- Emoji Panel -->
      <div v-if="showEmojiPanel" class="emoji-panel">
        <input
          type="text"
          v-model="emojiSearch"
          placeholder="Search emoji..."
          class="emoji-search"
        />

        <div class="emoji-grid">
          <span
            v-for="emoji in filteredEmojis"
            :key="emoji"
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>

      <!-- GIF Panel -->
      <div v-show="showGifPicker" class="gif-panel">

        <input
          type="text"
          v-model="gifSearch"
          placeholder="Search GIF..."
          @keyup.enter="searchGifs"
        />

        <div class="gif-grid">
          <img
            v-for="gif in gifs"
            :key="gif.id"
            :src="gif.images.fixed_width.url"
            @click="selectGif(gif)"
          />
        </div>

      </div>

      <button class="primary" id="addComment" @click="addComment">
        Add Comment
      </button>

    </div>

    <div v-else>
      <p>Please login to comment.</p>
    </div>

    <hr />

    <!-- ================= THREAD ================= -->
    <div v-if="threadedComments.length">
      <CommentItem
        v-for="c in threadedComments"
        :key="c._id"
        :comment="c"
        :movieId="movie._id"
        @refresh="refreshAll"
      />
    </div>

    <div v-else>
      <p>No comments yet.</p>
    </div>

  </div>
</template>

<script>
import { GiphyFetch } from "@giphy/js-fetch-api"
import api from "../api"
import { useAuthStore } from "../auth"
import CommentItem from "../components/CommentItem.vue"

export default {
  components: { CommentItem },

  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  data() {
    return {
      movie: null,
      newComment: "",
      threadedComments: [],
      selectedRating: "",
      watchlistIds: [],

      showEmojiPanel: false,
      showGifPicker: false,

      emojiSearch: "",
      gifSearch: "",

      emojiList: [
        "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","😉","😍","😘",
        "😜","🤪","🤨","😎","🥳","😤","😭","😡","😱","😴","🤯","🥶","🥵","😬",
        "🔥","💯","✨","🎉","🎊","❤️","💔","💖","💥","⭐","⚡",
        "👍","👎","👏","🙌","🙏","🤝","💪","👌","🤌","✌️",
        "🎬","🍿","🎮","🎵","🎧","🚀","🌎","🏆","🎯","📌"
      ],

      gifs: [],
      gf: new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY),
    }
  },

  computed: {
    formattedRating() {
      return this.movie?.averageRating
        ? Number(this.movie.averageRating).toFixed(1)
        : 0
    },

    hasLiked() {
      const userId = String(this.auth.userId || "")
      return (this.movie?.likes || []).some(
        (id) => String(id) === userId
      )
    },

    inWatchlist() {
      const movieId = String(this.movie?._id || "")
      const ids = (this.watchlistIds || []).map((id) => String(id))
      return ids.includes(movieId)
    },

    filteredEmojis() {
      if (!this.emojiSearch) return this.emojiList
      return this.emojiList.filter(e =>
        e.includes(this.emojiSearch)
      )
    }
  },

  async mounted() {
    await this.refreshAll()

    if (this.auth.token) {
      await this.fetchWatchlist()
    }

    await this.loadTrendingGifs()
  },

  methods: {

    toggleEmojiPanel() {
      this.showEmojiPanel = !this.showEmojiPanel
      this.showGifPicker = false
    },

    toggleGifPicker() {
      this.showGifPicker = !this.showGifPicker
      this.showEmojiPanel = false
    },

    insertEmoji(emoji) {
      this.newComment += emoji
    },

    async fetchMovie() {
      const res = await api.get(
        `/movies/getMovie/${this.$route.params.id}`
      )
      this.movie = res.data.movie
    },

    async fetchComments() {
      const res = await api.get(
        `/movies/getComments/${this.$route.params.id}`
      )
      this.threadedComments = res.data.threadedComments || []
    },

    async fetchWatchlist() {
      const res = await api.get("/movies/watchlist", {
        headers: {
          Authorization: `Bearer ${this.auth.token}`
        }
      })

      const list = res.data.watchlist || []
      this.watchlistIds = list.map(m => String(m._id))
    },

    async refreshAll() {
      await this.fetchMovie()
      await this.fetchComments()
    },

    async toggleLike() {
      await api.patch(
        `/movies/likeMovie/${this.movie._id}`,
        {},
        { headers: { Authorization: `Bearer ${this.auth.token}` } }
      )
      await this.fetchMovie()
    },

    async rateMovie() {
      if (!this.selectedRating) return

      await api.patch(
        `/movies/rateMovie/${this.movie._id}`,
        { value: Number(this.selectedRating) },
        { headers: { Authorization: `Bearer ${this.auth.token}` } }
      )

      this.selectedRating = ""
      await this.fetchMovie()
    },

    async toggleWatchlist() {
      await api.patch(
        `/movies/watchlist/${this.movie._id}`,
        {},
        { headers: { Authorization: `Bearer ${this.auth.token}` } }
      )
      await this.fetchWatchlist()
    },

    async loadTrendingGifs() {
      try {
        const { data } = await this.gf.trending({ limit: 12 })
        this.gifs = data
      } catch (error) {
        console.log("GIPHY ERROR >>>", error)
      }
    },

    async searchGifs() {
      if (!this.gifSearch.trim()) {
        return this.loadTrendingGifs()
      }

      try {
        const { data } = await this.gf.search(this.gifSearch, { limit: 12 })
        this.gifs = data
      } catch (error) {
        console.log("GIF SEARCH ERROR >>>", error)
      }
    },

    async addComment() {
      const commentText = this.newComment.trim()
      if (!commentText) return

      await api.patch(
        `/movies/addComment/${this.movie._id}`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${this.auth.token}` } }
      )

      this.newComment = ""
      this.showEmojiPanel = false
      this.showGifPicker = false

      await this.fetchComments()
    },

    selectGif(gif) {
      this.newComment = gif.images.original.url
      this.showGifPicker = false
    }
  }
}
</script>

<style>
.container { padding: 20px; }

.movie-header {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.poster {
  width: 280px;
  height: 420px;
  object-fit: cover;
}

.movie-info { max-width: 600px; }

.stats {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

textarea {
  width: 100%;
  min-height: 80px;
  margin-top: 8px;
}

.toolbar {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.emoji-panel {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  max-width: 350px;
}

.emoji-search {
  width: 100%;
  padding: 6px;
  margin-bottom: 8px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji-grid span {
  font-size: 22px;
  cursor: pointer;
  text-align: center;
}

.gif-panel input {
  width: 100%;
  padding: 6px;
  margin-bottom: 8px;
}

.gif-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.gif-grid img {
  cursor: pointer;
  border-radius: 6px;
}
</style>
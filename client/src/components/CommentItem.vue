<template>
  <div class="comment">
    <!-- COMMENT TEXT OR GIF -->
    <p v-if="!isEditing">
      <strong>{{ comment.userId?.username || "User" }}:</strong>

      <span v-if="isGif(comment.comment)">
        <img :src="comment.comment" class="gif" />
      </span>

      <span v-else>
        {{ comment.comment }}
      </span>

      <span v-if="comment.isEdited">(edited)</span>
    </p>

    <!-- EDIT MODE -->
    <div v-if="isEditing">
      <textarea v-model="editText" />
      <button @click="submitEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>

    <!-- ACTIONS -->
    <div v-if="auth.token" class="actions">
      <button @click="showReply = !showReply">
        Reply
      </button>

      <button @click="react('like')">
        👍 {{ comment.likes?.length || 0 }}
      </button>

      <button @click="react('dislike')">
        👎 {{ comment.dislikes?.length || 0 }}
      </button>

      <button v-if="canModify" @click="startEdit">
        Edit
      </button>

      <button v-if="canModify" @click="deleteComment">
        Delete
      </button>
    </div>

    <!-- REPLY BOX -->
    <div v-if="showReply" class="reply-box">
      <textarea
        v-model="replyText"
        placeholder="Write a reply..."
      />

      <!-- Toolbar -->
      <div class="toolbar">
        <button type="button" @click="toggleEmojiPanel">
          😊
        </button>

        <button type="button" @click="toggleGifPicker">
          🎬
        </button>
      </div>

      <!-- Emoji Panel -->
      <div v-if="showEmojiPanel" class="emoji-panel">
        <div class="emoji-grid">
          <span
            v-for="emoji in emojiList"
            :key="emoji"
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>

      <!-- GIF Panel -->
      <div v-if="showGifPicker" class="gif-panel">
        <input
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

      <button @click="addReply">
        Submit Reply
      </button>
    </div>

    <!-- REPLIES -->
    <div v-if="comment.replies?.length" class="replies">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply._id"
        :comment="reply"
        :movieId="movieId"
        @refresh="$emit('refresh')"
      />
    </div>
  </div>
</template>

<script>
import api from "../api"
import { useAuthStore } from "../auth"
import { GiphyFetch } from "@giphy/js-fetch-api"

export default {
  name: "CommentItem",
  props: ["comment", "movieId"],

  data() {
    return {
      showReply: false,
      replyText: "",
      isEditing: false,
      editText: "",

      // 🔥 NEW SAFE ADDITIONS
      showEmojiPanel: false,
      showGifPicker: false,
      gifSearch: "",
      gifs: [],
      emojiList: [
        "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","😉","😍","😘",
        "😜","🤪","🤨","😎","🥳","😤","😭","😡","😱","😴",
        "🔥","💯","✨","🎉","❤️","👍","👎","🎬","🍿","⭐"
      ],
      gf: new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY)
    }
  },

  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  computed: {
    canModify() {
      const isAdmin = this.auth.isAdmin === true
      const isOwner =
        String(this.comment.userId?._id || this.comment.userId) ===
        String(this.auth.userId)

      return isAdmin || isOwner
    }
  },

  methods: {
    isGif(text) {
      return (
        typeof text === "string" &&
        (
          text.endsWith(".gif") ||
          text.includes("giphy.com") ||
          text.includes("tenor.com")
        )
      )
    },

    toggleEmojiPanel() {
      this.showEmojiPanel = !this.showEmojiPanel
      this.showGifPicker = false
    },

    toggleGifPicker() {
      this.showGifPicker = !this.showGifPicker
      this.showEmojiPanel = false
      if (this.showGifPicker) {
        this.loadTrendingGifs()
      }
    },

    insertEmoji(emoji) {
      this.replyText += emoji
    },

    async loadTrendingGifs() {
      const { data } = await this.gf.trending({ limit: 8 })
      this.gifs = data
    },

    async searchGifs() {
      if (!this.gifSearch.trim()) return
      const { data } = await this.gf.search(this.gifSearch, { limit: 8 })
      this.gifs = data
    },

    selectGif(gif) {
      this.replyText = gif.images.original.url
      this.showGifPicker = false
    },

    async addReply() {
      if (!this.replyText.trim()) return

      await api.patch(
        `/movies/replyComment/${this.movieId}/${this.comment._id}`,
        { comment: this.replyText },
        {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        }
      )

      this.replyText = ""
      this.showReply = false
      this.showEmojiPanel = false
      this.showGifPicker = false

      this.$emit("refresh")
    },

    startEdit() {
      this.isEditing = true
      this.editText = this.comment.comment
    },

    cancelEdit() {
      this.isEditing = false
      this.editText = ""
    },

    async submitEdit() {
      if (!this.editText.trim()) return

      await api.patch(
        `/movies/editComment/${this.movieId}/${this.comment._id}`,
        { comment: this.editText },
        {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        }
      )

      this.isEditing = false
      this.$emit("refresh")
    },

    async deleteComment() {
      await api.delete(
        `/movies/deleteComment/${this.movieId}/${this.comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        }
      )

      this.$emit("refresh")
    },

    async react(type) {
      await api.patch(
        `/movies/reactComment/${this.movieId}/${this.comment._id}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        }
      )

      this.$emit("refresh")
    }
  }
}
</script>
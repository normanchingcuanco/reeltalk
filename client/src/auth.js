import { defineStore } from "pinia"
import api from "./api"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    isAdmin: localStorage.getItem("isAdmin") === "true",
    userId: localStorage.getItem("userId") || null
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await api.post("/users/login", { email, password })

        const token = res?.data?.access
        const user = res?.data?.user

        if (!token || !user?._id) {
          throw new Error("Invalid login response.")
        }

        this.token = token
        this.isAdmin = user.isAdmin === true
        this.userId = user._id

        localStorage.setItem("token", this.token)
        localStorage.setItem("isAdmin", String(this.isAdmin))
        localStorage.setItem("userId", this.userId)

        return true
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Login failed."
        throw new Error(msg)
      }
    },

    logout() {
      this.token = null
      this.isAdmin = false
      this.userId = null

      localStorage.removeItem("token")
      localStorage.removeItem("isAdmin")
      localStorage.removeItem("userId")
    }
  }
})
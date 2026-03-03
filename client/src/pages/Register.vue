<template>
  <div class="container">
    <form class="card auth-card" @submit.prevent="handleRegister">

      <!-- Header with logo -->
      <div class="auth-header">
        <h2>Create Account</h2>
        <img
          src="/logo_reeltalk.png"
          alt="ReelTalk Logo"
          class="auth-logo"
        />
      </div>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <button class="primary" type="submit">
        Register
      </button>

      <p>
        Already have an account?
        <router-link to="/login">
          Login
        </router-link>
      </p>

    </form>
  </div>
</template>

<script>
import api from "../api"
import { useRouter } from "vue-router"

export default {
  setup() {
    const router = useRouter()
    return { router }
  },

  data() {
    return {
      username: "",
      email: "",
      password: ""
    }
  },

  methods: {
    async handleRegister() {
      try {
        await api.post("/users/register", {
          username: this.username,
          email: this.email,
          password: this.password
        })

        this.router.push("/login")

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Registration failed"
        )
      }
    }
  }
}
</script>

<style scoped>

/* ===============================
   AUTH HEADER WITH LOGO
=============================== */
.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.auth-logo {
  width: 190px; /* enlarged logo */
  height: auto;
}

/* ===============================
   BASE STYLING
=============================== */
.container {
  padding: 40px 20px !important;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.auth-card {
  max-width: 340px;
  width: 100%;
  text-align: center;
}

.auth-card input {
  margin-bottom: 14px;
  width: 100%;
}

.auth-card button {
  width: 100%;
}

/* ===============================
   DESKTOP FULL VIEW CENTERING
=============================== */
@media (min-width: 1025px) {

  .container {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 100px;
  }

}

/* ===============================
   MOBILE SETTINGS
=============================== */
@media (max-width: 768px) {

  .container {
    padding: 20px !important;
  }

  .auth-card {
    max-width: 100%;
    transform: translateX(-22px);
  }

}

</style>
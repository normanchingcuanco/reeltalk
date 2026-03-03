<template>
  <div class="container">
    <form class="card auth-card" @submit.prevent="handleLogin">

      <!-- Header with logo -->
      <div class="auth-header">
        <h2>Welcome Back to</h2>
        <img
          src="/logo_reeltalk.png"
          alt="ReelTalk Logo"
          class="auth-logo"
        />
      </div>

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
        Login
      </button>

      <p>
        Don’t have an account?
        <router-link to="/register">
          Register
        </router-link>
      </p>

    </form>
  </div>
</template>

<script>
import { useAuthStore } from "../auth"
import { useRouter } from "vue-router"

export default {
  setup() {
    const auth = useAuthStore()
    const router = useRouter()
    return { auth, router }
  },

  data() {
    return {
      email: "",
      password: ""
    }
  },

  methods: {
    async handleLogin() {
      try {
        await this.auth.login(this.email, this.password)
        this.router.push("/movies")
      } catch (error) {
        alert(error.message || "Invalid credentials")
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
  width: 220px;
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
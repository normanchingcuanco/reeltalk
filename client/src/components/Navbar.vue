<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      class="sidebar"
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
      :class="{ expanded }"
    >
      <div class="logo">
        <img
          src="/logo_reeltalk.png"
          alt="ReelTalk"
          :class="{ collapsed: !expanded }"
        />
      </div>

      <nav>
        <router-link to="/movies">
          🎬 <span v-if="expanded">Movies</span>
        </router-link>

        <router-link to="/watchlist">
          ⭐ <span v-if="expanded">Watchlist</span>
        </router-link>

        <router-link v-if="auth.isAdmin" to="/admin">
          🛠 <span v-if="expanded">Admin</span>
        </router-link>

        <button class="logout-btn" @click="logout">
          🚪 <span v-if="expanded">Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Mobile Hamburger (HIDE WHEN DRAWER IS OPEN) -->
    <button
      v-if="auth.token && !showMobile"
      class="hamburger"
      @click="openMobile"
      aria-label="Open menu"
    >
      ☰
    </button>

    <!-- Overlay -->
    <div
      v-if="showMobile"
      class="mobile-overlay"
      @click="closeMobile"
    ></div>

    <!-- Drawer -->
    <div v-if="showMobile" class="mobile-drawer">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <img class="drawer-logo" src="/logo_reeltalk.png" alt="ReelTalk" />
        <button class="drawer-close" @click="closeMobile" aria-label="Close menu">
          ✕
        </button>
      </div>

      <router-link @click="closeMobile" to="/movies">
        🎬 Movies
      </router-link>

      <router-link @click="closeMobile" to="/watchlist">
        ⭐ Watchlist
      </router-link>

      <router-link
        v-if="auth.isAdmin"
        @click="closeMobile"
        to="/admin"
      >
        🛠 Admin
      </router-link>

      <button class="drawer-logout" @click="logout">
        🚪 Logout
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../auth"

export default {
  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  data() {
    return {
      expanded: false,
      showMobile: false
    }
  },

  methods: {
    openMobile() {
      this.showMobile = true
    },

    closeMobile() {
      this.showMobile = false
    },

    logout() {
      this.auth.logout()
      this.closeMobile()
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
/* ===============================
   DESKTOP SIDEBAR
=============================== */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 80px;
  height: 100vh;
  background: linear-gradient(180deg, #A14428, #E35336);
  padding: 20px 10px;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 2000;
  overflow: hidden;
}

.sidebar.expanded {
  width: 220px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.logo img {
  width: 160px;
  transition: width 0.3s ease;
}

/* When sidebar is collapsed */
.logo img.collapsed {
  width: 60px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
}

.sidebar a,
.sidebar button {
  color: white;
  background: none;
  border: none;
  text-decoration: none;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.logout-btn {
  margin-top: auto;
}

/* ===============================
   MOBILE (Phones + Landscape)
=============================== */
@media (max-width: 1024px) {

  /* Hide desktop sidebar completely */
  .sidebar {
    display: none !important;
  }

  /* Prevent any desktop nav children from rendering outside */
  .sidebar * {
    display: none !important;
  }

  /* Burger button */
  .hamburger {
    position: fixed;
    top: 16px;
    left: 14px;
    z-index: 4000;
    background: #E35336;
    color: white;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    border: none;
    font-size: 18px;
    display: grid;
    place-items: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }

  /* Dark overlay */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 3500;
  }

  /* Drawer */
  .mobile-drawer {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 75vw;
    max-width: 280px;
    background: #A14428;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    z-index: 3600;
  }

  /* Drawer header */
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    margin-bottom: 8px;
  }

  .drawer-logo {
    width: 130px;
    height: auto;
  }

  .drawer-close {
    background: rgba(255,255,255,0.15);
    color: white;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    font-size: 18px;
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .mobile-drawer a,
  .mobile-drawer button {
    color: white;
    background: none;
    border: none;
    text-align: left;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    font-size: 16px;
  }

  .drawer-logout {
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.2);
  }

}

</style>
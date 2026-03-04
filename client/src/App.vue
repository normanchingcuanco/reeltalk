<template>
  <div class="layout" :class="{ 'with-sidebar': showSidebar }">
    <Sidebar v-if="showSidebar" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "./auth"
import Sidebar from "./components/Navbar.vue"

export default {
  components: { Sidebar },

  setup() {
    const auth = useAuthStore()
    const route = useRoute()

    // Hide sidebar on login/register routes
    const showSidebar = computed(() => route.meta?.hideSidebar !== true)

    // 🔥 Render cold start warm-up
    onMounted(() => {
      fetch("https://reeltalk-api-3sr9.onrender.com")
        .then(() => console.log("Backend warm-up ping sent"))
        .catch(() => console.log("Backend warm-up ping failed"))
    })

    return { auth, showSidebar }
  }
}
</script>

<style>
.layout {
  display: flex;
  min-height: 100vh;
  background: #F5F5DC;
}

/* Desktop layout */
.main-content {
  flex: 1;
  padding: 40px;
  margin-left: 120px; /* sidebar width */
  transition: all 0.3s ease;
}

/* If sidebar is hidden (login/register), remove the left offset */
.layout:not(.with-sidebar) .main-content {
  margin-left: 0;
}

/* Mobile */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 90px 16px 20px 16px;
  }
}
</style>
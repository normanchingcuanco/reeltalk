import axios from "axios"

// Use production API if defined, otherwise fallback to localhost for local development
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000"

const api = axios.create({
  baseURL
})

// =====================================
// RETRY LOGIC (for Render cold starts)
// =====================================

const MAX_RETRIES = 3
const RETRY_DELAY = 1500

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const config = error.config

    if (!config) {
      return Promise.reject(error)
    }

    config.__retryCount = config.__retryCount || 0

    if (config.__retryCount >= MAX_RETRIES) {
      return Promise.reject(error)
    }

    config.__retryCount += 1

    console.log(`API retry attempt ${config.__retryCount}`)

    await sleep(RETRY_DELAY)

    return api(config)
  }
)

export default api
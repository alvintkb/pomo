<template>
  <div class="pwa-test">
    <h1>PWA EDU</h1>

    <div>
      <strong>Connection:</strong>
      <span :style="{ color: isOnline ? 'green' : 'red' }">
        {{ isOnline ? 'Online ✅' : 'Offline ❌' }}
      </span>
    </div>

    <div>
      <strong>Service Worker:</strong> {{ swStatus }}
    </div>

    <div>
      <strong>Install App:</strong>
      <button @click="promptInstall" :disabled="!deferredPrompt">
        Install App
      </button>
    </div>

    <div>
      <strong>Cached Fetch Test 2a:</strong>
      <button @click="fetchTest">Fetch JSON</button>
      <pre>{{ fetchedData }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isOnline = ref(navigator.onLine)
const swStatus = ref('Checking...')
const deferredPrompt = ref(null)
const fetchedData = ref('')

onMounted(() => {
  // Detect online/offline changes
  window.addEventListener('online', () => (isOnline.value = true))
  window.addEventListener('offline', () => (isOnline.value = false))

  // Detect install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  // Check service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(() => (swStatus.value = 'Active 🟢'))
      .catch(() => (swStatus.value = 'Error ❌'))
  } else {
    swStatus.value = 'Not supported 🚫'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('online', () => {})
  window.removeEventListener('offline', () => {})
})

function promptInstall() {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value = null
  }
}

async function fetchTest() {
  try {
    const res = await fetch('/test.json')
    const json = await res.json()
    fetchedData.value = JSON.stringify(json, null, 2)
  } catch (e) {
    fetchedData.value = 'Fetch failed 😢'
  }
}
</script>

<style scoped>
.pwa-test {
  padding: 1rem;
  max-width: 600px;
  margin: auto;
  font-family: sans-serif;
}
button {
  margin-top: 0.5rem;
}
</style>

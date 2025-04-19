<template>
    <div class="main-menu">
      <h1>Main Menu</h1>
      <div class="menu-options">
        <router-link to="/pomodoroTask" class="menu-button">pomodoroTask</router-link>
        <router-link to="/pomodoroTimer" class="menu-button">pomodoroTimer</router-link>
        <router-link to="/taskList" class="menu-button">Student Progress</router-link>
        <router-link to="/subjects" class="menu-button">Subjects</router-link>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
  
      <!-- PWA Status Bar -->
      <div class="pwa-status">
        <span :style="{ color: isOnline ? 'green' : 'red' }">
          {{ isOnline ? 'Online ✅' : 'Offline ❌' }}
        </span>
        <button v-if="deferredPrompt" @click="promptInstall" class="install-button">
          Install App
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // PWA state
  const isOnline = ref(navigator.onLine)
  const deferredPrompt = ref(null)
  
  onMounted(() => {
    // Detect online/offline changes
    window.addEventListener('online', () => (isOnline.value = true))
    window.addEventListener('offline', () => (isOnline.value = false))
  
    // Detect install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
    })
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('online', () => {})
    window.removeEventListener('offline', () => {})
  })
  
  function logout() {
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }
  
  function promptInstall() {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt()
      deferredPrompt.value = null
    }
  }
  </script>
  
  <style scoped>
  .main-menu {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .menu-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
    margin: 20px auto;
  }
  
  .menu-button, .logout-button, .install-button {
    padding: 10px 15px;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    display: block;
  }
  
  .menu-button {
    background-color: #3498db;
    color: white;
  }
  
  .logout-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    width: 100%;
  }
  
  .install-button {
    background-color: #9b59b6;
    color: white;
    border: none;
  }
  
  .pwa-status {
    position: fixed;
    bottom: 10px;
    right: 10px;
    padding: 5px 10px;
    background: #f8f8f8;
    border-radius: 4px;
    font-size: 14px;
  }
  </style>
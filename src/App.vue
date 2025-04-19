<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';

// Type declarations
declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
}

const isStandalone = ref(false);
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);

onMounted(() => {
  // Check installation status
  isStandalone.value = 
    (window.navigator as any).standalone || 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.matchMedia('(display-mode: fullscreen)').matches;

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', handleInstallPrompt);
  
  // Cleanup event listener
  return () => {
    window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  };
});

function handleInstallPrompt(e: Event) {
  console.log('beforeinstallprompt event fired');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt.value = e as BeforeInstallPromptEvent;
  console.log('deferredPrompt set:', deferredPrompt.value);
}

async function installPWA() {
  if (!deferredPrompt.value) {
    console.warn('No deferred prompt available');
    return;
  }

  console.log('Triggering install prompt...');
  
  try {
    // Show the install prompt
    deferredPrompt.value.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.value.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  } catch (error) {
    console.error('Error during installation:', error);
  } finally {
    // Clear the deferred prompt
    deferredPrompt.value = null;
  }
}
</script>

<template>
  <div>
    <div v-if="!isStandalone" class="pwa-edu-container">
      <p>PWA EDU</p>
      <p>Connection: Online ✅</p>
      <p>Service Worker: Active 🟢</p>
      <button 
        @click="installPWA" 
        v-if="deferredPrompt"
        class="install-button"
      >
        Install App
      </button>
      <button class="fetch-button">Cached Fetch Test 2a: Fetch JSON</button>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.pwa-edu-container {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
}

button {
  margin: 5px;
  padding: 8px 15px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.2s;
}

.install-button {
  background-color: #42b983;
  color: white;
}

.install-button:hover {
  background-color: #369f6b;
  transform: scale(1.05);
}

.fetch-button {
  background-color: #647eff;
  color: white;
}

.fetch-button:hover {
  background-color: #4d6bff;
}

@media (display-mode: standalone), (display-mode: fullscreen) {
  .pwa-edu-container {
    display: none !important;
  }
}
</style>
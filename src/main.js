import { createApp, provide, h } from 'vue';
import { createPinia } from 'pinia';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue';
import router from './router';
import apolloClient from './apollo-client';
// import './registerServiceWorker'; // Add service worker registration
const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient);
    },
    render: () => h(App),
});
const pinia = createPinia();
console.log('[main.ts] Pinia initialized:', pinia);
app.use(pinia);
app.use(router);
app.mount('#app');
// Force initial navigation if the path is the base
router.isReady().then(() => {
    if (window.location.pathname === '/Pomo/') {
        router.push({ name: 'Home' }).catch((error) => {
            console.error('Error during initial navigation:', error);
        });
    }
}).catch((error) => {
    console.error('[main.ts] Router failed to initialize:', error);
});
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        console.log('[main.ts] HMR: Pinia state preserved');
    });
}
//# sourceMappingURL=main.js.map
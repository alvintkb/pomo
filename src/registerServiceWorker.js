// src/registerServiceWorker.ts
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swUrl = import.meta.env.DEV ? '/dev-sw.js?dev-sw' : '/Pomo/sw.js';
        navigator.serviceWorker
            .register(swUrl)
            .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
            .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
    });
}
export {};
//# sourceMappingURL=registerServiceWorker.js.map
import { ref, onMounted, onBeforeUnmount } from 'vue';
const isOnline = ref(navigator.onLine);
const swStatus = ref('Checking...');
const deferredPrompt = ref(null);
const fetchedData = ref('');
onMounted(() => {
    // Detect online/offline changes
    window.addEventListener('online', () => (isOnline.value = true));
    window.addEventListener('offline', () => (isOnline.value = false));
    // Detect install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt.value = e;
    });
    // Check service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(() => (swStatus.value = 'Active 🟢'))
            .catch(() => (swStatus.value = 'Error ❌'));
    }
    else {
        swStatus.value = 'Not supported 🚫';
    }
});
onBeforeUnmount(() => {
    window.removeEventListener('online', () => { });
    window.removeEventListener('offline', () => { });
});
function promptInstall() {
    if (deferredPrompt.value) {
        deferredPrompt.value.prompt();
        deferredPrompt.value = null;
    }
}
async function fetchTest() {
    try {
        const res = await fetch('/test.json');
        const json = await res.json();
        fetchedData.value = JSON.stringify(json, null, 2);
    }
    catch (e) {
        fetchedData.value = 'Fetch failed 😢';
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pwa-test" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ style: ({ color: __VLS_ctx.isOnline ? 'green' : 'red' }) },
});
(__VLS_ctx.isOnline ? 'Online ✅' : 'Offline ❌');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.swStatus);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.promptInstall) },
    disabled: (!__VLS_ctx.deferredPrompt),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.fetchTest) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({});
(__VLS_ctx.fetchedData);
/** @type {__VLS_StyleScopedClasses['pwa-test']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isOnline: isOnline,
            swStatus: swStatus,
            deferredPrompt: deferredPrompt,
            fetchedData: fetchedData,
            promptInstall: promptInstall,
            fetchTest: fetchTest,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=HelloWorld.vue.js.map
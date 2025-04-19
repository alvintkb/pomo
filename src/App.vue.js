import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
const isStandalone = ref(false);
const deferredPrompt = ref(null);
onMounted(() => {
    // Check if app is running in standalone mode
    isStandalone.value =
        window.navigator.standalone ||
            window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches;
    // Listen for display mode changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (event) => {
        isStandalone.value = event.matches;
    });
    window.matchMedia('(display-mode: fullscreen)').addEventListener('change', (event) => {
        isStandalone.value = event.matches;
    });
    // Handle PWA installation prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt fired');
        e.preventDefault();
        deferredPrompt.value = e;
    });
    // Track successful PWA installation
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        deferredPrompt.value = null;
    });
});
const installPWA = async () => {
    if (!deferredPrompt.value)
        return;
    try {
        deferredPrompt.value.prompt();
        const choiceResult = await deferredPrompt.value.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        }
        else {
            console.log('User dismissed the A2HS prompt');
        }
    }
    catch (error) {
        console.error('Error during PWA installation:', error);
    }
    finally {
        deferredPrompt.value = null;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pwa-edu-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
if (!__VLS_ctx.isStandalone) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pwa-edu-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    if (__VLS_ctx.deferredPrompt) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.installPWA) },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({});
}
const __VLS_0 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['pwa-edu-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterView: RouterView,
            isStandalone: isStandalone,
            deferredPrompt: deferredPrompt,
            installPWA: installPWA,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=App.vue.js.map
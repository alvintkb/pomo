import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// PWA state
const isOnline = ref(navigator.onLine);
const deferredPrompt = ref(null);
onMounted(() => {
    // Detect online/offline changes
    window.addEventListener('online', () => (isOnline.value = true));
    window.addEventListener('offline', () => (isOnline.value = false));
    // Detect install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt.value = e;
    });
});
onBeforeUnmount(() => {
    window.removeEventListener('online', () => { });
    window.removeEventListener('offline', () => { });
});
function logout() {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
}
function promptInstall() {
    if (deferredPrompt.value) {
        deferredPrompt.value.prompt();
        deferredPrompt.value = null;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['menu-button']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
/** @type {__VLS_StyleScopedClasses['install-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-menu" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "menu-options" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/pomodoroTask",
    ...{ class: "menu-button" },
}));
const __VLS_2 = __VLS_1({
    to: "/pomodoroTask",
    ...{ class: "menu-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
const __VLS_4 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    to: "/pomodoroTimer",
    ...{ class: "menu-button" },
}));
const __VLS_6 = __VLS_5({
    to: "/pomodoroTimer",
    ...{ class: "menu-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
const __VLS_8 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    to: "/taskList",
    ...{ class: "menu-button" },
}));
const __VLS_10 = __VLS_9({
    to: "/taskList",
    ...{ class: "menu-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
const __VLS_12 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    to: "/subjects",
    ...{ class: "menu-button" },
}));
const __VLS_14 = __VLS_13({
    to: "/subjects",
    ...{ class: "menu-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.logout) },
    ...{ class: "logout-button" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pwa-status" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ style: ({ color: __VLS_ctx.isOnline ? 'green' : 'red' }) },
});
(__VLS_ctx.isOnline ? 'Online ✅' : 'Offline ❌');
if (__VLS_ctx.deferredPrompt) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.promptInstall) },
        ...{ class: "install-button" },
    });
}
/** @type {__VLS_StyleScopedClasses['main-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-options']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-button']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-button']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-button']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-button']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
/** @type {__VLS_StyleScopedClasses['pwa-status']} */ ;
/** @type {__VLS_StyleScopedClasses['install-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isOnline: isOnline,
            deferredPrompt: deferredPrompt,
            logout: logout,
            promptInstall: promptInstall,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Home.vue.js.map
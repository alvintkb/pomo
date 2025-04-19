import { ref, onMounted, onUnmounted, computed } from 'vue';
export default (await import('vue')).defineComponent({
    setup() {
        const now = ref(new Date());
        let intervalId = null;
        const hour = computed(() => now.value.getHours() % 12);
        const minute = computed(() => now.value.getMinutes());
        const second = computed(() => now.value.getSeconds());
        const hourHandStyle = computed(() => {
            const hourDeg = (hour.value * 30) + (minute.value * 0.5);
            return { transform: `rotate(${hourDeg}deg)` };
        });
        const minuteHandStyle = computed(() => {
            const minuteDeg = (minute.value * 6) + (second.value * 0.1);
            return { transform: `rotate(${minuteDeg}deg)` };
        });
        const secondHandStyle = computed(() => {
            const secondDeg = second.value * 6;
            return { transform: `rotate(${secondDeg}deg)` };
        });
        onMounted(() => {
            intervalId = setInterval(() => {
                now.value = new Date();
            }, 1000);
        });
        onUnmounted(() => {
            clearInterval(intervalId);
        });
        return {
            hourHandStyle,
            minuteHandStyle,
            secondHandStyle,
        };
    },
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['analog-clock']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "analog-clock" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hand hour-hand" },
    ...{ style: (__VLS_ctx.hourHandStyle) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hand minute-hand" },
    ...{ style: (__VLS_ctx.minuteHandStyle) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hand second-hand" },
    ...{ style: (__VLS_ctx.secondHandStyle) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "center-dot" },
});
/** @type {__VLS_StyleScopedClasses['analog-clock']} */ ;
/** @type {__VLS_StyleScopedClasses['hand']} */ ;
/** @type {__VLS_StyleScopedClasses['hour-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['hand']} */ ;
/** @type {__VLS_StyleScopedClasses['minute-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['hand']} */ ;
/** @type {__VLS_StyleScopedClasses['second-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['center-dot']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=AnalogClock.vue.js.map
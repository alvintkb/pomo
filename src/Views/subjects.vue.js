import { onMounted, computed } from 'vue';
import { useQuizStore } from '../stores/quiz';
import { useRouter } from 'vue-router';
const store = useQuizStore();
const router = useRouter();
const subjects = computed(() => store.subjects);
const goToLessons = (subjectId) => {
    store.loadLessons(subjectId); // Call loadLessons, pass subjectId
    router.push(`/subjects/${subjectId}/lessons`);
};
onMounted(() => {
    store.loadSubjects(); // Call loadSubjects
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "subjects" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
for (const [subject] of __VLS_getVForSourceType((__VLS_ctx.subjects))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.goToLessons(subject.id);
            } },
        key: (subject.id),
        ...{ class: "subject-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    (subject.attributes.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (subject.attributes.description);
}
/** @type {__VLS_StyleScopedClasses['subjects']} */ ;
/** @type {__VLS_StyleScopedClasses['subject-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            subjects: subjects,
            goToLessons: goToLessons,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=subjects.vue.js.map
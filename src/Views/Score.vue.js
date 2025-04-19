import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../stores/quiz';
const store = useQuizStore();
const router = useRouter();
// Compute the score.  This is a basic example; adjust logic as needed.
const score = computed(() => {
    if (!store.progress || store.progress.length === 0)
        return 0;
    let correctCount = 0;
    store.progress.forEach(p => {
        if (p.is_correct) {
            correctCount++;
        }
    });
    return correctCount; // Return the number of correct answers as the score
});
const correctAnswers = computed(() => {
    if (!store.progress || store.progress.length === 0)
        return 0;
    let correctCount = 0;
    store.progress.forEach(p => {
        if (p.is_correct) {
            correctCount++;
        }
    });
    return correctCount;
});
const totalQuestions = computed(() => {
    return store.questions.length;
});
const playAgain = () => {
    // Reset the quiz state and go back to the quiz page.
    //  Important:  Clear progress, and reload questions
    store.progress = [];
    store.currentQuestionIndex = 0;
    router.push('/quiz');
};
onMounted(() => {
    if (store.questions.length === 0) {
        store.loadQuestions();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "score" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.score);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.correctAnswers);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.totalQuestions);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.playAgain) },
});
/** @type {__VLS_StyleScopedClasses['score']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            score: score,
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions,
            playAgain: playAgain,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Score.vue.js.map
import { onMounted, computed, ref } from 'vue';
import { useQuizStore } from '../stores/quiz';
import { useRouter, useRoute } from 'vue-router';
import { fetchStory, fetchImage } from '../api/quiz'; // Import fetchStory
const store = useQuizStore();
const router = useRouter();
const route = useRoute();
const storyContent = ref('');
const lessonTitle = ref('');
const imageUrl = ref('');
const lessonId = computed(() => route.params.lessonId);
const goToQuiz = () => {
    router.push('/quiz');
};
onMounted(async () => {
    try {
        const lesson = store.lessons.find(l => l.id === lessonId.value);
        lessonTitle.value = lesson ? lesson.attributes.title : '';
        const story = await fetchStory(lessonId.value);
        storyContent.value = story;
        imageUrl.value = await fetchImage(lessonId.value);
    }
    catch (e) {
        console.log(e);
    }
    await store.loadQuestions(lessonId.value);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "story" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
(__VLS_ctx.lessonTitle);
if (__VLS_ctx.storyContent) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.storyContent);
    if (__VLS_ctx.imageUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.imageUrl),
            alt: "Lesson Image",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goToQuiz) },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
/** @type {__VLS_StyleScopedClasses['story']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            storyContent: storyContent,
            lessonTitle: lessonTitle,
            imageUrl: imageUrl,
            goToQuiz: goToQuiz,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=story.vue.js.map
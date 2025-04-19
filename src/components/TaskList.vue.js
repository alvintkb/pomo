import { useTaskStore } from '../stores/task';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
const isLoading = ref(true);
const errorMessage = ref(null);
const taskStore = useTaskStore();
const { tasks, selectedTaskIds, getSelectedTasks } = storeToRefs(taskStore);
const handleToggleTask = async (taskId) => {
    console.log('[TaskList] handleToggleTask:', taskId);
    await taskStore.toggleTask(taskId);
};
onMounted(async () => {
    try {
        await taskStore.loadTasks();
        console.log('[TaskList] Tasks loaded:', tasks.value);
    }
    catch (err) {
        console.error('[TaskList] Failed to load tasks:', err);
        errorMessage.value = err.message || 'Failed to load tasks.';
    }
    finally {
        isLoading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['selected-tasks']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-tasks']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "task-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
}
else if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.errorMessage);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    for (const [task] of __VLS_getVForSourceType((__VLS_ctx.tasks))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (task.id),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (...[$event]) => {
                    if (!!(__VLS_ctx.isLoading))
                        return;
                    if (!!(__VLS_ctx.errorMessage))
                        return;
                    __VLS_ctx.handleToggleTask(task.id);
                } },
            type: "checkbox",
            id: ('task-' + task.id),
            value: (task.id),
            checked: (__VLS_ctx.selectedTaskIds.includes(task.id)),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: ('task-' + task.id),
        });
        (task.attributes?.description);
    }
}
if (__VLS_ctx.getSelectedTasks && __VLS_ctx.getSelectedTasks.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "selected-tasks" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    for (const [selectedTask] of __VLS_getVForSourceType((__VLS_ctx.getSelectedTasks))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (selectedTask.id),
        });
        (selectedTask.attributes?.description);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
/** @type {__VLS_StyleScopedClasses['task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-tasks']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isLoading: isLoading,
            errorMessage: errorMessage,
            tasks: tasks,
            selectedTaskIds: selectedTaskIds,
            getSelectedTasks: getSelectedTasks,
            handleToggleTask: handleToggleTask,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TaskList.vue.js.map
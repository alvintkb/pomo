// src/components/PomodoroTimer.vue
import AnalogClock from './AnalogClock.vue';
import { useTaskStore } from '../stores/task';
import { computed, ref, onMounted, onUnmounted, toRaw } from 'vue';
import { storeToRefs } from 'pinia';
const minutes = ref(1);
const seconds = ref(0);
const isRunning = ref(false);
const isLoading = ref(true);
const errorMessage = ref(null);
const interval = ref(null); // Explicitly type as NodeJS.Timeout or null
const pomodoroDuration = 5;
const shortBreakDuration = 5;
const longBreakDuration = 5;
const pomodoroCount = ref(0);
const longBreakInterval = 4;
const status = ref('Pomodoro');
const taskStore = useTaskStore();
const { tasks, selectedTaskIds, getSelectedTasks } = storeToRefs(taskStore);
console.log('[PomodoroTimer] Task store instance, storeId:', taskStore.storeId);
const selectedTask = computed(() => {
    const selected = getSelectedTasks.value;
    console.log('[PomodoroTimer] Computed selectedTask, tasks:', toRaw(selected));
    return selected && selected.length > 0 ? selected[0] : null;
});
const displayedMinutes = computed(() => {
    return minutes.value.toString().padStart(2, '0').split('');
});
const displayedSeconds = computed(() => {
    return seconds.value.toString().padStart(2, '0').split('');
});
const totalTime = computed(() => {
    let value = 0;
    if (status.value === 'Pomodoro') {
        value = pomodoroDuration * 60;
    }
    else if (status.value === 'Short Break') {
        value = shortBreakDuration * 60;
    }
    else if (status.value === 'Long Break') {
        value = longBreakDuration * 60;
    }
    return value;
});
const currentTime = computed(() => {
    return minutes.value * 60 + seconds.value;
});
const progress = computed(() => {
    return totalTime.value > 0 ? (currentTime.value / totalTime.value) * 100 : 0;
});
// Function to play MP3 file and return a Promise
const playMp3File = (filename) => {
    return new Promise((resolve, reject) => {
        try {
            if (!filename) {
                console.warn("No filename provided for MP3 playback.");
                resolve(); // Resolve immediately if no filename
                return;
            }
            const audio = new Audio(`/sounds/${filename}.mp3`);
            audio.addEventListener('loadeddata', () => {
                console.log(`Audio data loaded for ${filename}.mp3`);
            });
            audio.addEventListener('ended', () => {
                console.log(`Finished playing ${filename}.mp3`);
                resolve(); // Resolve when audio finishes
            });
            audio.addEventListener('error', (error) => {
                console.error(`Error loading audio for ${filename}.mp3:`, error);
                reject(error); // Reject on error
            });
            audio.play()
                .then(() => {
                console.log(`Playing MP3 file: ${filename}.mp3`);
            })
                .catch((error) => {
                console.error(`Error during playback of ${filename}.mp3:`, error);
                reject(error);
            });
        }
        catch (error) {
            console.error("Error creating audio object:", error);
            reject(error);
        }
    });
};
const startTimer = () => {
    if (!selectedTask.value) {
        console.warn('[PomodoroTimer] Cannot start - no task selected');
        return;
    }
    isRunning.value = true;
    interval.value = setInterval(tick, 1000); // Start timer
};
const pauseTimer = () => {
    isRunning.value = false;
    if (interval.value) { // Only clear if interval.value is not null
        clearInterval(interval.value); // Stop timer
        interval.value = null;
    }
};
const resetTimer = () => {
    pauseTimer(); // Stop timer if running (includes the null check)
    minutes.value = pomodoroDuration;
    seconds.value = 0;
    status.value = 'Pomodoro';
    // pomodoroCount.value = 0; // Uncomment to reset stars on timer reset
};
const tick = () => {
    if (minutes.value === 0 && seconds.value === 0) {
        timerFinished();
    }
    else if (seconds.value > 0) {
        seconds.value--;
    }
    else {
        minutes.value--;
        seconds.value = 59;
    }
};
const timerFinished = async () => {
    pauseTimer(); // Stop timer (includes the null check)
    if (status.value === 'Pomodoro') {
        pomodoroCount.value++;
        if (pomodoroCount.value % longBreakInterval === 0) {
            minutes.value = longBreakDuration;
            status.value = 'Long Break';
            try {
                await playMp3File("m15"); // Wait for first sound
                await playMp3File("totoro2"); // Then play second sound
            }
            catch (error) {
                console.error('Error playing long break sounds:', error);
            }
        }
        else {
            minutes.value = shortBreakDuration;
            status.value = 'Short Break';
            try {
                await playMp3File("5m"); // Wait for first sound
                await playMp3File("totoro"); // Then play second sound
            }
            catch (error) {
                console.error('Error playing short break sounds:', error);
            }
        }
    }
    else {
        minutes.value = pomodoroDuration;
        seconds.value = 0;
        status.value = 'Pomodoro';
        try {
            await playMp3File("start-taskm5"); // Wait for first sound
            await playMp3File("happy-ending"); // Then play second sound
        }
        catch (error) {
            console.error('Error playing Pomodoro start sounds:', error);
        }
        startTimer(); // Immediately start the next Pomodoro
    }
    seconds.value = 0;
    if (status.value !== 'Pomodoro') {
        startTimer(); // Immediately start the break timer
    }
};
onMounted(async () => {
    try {
        await taskStore.loadTasks();
        console.log('[PomodoroTimer] Tasks loaded:', toRaw(tasks.value), 'storeId:', taskStore.storeId);
        if (tasks.value && tasks.value.length > 0 && (!getSelectedTasks.value || getSelectedTasks.value.length === 0)) {
            await taskStore.selectTask(tasks.value[0].id);
            console.log('[PomodoroTimer] Auto-selected task:', toRaw(tasks.value[0]));
        }
    }
    catch (error) {
        console.error('[PomodoroTimer] Failed to load tasks:', error);
        errorMessage.value = 'Failed to load tasks. Please try again.';
    }
    finally {
        isLoading.value = false;
    }
});
onUnmounted(() => {
    pauseTimer(); // Ensure timer is stopped on unmount (includes the null check)
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
/** @type {__VLS_StyleScopedClasses['pause-button']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-button']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['pomodoro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['pomodoro-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['analog-clock-small']} */ ;
/** @type {__VLS_StyleScopedClasses['timer-container']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['star-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pomodoro-container" },
});
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error" },
    });
    (__VLS_ctx.errorMessage);
}
else if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pomodoro-layout" },
    });
    /** @type {[typeof AnalogClock, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(AnalogClock, new AnalogClock({
        ...{ class: "analog-clock-small" },
    }));
    const __VLS_1 = __VLS_0({
        ...{ class: "analog-clock-small" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pomodoro-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "status" },
    });
    (__VLS_ctx.status);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.pomodoroCount);
    (__VLS_ctx.longBreakInterval);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "star-container" },
    });
    for (const [n] of __VLS_getVForSourceType((__VLS_ctx.pomodoroCount))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            key: (n),
            src: "/images/star.png",
            alt: "Completed Session Star",
            ...{ class: "star-icon" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "timer-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "digit-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "digit" },
    });
    (__VLS_ctx.displayedMinutes[0]);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "digit" },
    });
    (__VLS_ctx.displayedMinutes[1]);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "separator" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "digit-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "digit" },
    });
    (__VLS_ctx.displayedSeconds[0]);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "digit" },
    });
    (__VLS_ctx.displayedSeconds[1]);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-bar-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-bar" },
        ...{ style: ({ width: __VLS_ctx.progress + '%' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "task-list" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    for (const [task] of __VLS_getVForSourceType((__VLS_ctx.tasks))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (task.id),
            ...{ class: ({ selected: __VLS_ctx.selectedTaskIds.includes(task.id) }) },
        });
        (task.attributes.description);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.errorMessage))
                        return;
                    if (!!(__VLS_ctx.isLoading))
                        return;
                    __VLS_ctx.taskStore.selectTask(task.id);
                } },
            disabled: (__VLS_ctx.selectedTaskIds.includes(task.id)),
        });
    }
    if (__VLS_ctx.tasks.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "session-info" },
    });
    if (__VLS_ctx.selectedTask) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.selectedTask.attributes.description);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "controls" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.startTimer) },
        disabled: (__VLS_ctx.isRunning || !__VLS_ctx.selectedTask),
        ...{ class: "start-button" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'fill-rule': "evenodd",
        d: "M4.5 5.653c0-1.426 1.529-2.33 2.77-1.68l7.58 4.685a1.5 1.5 0 010 2.69l-7.58 4.685a2.25 2.25 0 01-2.77-1.68V5.653z",
        'clip-rule': "evenodd",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.pauseTimer) },
        disabled: (!__VLS_ctx.isRunning),
        ...{ class: "pause-button" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M6 5h4v14H6V5zm8 0h4v14h-4V5z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.resetTimer) },
        ...{ class: "reset-button" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'fill-rule': "evenodd",
        d: "M12 3a9 9 0 00-9 9v6a3 3 0 003 3h12a3 3 0 003-3v-6a9 9 0 00-9-9zm-1 13h2v-6h-2v6zm-8-1h2v-2H3v2zm14 0h2v-2h-2v2zM5.3 5.3l2.1 2.1a1 1 0 001.4-1.4L6.7 3.9a1 1 0 00-1.4 1.4zm12.7 0l-2.1 2.1a1 1 0 00-1.4-1.4l2.1-2.1a1 1 0 001.4 1.4z",
        'clip-rule': "evenodd",
    });
}
/** @type {__VLS_StyleScopedClasses['pomodoro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['pomodoro-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['analog-clock-small']} */ ;
/** @type {__VLS_StyleScopedClasses['pomodoro-main']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['star-container']} */ ;
/** @type {__VLS_StyleScopedClasses['star-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['timer-container']} */ ;
/** @type {__VLS_StyleScopedClasses['digit-group']} */ ;
/** @type {__VLS_StyleScopedClasses['digit']} */ ;
/** @type {__VLS_StyleScopedClasses['digit']} */ ;
/** @type {__VLS_StyleScopedClasses['separator']} */ ;
/** @type {__VLS_StyleScopedClasses['digit-group']} */ ;
/** @type {__VLS_StyleScopedClasses['digit']} */ ;
/** @type {__VLS_StyleScopedClasses['digit']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['session-info']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['start-button']} */ ;
/** @type {__VLS_StyleScopedClasses['pause-button']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AnalogClock: AnalogClock,
            isRunning: isRunning,
            isLoading: isLoading,
            errorMessage: errorMessage,
            pomodoroCount: pomodoroCount,
            longBreakInterval: longBreakInterval,
            status: status,
            taskStore: taskStore,
            tasks: tasks,
            selectedTaskIds: selectedTaskIds,
            selectedTask: selectedTask,
            displayedMinutes: displayedMinutes,
            displayedSeconds: displayedSeconds,
            progress: progress,
            startTimer: startTimer,
            pauseTimer: pauseTimer,
            resetTimer: resetTimer,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=pomodoroTimer.vue.js.map
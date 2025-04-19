// src/components/PomodoroTimer.vue
<template>
  <div class="pomodoro-container">
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else-if="isLoading" class="loading">Loading tasks...</div>
    <div v-else class="pomodoro-layout">
      <AnalogClock class="analog-clock-small" />
      <div class="pomodoro-main">
        <p class="status">{{ status }}</p>
        <p>Session: {{ pomodoroCount }} / {{ longBreakInterval }}</p>
        <!-- Display a star for each completed Pomodoro session -->
        <div class="star-container">
          <img
            v-for="n

 in pomodoroCount"
            :key="n"
            src="/images/star.png"
            alt="Completed Session Star"
            class="star-icon"
          />
        </div>
        <div class="timer-container">
          <div class="digit-group">
            <span class="digit">{{ displayedMinutes[0] }}</span>
            <span class="digit">{{ displayedMinutes[1] }}</span>
          </div>
          <span class="separator">:</span>
          <div class="digit-group">
            <span class="digit">{{ displayedSeconds[0] }}</span>
            <span class="digit">{{ displayedSeconds[1] }}</span>
          </div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="task-list">
          <h2>Tasks</h2>
          <ul>
            <li
              v-for="task in tasks"
              :key="task.id"
              :class="{ selected: selectedTaskIds.includes(task.id) }"
            >
              {{ task.attributes.description }}
              <button
                @click="taskStore.selectTask(task.id)"
                :disabled="selectedTaskIds.includes(task.id)"
              >
                Select
              </button>
            </li>
          </ul>
          <p v-if="tasks.length === 0">No tasks available.</p>
        </div>
        <div class="session-info">
          <p v-if="selectedTask">Selected Task: {{ selectedTask.attributes.description }}</p>
          <p v-else>No task selected</p>
        </div>
      </div>
      <div class="controls">
        <button
          @click="startTimer"
          :disabled="isRunning || !selectedTask"
          class="start-button"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.77-1.68l7.58 4.685a1.5 1.5 0 010 2.69l-7.58 4.685a2.25 2.25 0 01-2.77-1.68V5.653z"
              clip-rule="evenodd"
            />
          </svg>
          Start
        </button>
        <button
          @click="pauseTimer"
          :disabled="!isRunning"
          class="pause-button"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
          </svg>
          Pause
        </button>
        <button @click="resetTimer" class="reset-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M12 3a9 9 0 00-9 9v6a3 3 0 003 3h12a3 3 0 003-3v-6a9 9 0 00-9-9zm-1 13h2v-6h-2v6zm-8-1h2v-2H3v2zm14 0h2v-2h-2v2zM5.3 5.3l2.1 2.1a1 1 0 001.4-1.4L6.7 3.9a1 1 0 00-1.4 1.4zm12.7 0l-2.1 2.1a1 1 0 00-1.4-1.4l2.1-2.1a1 1 0 001.4 1.4z"
              clip-rule="evenodd"
            />
          </svg>
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AnalogClock from './AnalogClock.vue';
import { useTaskStore } from '../stores/task';
import { computed, ref, onMounted, onUnmounted, toRaw } from 'vue';
import { storeToRefs } from 'pinia';

const minutes = ref(30);
const seconds = ref(0);
const isRunning = ref(false);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const interval = ref<NodeJS.Timeout | null>(null); // Explicitly type as NodeJS.Timeout or null
const pomodoroDuration = 30;
const shortBreakDuration = 5;
const longBreakDuration = 15;
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
  } else if (status.value === 'Short Break') {
    value = shortBreakDuration * 60;
  } else if (status.value === 'Long Break') {
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
const playMp3File = (filename: string): Promise<void> => {
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
    } catch (error) {
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
  } else if (seconds.value > 0) {
    seconds.value--;
  } else {
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
      } catch (error) {
        console.error('Error playing long break sounds:', error);
      }
    } else {
      minutes.value = shortBreakDuration;
      status.value = 'Short Break';
      try {
        await playMp3File("5m"); // Wait for first sound
        await playMp3File("totoro"); // Then play second sound
      } catch (error) {
        console.error('Error playing short break sounds:', error);
      }
    }
  } else {
    minutes.value = pomodoroDuration;
    seconds.value = 0;
    status.value = 'Pomodoro';
    try {
      await playMp3File("start-taskm5"); // Wait for first sound
      await playMp3File("happy-ending"); // Then play second sound
    } catch (error) {
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
  } catch (error) {
    console.error('[PomodoroTimer] Failed to load tasks:', error);
    errorMessage.value = 'Failed to load tasks. Please try again.';
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  pauseTimer(); // Ensure timer is stopped on unmount (includes the null check)
});
</script>



<style scoped>
.pomodoro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: #f4f4f4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%; /* Adjust width for better responsiveness */
  max-width: 700px; /* Adjust max-width as needed */
  padding: 2em;
}

.pomodoro-layout {
  display: flex;
  width: 100%;
  align-items: flex-start; /* Align items vertically at the start */
  gap: 1.5em; /* Space between the clock and the main content */
}

.analog-clock-small {
  width: 100px; /* Smaller size for the analog clock */
  height: 100px;
  flex-shrink: 0; /* Prevent the clock from shrinking */
}

.pomodoro-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Take up the remaining width */
}

.loading,
.error {
  text-align: center;
  font-size: 1.2em;
  margin: 2em 0;
}

.error {
  color: #e74c3c;
}

.task-list {
  width: 100%;
  margin-bottom: 1em;
}

.task-list h2 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 0.5em;
}

.task-list ul {
  list-style: none;
  padding: 0;
}

.task-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  background-color: #fff;
  border-radius: 5px;
}

.task-list li.selected {
  background-color: #e0f7fa;
}

.task-list button {
  padding: 0.3em 0.8em;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.task-list button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin-bottom: 1em;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.3s ease-in-out;
}

.timer-container {
  display: flex;
  align-items: center;
  font-size: 2.5em; /* Adjust timer font size */
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5em; /* Reduce margin */
}

.digit-group {
  display: flex;
}

.digit {
  min-width: 1em;
  text-align: center;
}

.separator {
  margin: 0 0.2em;
}

.controls {
  display: flex;
  gap: 0.75em; /* Adjust button spacing */
  margin-bottom: 1em; /* Reduce margin */
}

.controls button {
  padding: 0.6em 1.2em; /* Adjust button padding */
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 0.9em; /* Adjust button font size */
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.start-button {
  background-color: #2ecc71;
}

.start-button:hover {
  background-color: #27ae60;
}

.pause-button {
  background-color: #3498db;
}

.pause-button:hover {
  background-color: #2980b9;
}

.reset-button {
  background-color: #e74c3c;
}

.reset-button:hover {
  background-color: #c0392b;
}

.controls button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.session-info {
  text-align: center;
  color: #555;
  font-size: 0.9em; /* Adjust font size */
}

.status {
  font-size: 2em; /* Adjust status font size */
  font-weight: bold;
  color: #777;
  margin-bottom: 0.25em; /* Reduce margin */
}

/* Styles for star display */
.star-container {
  display: flex;
  gap: 0.5em;
  margin-bottom: 1em;
}

.star-icon {
  width: 124px; /* Adjust size as needed */
  height: 124px;
}

@media (max-width: 600px) {
  .pomodoro-container {
    width: 95%;
    padding: 1em;
  }

  .pomodoro-layout {
    flex-direction: column; /* Stack on smaller screens */
    align-items: center;
    gap: 1em;
  }

  .analog-clock-small {
    width: 80px;
    height: 80px;
    margin-bottom: 0.5em;
  }

  .timer-container {
    font-size: 2em;
  }

  .controls {
    flex-direction: column;
    gap: 0.5em;
  }

  .controls button {
    width: 100%;
    padding: 0.7em;
    font-size: 1em;
  }

  .star-icon {
    width: 100px; /* Smaller stars on mobile */
    height: 100px;
  }
}
</style>
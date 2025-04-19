<!-- src/components/TaskList.vue -->
<template>
    <div class="task-list">
      <h2>Tasks</h2>
      <div v-if="isLoading">Loading tasks...</div>
      <div v-else-if="errorMessage">Error loading tasks: {{ errorMessage }}</div>
      <ul v-else>
        <li v-for="task in tasks" :key="task.id">
          <input
            type="checkbox"
            :id="'task-' + task.id"
            :value="task.id"
            :checked="selectedTaskIds.includes(task.id)"
            @change="handleToggleTask(task.id)"
          />
          <label :for="'task-' + task.id">{{ task.attributes?.description }}</label>
        </li>
      </ul>
      <div v-if="getSelectedTasks && getSelectedTasks.length > 0" class="selected-tasks">
        <h3>Selected Tasks:</h3>
        <ul>
          <li v-for="selectedTask in getSelectedTasks" :key="selectedTask.id">
            {{ selectedTask.attributes?.description }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No tasks selected yet.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useTaskStore } from '../stores/task';
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  
  const isLoading = ref(true);
  const errorMessage = ref<string | null>(null);
  
  const taskStore = useTaskStore();
  const { tasks, selectedTaskIds, getSelectedTasks } = storeToRefs(taskStore);
  
  const handleToggleTask = async (taskId: string) => {
    console.log('[TaskList] handleToggleTask:', taskId);
    await taskStore.toggleTask(taskId);
  };
  
  onMounted(async () => {
    try {
      await taskStore.loadTasks();
      console.log('[TaskList] Tasks loaded:', tasks.value);
    } catch (err: any) {
      console.error('[TaskList] Failed to load tasks:', err);
      errorMessage.value = err.message || 'Failed to load tasks.';
    } finally {
      isLoading.value = false;
    }
  });
  </script>
  
  <style scoped>
  .task-list {
    margin-top: 2em;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: left;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1em;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin: 0.7em 0;
  }
  
  input[type="checkbox"] {
    margin-right: 0.5em;
  }
  
  .selected-tasks {
    margin-top: 1.5em;
    padding: 1em;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  
  .selected-tasks h3 {
    margin-top: 0;
    text-align: center;
    margin-bottom: 0.5em;
  }
  
  .selected-tasks ul {
    padding-left: 1em;
  }
  </style>
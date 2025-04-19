// src/stores/task.ts
import { defineStore } from 'pinia';
import { ref, computed, isReactive } from 'vue';
import { updateTaskSelected, fetchTasks } from '../api/taskApi';
import { Task as BaseTask } from '../types/type';
import { toRaw } from 'vue';

// Extend Task to include selected
interface Task extends BaseTask {
  attributes: BaseTask['attributes'] & {
    selected?: boolean;
  };
}

export const useTaskStore = defineStore('task', () => {
  const storeId = 'task-store-' + Math.random().toString(36).slice(2);
  console.log('[TaskStore] Store initialized, storeId:', storeId);

  const selectedTaskIds = ref<string[]>([]);
  const tasks = ref<Task[]>([]);

  console.log('[TaskStore] Tasks ref initialized, isReactive:', isReactive(tasks), 'raw:', toRaw(tasks));
  console.log('[TaskStore] SelectedTaskIds ref initialized, isReactive:', isReactive(selectedTaskIds), 'raw:', toRaw(selectedTaskIds));

  const getSelectedTasks = computed(() => {
    const result = tasks.value.filter((task) => selectedTaskIds.value.includes(task.id));
    console.log('[TaskStore] getSelectedTasks computed, storeId:', storeId, 'tasks:', toRaw(tasks.value), 'selectedTaskIds:', toRaw(selectedTaskIds.value), 'result:', toRaw(result));
    return result;
  });

  const selectTask = async (taskId: string): Promise<void> => {
    console.log(`[TaskStore] selectTask(${taskId}) called, storeId:`, storeId);
    if (!selectedTaskIds.value.includes(taskId)) {
      selectedTaskIds.value.push(taskId);
      try {
        await updateTaskSelected(taskId, true);
        tasks.value = tasks.value.map(task =>
          task.id === taskId ? { ...task, attributes: { ...task.attributes, selected: true } } : task
        );
      } catch (error) {
        console.error('[TaskStore] Failed to update task selection:', error);
        selectedTaskIds.value = selectedTaskIds.value.filter(id => id !== taskId);
        throw error;
      }
    }
  };

  const unselectTask = async (taskId: string): Promise<void> => {
    console.log(`[TaskStore] unselectTask(${taskId}) called, storeId:`, storeId);
    if (selectedTaskIds.value.includes(taskId)) {
      selectedTaskIds.value = selectedTaskIds.value.filter(id => id !== taskId);
      try {
        await updateTaskSelected(taskId, false);
        tasks.value = tasks.value.map(task =>
          task.id === taskId ? { ...task, attributes: { ...task.attributes, selected: false } } : task
        );
      } catch (error) {
        console.error('[TaskStore] Failed to update task selection:', error);
        selectedTaskIds.value.push(taskId);
        throw error;
      }
    }
  };

  const toggleTask = async (taskId: string): Promise<void> => {
    console.log(`[TaskStore] toggleTask(${taskId}) called, storeId:`, storeId);
    if (selectedTaskIds.value.includes(taskId)) {
      await unselectTask(taskId);
    } else {
      await selectTask(taskId);
    }
  };

  const loadTasks = async (): Promise<void> => {
    try {
      console.log('[TaskStore] loadTasks started, storeId:', storeId);
      const fetchedTasks = await fetchTasks();
      tasks.value = fetchedTasks;
      selectedTaskIds.value = fetchedTasks
        .filter(task => task.attributes.selected)
        .map(task => task.id);
      console.log('[TaskStore] Tasks loaded, storeId:', storeId, 'tasks:', toRaw(tasks.value));
      console.log('[TaskStore] Selected task IDs, storeId:', storeId, 'ids:', toRaw(selectedTaskIds.value));
    } catch (error) {
      console.error('[TaskStore] Failed to load tasks, storeId:', storeId, 'error:', error);
      throw error;
    }
  };

  return {
    storeId,
    selectedTaskIds,
    tasks,
    getSelectedTasks,
    selectTask,
    unselectTask,
    toggleTask,
    loadTasks,
  };
});
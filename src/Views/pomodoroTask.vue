<template>
  <div class="task-list">
    <h2>Tasks</h2>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <input type="checkbox" :id="'task-' + index" :value="task" v-model="selectedTasks">
        <label :for="'task-' + index">{{ task }}</label>
      </li>
    </ul>
    <div v-if="selectedTasks.length > 0" class="selected-tasks">
      <h3>Selected Tasks:</h3>
      <ul>
        <li v-for="selectedTask in selectedTasks" :key="selectedTask">{{ selectedTask }}</li>
      </ul>
    </div>
    <div v-else>
      <p>No tasks selected yet.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        "online study",
        "organize stuffs",
        "organize room",
        "organize table and floor",
        "clean and mop floor",
        "play badmiton",
        "learn keyboard",
      ],
      selectedTasks: [],
    };
  },
};
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
<template>
  <div class="subjects">
    <h2>Subjects</h2>
    <div
      v-for="subject in subjects"
      :key="subject.id"
      @click="goToLessons(subject.id)"
      class="subject-card"
    >
      <h3>{{ subject.attributes.title }}</h3>
      <p>{{ subject.attributes.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts"> // Added lang="ts"
import { onMounted, computed } from 'vue';
import { useQuizStore } from '../stores/quiz';
import { useRouter } from 'vue-router';

const store = useQuizStore();
const router = useRouter();

const subjects = computed(() => store.subjects);

const goToLessons = (subjectId: string) => {
  store.loadLessons(subjectId); // Call loadLessons, pass subjectId
  router.push(`/subjects/${subjectId}/lessons`);
};

onMounted(() => {
  store.loadSubjects(); // Call loadSubjects
});
</script>

<style scoped>
.subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.subject-card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #f9f9f9;
}
</style>

<template>
    <div class="story">
      <h2>Story for {{ lessonTitle }}</h2>
      <div v-if="storyContent">
        <p>{{ storyContent }}</p>
        <img :src="imageUrl" alt="Lesson Image" v-if="imageUrl"/>
        <button @click="goToQuiz">Start Quiz</button>
      </div>
      <div v-else>
        <p>Loading story...</p>
      </div>
    </div>
  </template>
  
  <script setup>
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
    try{
      const lesson = store.lessons.find(l => l.id === lessonId.value);
      lessonTitle.value = lesson ? lesson.attributes.title: '';
      const story = await fetchStory(lessonId.value);
      storyContent.value = story;
      imageUrl.value = await fetchImage(lessonId.value);
    }
    catch(e){
      console.log(e);
    }
  
    await store.loadQuestions(lessonId.value);
  });
  </script>
  
  <style scoped>
  .story {
    padding: 20px;
  }
  img{
    max-width: 100%;
    height: auto;
  }
  </style>
  
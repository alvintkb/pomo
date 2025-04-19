<template>
    <div class="score">
      <h2>Your Score</h2>
      <p>Your final score is: {{ score }}</p>
      <p>Total Correct Answers: {{ correctAnswers }}</p>
      <p>Total Questions: {{ totalQuestions }}</p>
      <button @click="playAgain">Play Again</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuizStore } from '../stores/quiz';
  
  const store = useQuizStore();
  const router = useRouter();
  
  // Compute the score.  This is a basic example; adjust logic as needed.
  const score = computed(() => {
    if (!store.progress || store.progress.length === 0) return 0;
    let correctCount = 0;
    store.progress.forEach(p => {
      if (p.is_correct) {
        correctCount++;
      }
    });
    return correctCount; // Return the number of correct answers as the score
  });
  
  const correctAnswers = computed(() => {
    if (!store.progress || store.progress.length === 0) return 0;
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
      if (store.questions.length === 0){
          store.loadQuestions();
      }
  });
  </script>
  
  <style scoped>
  .score {
    text-align: center;
    padding: 20px;
    border: 1px solid #ccc;
    margin: 20px auto;
    max-width: 400px;
  }
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  p {
    font-size: 18px;
    margin-bottom: 10px;
  }
  button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
  }
  </style>
  
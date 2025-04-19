<template>
    <div class="analog-clock">
      <div class="hand hour-hand" :style="hourHandStyle"></div>
      <div class="hand minute-hand" :style="minuteHandStyle"></div>
      <div class="hand second-hand" :style="secondHandStyle"></div>
      <div class="center-dot"></div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  
  export default {
    setup() {
      const now = ref(new Date());
      let intervalId = null;
  
      const hour = computed(() => now.value.getHours() % 12);
      const minute = computed(() => now.value.getMinutes());
      const second = computed(() => now.value.getSeconds());
  
      const hourHandStyle = computed(() => {
        const hourDeg = (hour.value * 30) + (minute.value * 0.5);
        return { transform: `rotate(${hourDeg}deg)` };
      });
  
      const minuteHandStyle = computed(() => {
        const minuteDeg = (minute.value * 6) + (second.value * 0.1);
        return { transform: `rotate(${minuteDeg}deg)` };
      });
  
      const secondHandStyle = computed(() => {
        const secondDeg = second.value * 6;
        return { transform: `rotate(${secondDeg}deg)` };
      });
  
      onMounted(() => {
        intervalId = setInterval(() => {
          now.value = new Date();
        }, 1000);
      });
  
      onUnmounted(() => {
        clearInterval(intervalId);
      });
  
      return {
        hourHandStyle,
        minuteHandStyle,
        secondHandStyle,
      };
    },
  };
  </script>
  
  <style scoped>
.analog-clock {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #333; /* Thicker border */
  background-color: #f9f9f9; /* Lighter background */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Subtle shadow */
}

.hand {
  position: absolute;
  transform-origin: bottom center;
  border-radius: 6px; /* Slightly more rounded hands */
}

.hour-hand {
  width: 6%; /* Slightly wider */
  height: 35%; /* Slightly longer */
  background-color: #333;
  top: 15%; /* Adjust top position */
  left: 47%; /* Adjust left position to center */
  transform: translateX(-50%); /* Center the hand */
}

.minute-hand {
  width: 4%; /* Slightly narrower than hour */
  height: 45%; /* Longer than hour */
  background-color: #555;
  top: 5%; /* Adjust top position */
  left: 48%; /* Adjust left position to center */
  transform: translateX(-50%); /* Center the hand */
}

.second-hand {
  width: 2%; /* Thinner for seconds */
  height: 50%; /* Longest hand */
  background-color: #e74c3c;
  top: 0%; /* Extend to the edge */
  left: 49%; /* Adjust left position to center */
  transform: translateX(-50%); /* Center the hand */
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px; /* Slightly larger dot */
  height: 12px; /* Slightly larger dot */
  background-color: #333;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 1; /* Ensure it's on top of the hands */
}

/* Add some subtle tick marks */
.analog-clock::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  /* Create radial lines for ticks */
  background: repeating-radial-gradient(
    circle,
    transparent 0,
    transparent 2%,
    #ccc 2%,
    #ccc 4%
  );
}
</style>
<template>
  <Transition name="fade">
    <div 
      v-if="show"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div 
        class="absolute inset-0 bg-black"
        :class="win ? 'bg-opacity-50' : 'bg-opacity-70'"
      ></div>
      
      <div 
        class="relative transform transition-all duration-1000"
        :class="[
          'character-container',
          {'scale-150 brightness-100': show && win},
          {'scale-150 grayscale brightness-75': show && !win}
        ]"
      >
        <!-- White glow effect for win -->
        <div 
          v-if="win"
          class="absolute inset-0 animate-pulse"
          :class="{'glow-effect': show}"
        ></div>
        
        <img 
          src="https://wufeng98.cn/imgweb/uploads/1732869328543-1732869257476-5706e6b54c88b4930cbd0ef58406a28-removebg-preview.png" 
          alt="Character"
          class="relative z-10 w-32 h-32 object-contain transition-transform duration-1000"
        >
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  win: Boolean
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.character-container {
  transition: all 1s ease-out;
}

.glow-effect {
  background: radial-gradient(circle at center, 
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.4) 30%,
    rgba(255, 255, 255, 0) 70%
  );
  filter: blur(20px);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
<template>
  <div class="relative w-full aspect-[428/521] bg-gray-800 rounded-lg overflow-hidden">
    <img src="https://wufeng98.cn/imgweb/uploads/1732875130461-PixPin_2024-11-17_17-11-32.png" alt="Room Map" class="w-full h-full object-cover">
    
    <div 
      v-for="(room, index) in rooms" 
      :key="index"
      :style="{
        position: 'absolute',
        left: `${room.x}%`,
        top: `${room.y}%`,
        width: `${room.width}%`,
        height: `${room.height}%`
      }"
      :class="[
        'room-box cursor-pointer transition-all duration-300',
        modelValue === index ? 'selected' : ''
      ]"
      @click="$emit('update:modelValue', index)"
    >
      <!-- Chip amount display -->
      <div class="chip-amount">
        <div class="chip-icon">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          </svg>
        </div>
        <span class="chip-value">{{ room.chips || 0 }}</span>
      </div>

      <div class="room-content">
        <span class="room-number">{{ index + 1 }}</span>
      </div>
    </div>

    <Character 
      :show="modelValue !== null"
      :target-room="modelValue !== null ? rooms[modelValue] : null"
      :bet-amount="betAmount"
    />
  </div>
</template>

<script setup>
import Character from './Character.vue'

defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  rooms: {
    type: Array,
    required: true
  },
  betAmount: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.room-box {
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
}

.room-box:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(2px);
}

.room-box.selected {
  border-color: rgba(74, 222, 128, 0.5);
  background: rgba(74, 222, 128, 0.1);
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.4);
  backdrop-filter: blur(2px);
}

.chip-amount {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 9999px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.chip-icon {
  color: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.room-box:hover .room-content,
.room-box.selected .room-content {
  opacity: 1;
}

.room-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.selected .room-number {
  color: rgb(74, 222, 128);
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}
</style>
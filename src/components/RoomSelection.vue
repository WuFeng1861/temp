<template>
  <div class="min-h-screen bg-gray-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
    <!-- 主游戏区域 -->
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative z-10">
      <!-- 头部区域 -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-8 text-white relative">
        <router-link
          to="/games"
          class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors text-sm sm:text-base"
        >
          返回
        </router-link>

        <button
          @click="showHistory = !showHistory"
          class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors text-sm sm:text-base"
        >
          {{ showHistory ? '隐藏' : '显示' }}记录
        </button>

        <h1 class="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">房间选择</h1>
        <div class="text-center">
          <span class="text-lg sm:text-xl">余额:</span>
          <span class="text-2xl sm:text-4xl font-bold ml-2">{{ balance }}</span>
          <span class="ml-2">筹码</span>
        </div>
      </div>

      <!-- 游戏区域 -->
      <div class="p-4 sm:p-8">
        <div class="space-y-6">
          <!-- 房间地图 -->
          <RoomMap
            v-model="selectedRoom"
            :rooms="rooms"
            :bet-amount="betAmount"
          />

          <!-- 下注控制区 -->
          <BettingControls
            v-model="betAmount"
            :max-bet="balance"
            :can-bet="canBet"
            @bet="placeBet"
          />

          <!-- 游戏规则 -->
          <GameRules />
        </div>
      </div>
    </div>

    <!-- 历史记录面板 -->
    <HistoryPanel
      v-model="showHistory"
      :history="gameHistory"
      :pagination="pagination"
      @page-change="handlePageChange"
    />

    <!-- 结果提示框 -->
    <RoomGameResult
      v-model:show="showResult"
      :win="!!result?.win"
      :win-amount="result?.winAmount"
      :bet-amount="result?.amount"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RoomMap from './room-game/RoomMap.vue'
import BettingControls from './room-game/BettingControls.vue'
import GameRules from './room-game/GameRules.vue'
import HistoryPanel from './HistoryPanel.vue'
import RoomGameResult from './room-game/RoomGameResult.vue'

const selectedRoom = ref(null)
const betAmount = ref(10)
const result = ref(null)
const showHistory = ref(false)
const showResult = ref(false)
const isPlaying = ref(false)
const balance = ref(10000)
const gameHistory = ref([])

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1
})

// 房间配置
const rooms = ref([
  {x:0,y:3,width:38,height:30,chips:100},
  {x:38,y:5,width:28,height:28,chips:100000},
  {x:66,y:3,width:35,height:30,chips:100},
  {x:0,y:32,width:28,height:35,chips:200},
  {x:28,y:46,width:38,height:22,chips:1000},
  {x:80,y:46,width:19,height:32,chips:2000},
  {x:0,y:66,width:28,height:32,chips:1000},
  {x:28,y:80,width:38,height:18,chips:30000}
])

const canBet = computed(() => {
  return betAmount.value > 0 &&
    betAmount.value <= balance.value &&
    selectedRoom.value !== null &&
    !isPlaying.value
})

const placeBet = async () => {
  if (!canBet.value) return

  isPlaying.value = true
  result.value = null

  // 模拟游戏逻辑
  const winningRoom = Math.floor(Math.random() * rooms.value.length)
  const win = selectedRoom.value === winningRoom
  const winAmount = win ? betAmount.value * 3 : 0

  // 更新余额
  balance.value += win ? winAmount - betAmount.value : -betAmount.value

  // 更新房间筹码显示
  rooms.value[selectedRoom.value].chips = betAmount.value

  // 设置结果
  result.value = {
    win,
    amount: betAmount.value,
    winAmount,
    message: win
      ? `恭喜！你赢得了 ${winAmount} 筹码！`
      : `很遗憾，你输掉了 ${betAmount.value} 筹码！`
  }

  // 添加到历史记录
  const newRecord = {
    id: Date.now(),
    gameType: 'room',
    amount: betAmount.value,
    win,
    finalBalance: balance.value,
    selectedOption: String(selectedRoom.value),
    createdAt: new Date().toISOString()
  }
  
  gameHistory.value.unshift(newRecord)
  pagination.value.totalItems = gameHistory.value.length
  pagination.value.totalPages = Math.ceil(gameHistory.value.length / pagination.value.pageSize)

  showResult.value = true

  // 重置选择
  setTimeout(() => {
    selectedRoom.value = null
    rooms.value.forEach(room => room.chips = 0)
    isPlaying.value = false
  }, 1000)
}

const handlePageChange = (page) => {
  pagination.value.currentPage = page
}
</script>
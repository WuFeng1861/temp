<template>
  <div class="min-h-screen flex items-center justify-center px-4 relative">
    <SciFiBackground />
    <div class="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
      <!-- 头部渐变背景 -->
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
        <h2 class="text-3xl font-bold text-center">Game ONE</h2>
        <p class="text-center mt-2 text-white/80">登录您的游戏账号</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">用户名</label>
            <input
                v-model="username"
                type="text"
                required
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50"
                placeholder="请输入用户名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">密码</label>
            <div class="mt-1 relative">
              <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10 bg-white/50"
                  placeholder="请输入密码"
              />
              <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 px-3 flex items-center"
              >
                <svg
                    v-if="showPassword"
                    class="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg
                    v-else
                    class="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 验证码输入框和图片 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">验证码</label>
            <div class="mt-1 flex gap-2">
              <input
                  v-model="captchaText"
                  type="text"
                  required
                  maxlength="4"
                  class="block w-24 sm:w-32 px-2 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center bg-white/50"
                  placeholder="验证码"
              />
              <div
                  class="flex-1 h-10 bg-white rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                  @click="refreshCaptcha"
                  v-html="captchaSvg"
              ></div>
            </div>
          </div>

          <div>
            <button
                type="submit"
                class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              登录
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <router-link
              to="/register"
              class="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            还没有账号？立即注册
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import api from '@/api/axios.js'
import SciFiBackground from '@/components/SciFiBackground.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const captchaText = ref('')
const captchaSvg = ref('')
const captchaId = ref('')

const getCaptcha = async () => {
  try {
    const response = await api.get('/api/auth/captcha')
    captchaSvg.value = response.svg
    captchaId.value = response.captchaId
  } catch (error) {
    console.error('获取验证码失败:', error)
    ElMessage.error('获取验证码失败')
  }
}

const refreshCaptcha = () => {
  getCaptcha()
  captchaText.value = ''
}

const handleLogin = async () => {
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
      captchaId: captchaId.value,
      captchaText: captchaText.value
    })
    ElMessage.success('登录成功')
    router.push('/games')
  } catch (error) {
    ElMessage.error(error.response?.data?.error?.message || '登录失败')
    refreshCaptcha()
  }
}

onMounted(() => {
  getCaptcha()
})
</script>
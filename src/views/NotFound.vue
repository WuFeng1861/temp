<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">页面不存在</p>
      <router-link 
        to="/" 
        class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑
</script> 
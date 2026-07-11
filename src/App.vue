<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Global app loading state
const isAppInitializing = ref(true)

onMounted(() => {
  const auth = getAuth()
  
  // Listen for the initial Firebase auth check
  onAuthStateChanged(auth, (user) => {
    // Once Firebase figures out if the user is logged in or not, hide the loader
    isAppInitializing.value = false
  })
})
</script>

<template>
  <!-- Global Full-Screen Loader -->
  <div v-if="isAppInitializing" class="min-h-screen bg-slate-50 flex flex-col items-center justify-center select-none z-[9999]">
    <div class="relative flex justify-center items-center">
      <div class="absolute inset-0 bg-purple-100 rounded-full blur-xl opacity-60 w-24 h-24 mx-auto"></div>
      <svg class="animate-spin h-10 w-10 text-[#6b21a8] relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <p class="mt-4 text-sm font-medium text-slate-500 tracking-widest uppercase animate-pulse">
      Initializing...
    </p>
  </div>

  <!-- Render the actual app once initialized -->
  <router-view v-else />
</template>
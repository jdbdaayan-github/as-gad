<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 py-12 select-none">
    <div class="text-center max-w-md w-full space-y-6">
      
      <!-- Visual Illustration / Icon -->
      <div class="relative flex justify-center">
        <div class="absolute inset-0 bg-purple-100 rounded-full blur-2xl opacity-40 w-32 h-32 mx-auto"></div>
        <div class="w-24 h-24 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center relative">
          <svg class="w-12 h-12 text-[#6b21a8] animate-pulse" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
      </div>

      <!-- Typography Text -->
      <div class="space-y-2">
        <h1 class="text-7xl font-extrabold tracking-tighter text-slate-900 font-mono">
          404
        </h1>
        <h2 class="text-xl font-bold text-slate-800 tracking-tight">
          Page Not Found
        </h2>
        <p class="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <!-- Navigation Redirects -->
      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button 
          @click="$router.go(-1)"
          class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-10 px-5 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Go Back
        </button>
        
        <router-link 
          to="/"
          class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800 h-10 px-5 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Return Home
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
// No complex runtime bindings required for this static template view
</script>
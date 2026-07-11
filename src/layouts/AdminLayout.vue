<script setup>
import { ref } from 'vue'

// Reactive state to control the mobile sidebar
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 font-sans text-slate-900 relative">
    
    <!-- Mobile Sidebar Backdrop Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="closeSidebar"
      class="fixed inset-0 bg-slate-900/40 z-30 md:hidden transition-opacity duration-300"
    />
    
    <!-- Sidebar Navigation -->
    <aside 
      :class="[
        'w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-40 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      
      <!-- Brand Area & Mobile Close Button -->
      <div class="h-14 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
            <span class="text-white font-bold text-[10px]">DS</span>
          </div>
          <span class="font-semibold text-sm tracking-tight text-slate-900">
            GAD Hub Admin
          </span>
        </div>

        <!-- Mobile Close Cross Icon -->
        <button 
          @click="closeSidebar"
          class="md:hidden text-slate-500 hover:text-slate-900 p-1 focus:outline-none rounded-md"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto py-4 space-y-6 custom-scrollbar">
        
        <!-- Group: Overview -->
        <div class="px-3">
          <h2 class="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500 uppercase">
            Overview
          </h2>
          <div class="space-y-1">
            <router-link 
              to="/admin" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              Home
            </router-link>
            
            <router-link 
              to="/admin/data" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Data Disaggregation
            </router-link>
          </div>
        </div>

        <!-- Group: CMS -->
        <div class="px-3">
          <h2 class="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500 uppercase">
            CMS
          </h2>
          <div class="space-y-1">
            <router-link 
              to="/admin/banner" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Banner
            </router-link>

            <router-link 
              to="/admin/theme" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
              Theme
            </router-link>

            <router-link 
              to="/admin/announcements" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              Announcements
            </router-link>
            
            <router-link 
              to="/admin/activities" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              Activities
            </router-link>

            <router-link 
              to="/admin/documentations" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Documentations
            </router-link>
          </div>
        </div>

        <!-- Group: System -->
        <div class="px-3">
          <h2 class="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500 uppercase">
            System
          </h2>
          <div class="space-y-1">
            <router-link 
              to="/admin/directory" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Directory
            </router-link>
            
            <router-link 
              to="/admin/twg" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.001 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              TWG Directory
            </router-link>
            
            <router-link 
              to="/admin/settings" 
              class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              active-class="bg-slate-100 text-slate-900"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Settings
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Bottom Profile/Logout Area -->
      <div class="p-4 border-t border-slate-200 shrink-0">
        <button 
          class="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Log out
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <!-- Top Header -->
      <header class="h-14 bg-white border-b border-slate-200 px-4 lg:px-6 flex justify-between items-center z-10 shrink-0">
        
        <!-- Left: Mobile Toggle & Context -->
        <div class="flex items-center gap-4">
          <button 
            @click="toggleSidebar"
            class="md:hidden text-slate-500 hover:text-slate-900 focus:outline-none rounded-sm transition-colors p-1"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          
          <span class="text-sm font-medium text-slate-500 hidden sm:block">
            <slot name="header-title">Overview</slot>
          </span>
        </div>
        
        <!-- Right: Actions & Profile -->
        <div class="flex items-center gap-4">
          <!-- Search Input -->
          <div class="hidden sm:flex items-center relative">
            <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search..." 
              class="h-8 w-64 rounded-md border border-slate-200 bg-transparent px-3 pl-8 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950" 
            />
          </div>

          <!-- User Profile Dropdown Trigger -->
          <button class="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-medium text-xs hover:bg-slate-200 transition-colors">
            AD
          </button>
        </div>
      </header>

      <!-- Scrollable Page Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
        <!-- Container max width -->
        <div class="max-w-full mx-auto w-full">
          <slot />
        </div>
      </div>
      
    </main>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
<template>
  <!-- Using a single wrapper for the entire header section -->
  <header class="w-full flex flex-col">
    
    <!-- Top Announcement Bar (Based on image_3483d0.png) -->
    <div class="bg-[#111827] w-full px-4 sm:px-6 lg:px-8 py-1 flex justify-center items-center">
      <div class="flex items-center space-x-2 text-white text-xs sm:text-sm font-medium tracking-wide">
        <!-- Shield Icon -->
        <svg 
          class="w-4 h-4 text-blue-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          ></path>
        </svg>
        <span>Magna Carta of Women (RA 9710) Mandate: Building a Safe and Inclusive Society for All Genders</span>
      </div>
    </div>

    <!-- Main Navbar Content -->
    <nav class="bg-[#4c0f89] w-full flex flex-col">
      <div class="px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex items-center justify-between h-20">
          
          <!-- Left Side: Logos and Title -->
          <div class="flex items-center space-x-4">
            
            <!-- Logos -->
            <div class="flex items-center space-x-3">
              <DSWDLogo/>
              <BPLogo/>
            </div>

            <!-- Titles -->
            <div class="hidden sm:flex items-center space-x-1.5 ml-2">
              <span class="text-white font-bold text-lg tracking-wide">
                Administrative Service
              </span>
              <span class="text-[#FFD700] font-bold text-lg tracking-wide">
                Gender and Development Information Hub
              </span>
            </div>
            
          </div>

          <!-- Right Side: Navigation Links -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-6">
              <a 
                v-for="item in navItems" 
                :key="item.name" 
                :href="item.href" 
                class="text-white hover:text-gray-300 px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-200"
              >
                {{ item.name }}
              </a>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
          </div>
          
        </div>
      </div>
    </nav>
    
  </header>
</template>

<script setup>
import { ref } from 'vue'
import DSWDLogo from '../../DSWDLogo.vue';
import BPLogo from '../../BPLogo.vue';

// Navigation links array
const navItems = ref([
  { name: 'Home', href: '#' },
  { name: 'Directory', href: '#' },
  { name: 'Activities', href: '#' },
  { name: 'Resources', href: '#' },
])
</script>
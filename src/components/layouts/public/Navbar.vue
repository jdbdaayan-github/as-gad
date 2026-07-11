<template>
  <!-- Using a single wrapper for the entire header section -->
  <header class="w-full flex flex-col relative z-50">
    
    <!-- Top Announcement Bar -->
    <div class="bg-[#111827] w-full px-4 sm:px-6 lg:px-8 py-1 flex justify-center items-center">
      <div class="flex items-center space-x-2 text-white text-xs sm:text-sm font-medium tracking-wide text-center">
        <!-- Shield Icon -->
        <svg 
          class="w-4 h-4 text-blue-400 shrink-0" 
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
        <span class="text-xs">Magna Carta of Women (RA 9710) Mandate: Building a Safe and Inclusive Society for All Genders</span>
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
            <div class="hidden sm:flex flex-col md:flex-row md:items-center md:space-x-1.5 ml-2">
              <span class="text-white font-bold text-base md:text-lg tracking-wide">
                Administrative Service
              </span>
              <span class="text-[#FFD700] font-bold text-base md:text-lg tracking-wide">
                Gender and Development Information Hub
              </span>
            </div>
          </div>

          <!-- Right Side: Desktop Navigation Links -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-6">
              <router-link 
                v-for="item in navItems" 
                :key="item.name" 
                :to="item.path" 
                class="text-white hover:text-gray-300 px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-200"
                active-class="text-[#FFD700] border-b-2 border-[#FFD700]"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <button 
              @click="toggleMobileMenu"
              class="text-white hover:text-gray-300 focus:outline-none p-1 transition-colors"
              aria-label="Toggle menu"
            >
              <!-- Hamburger menu icon when closed, X icon when open -->
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  v-if="!isMobileMenuOpen"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path 
                  v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
        </div>
      </div>

      <!-- Mobile Dropdown Navigation Menu -->
      <div 
        v-show="isMobileMenuOpen"
        class="md:hidden bg-[#3b0a6b] border-t border-[#5d16a6] transition-all duration-200 ease-in-out"
      >
        <div class="px-4 pt-2 pb-4 space-y-1">
          <router-link 
            v-for="item in navItems" 
            :key="item.name" 
            :to="item.path" 
            @click="isMobileMenuOpen = false"
            class="block text-white hover:bg-[#4c0f89] px-3 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wider transition-colors"
            active-class="text-[#FFD700] bg-[#4c0f89]"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>
    
  </header>
</template>

<script setup>
import { ref } from 'vue'
import DSWDLogo from '../../DSWDLogo.vue';
import BPLogo from '../../BPLogo.vue';

// Reactive state for opening/closing the mobile dropdown menu
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Updated: Added FAQs to the Navigation links array
const navItems = ref([
  { name: 'Home', path: '/' },
  { name: 'Directory', path: '/directory' },
  { name: 'Activities', path: '/activities' },
  { name: 'Resources', path: '/resources' },
  { name: 'FAQs', path: '/faqs' },
])
</script>
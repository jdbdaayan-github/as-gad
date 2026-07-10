<template>
  <div class="w-full relative bg-white">
    
    <!-- Loading Skeleton (Shows briefly while fetching from Firestore) -->
    <div v-if="isLoading" class="w-full h-[300px] md:h-[500px] bg-slate-200 animate-pulse flex items-center justify-center">
      <svg class="w-8 h-8 text-slate-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    </div>

    <!-- Active Firestore Banner -->
    <a 
      v-else-if="activeBanner" 
      :href="activeBanner.link || '#'" 
      :target="activeBanner.link ? '_blank' : '_self'"
      :class="{ 'cursor-default pointer-events-none': !activeBanner.link }"
      class="block w-full"
    >
      <img 
        :src="activeBanner.imageUrl" 
        :alt="activeBanner.title" 
        class="w-full h-auto object-cover block"
      >
    </a>

    <!-- Fallback Image (If database is empty or no banners are active) -->
    <div v-else class="w-full">
      <img 
        :src="defaultBanner" 
        alt="GAD Hub Banner" 
        class="w-full h-auto object-cover block"
      >
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Fallback to your original static image
import defaultBanner from "../assets/images/Banner.png";

// Import Firebase (Adjust path to your firebase config file if needed)
import { db } from '../firebase/index.js'; 
import { collection, getDocs, query, where } from 'firebase/firestore';

const activeBanner = ref(null);
const isLoading = ref(true);

const fetchActiveBanner = async () => {
  try {
    // Query Firestore for banners where isActive is true
    const q = query(collection(db, 'banners'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const banners = snapshot.docs.map(doc => doc.data());
      
      // Sort them by createdAt date so the newest one shows up first
      banners.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Set the most recent active banner to be displayed
      activeBanner.value = banners[0]; 
    }
  } catch (error) {
    console.error("Error fetching active banner:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchActiveBanner();
});
</script>
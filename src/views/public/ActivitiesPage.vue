<script setup>
import { ref, computed, onMounted } from 'vue';
import Banner from '../../components/Banner.vue';
import PublicLayout from '../../layouts/PublicLayout.vue';

import { db } from '../../firebase/index.js'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const activities = ref([]);
const isLoading = ref(true);

// State for the active year filter
const selectedYear = ref('All');

// Fetch Activities from Firestore
const fetchActivities = async () => {
  try {
    const activitiesQuery = query(
      collection(db, 'activities'), 
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(activitiesQuery);

    activities.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch(error) {
    console.error("Firestore Error:", error);
  } finally {
    isLoading.value = false;
  }
};

// Dynamically extract unique years from the activities data for the filter buttons
const availableYears = computed(() => {
  const years = new Set(
    activities.value
      .map(a => a.date ? a.date.substring(0, 4) : null)
      .filter(Boolean)
  );
  
  // Return 'All' followed by years sorted in descending order (e.g., All, 2025, 2024...)
  return ['All', ...Array.from(years).sort((a, b) => b - a)];
});

// Filter the activities array based on the selected year
const filteredActivities = computed(() => {
  if (selectedYear.value === 'All') {
    return activities.value;
  }
  return activities.value.filter(a => a.date && a.date.startsWith(selectedYear.value));
});

onMounted(() => {
  fetchActivities();
});
</script>

<template>
  <PublicLayout>
    <Banner/>
    
    <!-- Activities Section -->
    <section class="w-full py-12 bg-white min-h-[calc(100vh-200px)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="flex flex-col items-center gap-3">
            <svg 
              class="animate-spin h-8 w-8 text-[#581c87]" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path>
            </svg>
            <span class="text-sm text-gray-500 font-medium">
              Loading activities...
            </span>
          </div>
        </div>

        <div v-else>
          <!-- Year Filter Buttons -->
          <div class="flex flex-wrap justify-center gap-2 mb-10">
            <button
              v-for="year in availableYears"
              :key="year"
              @click="selectedYear = year"
              :class="[
                'px-6 py-2 rounded-md font-bold text-white transition-colors duration-200 shadow-sm',
                selectedYear === year 
                  ? 'bg-[#a855f7]' // Active state (Light Purple)
                  : 'bg-[#581c87] hover:bg-[#6b21a8]' // Inactive state (Dark Purple)
              ]"
            >
              {{ year }}
            </button>
          </div>

          <!-- Empty State (if a filter yields no results) -->
          <div v-if="filteredActivities.length === 0" class="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-gray-500 font-medium">No activities found for this selection.</p>
          </div>

          <!-- Activities Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div 
              v-for="activity in filteredActivities" 
              :key="activity.id"
              class="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
            >
              
              <!-- Image Header -->
              <!-- Note: If you don't have an imageUrl in Firestore yet, it falls back to a placeholder -->
              <div class="h-48 w-full bg-gray-200 relative overflow-hidden shrink-0">
                <img 
                  :src="activity.imageUrl || 'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=Activity+Image'" 
                  :alt="activity.title"
                  class="w-full h-full object-cover" 
                />
              </div>
              
              <!-- Card Content -->
              <div class="p-6 flex-1 flex flex-col">
                
                <!-- Title -->
                <h4 class="text-[1.1rem] font-bold text-[#7a22a3] mb-3 leading-snug">
                  {{ activity.title }}
                </h4>

                <!-- Description (Clamped to ~6 lines to match the reference image) -->
                <p class="text-gray-600 text-sm leading-relaxed line-clamp-6">
                  {{ activity.description }}
                </p>
                
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  </PublicLayout>
</template>

<style scoped>
/* Ensure line clamping works perfectly across browsers for the description text */
.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
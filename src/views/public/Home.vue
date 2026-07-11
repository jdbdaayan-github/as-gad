<script setup>
import { ref, computed, onMounted } from 'vue';
import Banner from '../../components/Banner.vue';
import PublicLayout from '../../layouts/PublicLayout.vue';

import { db } from '../../firebase/index.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// --- State for Sex Disaggregated Data ---
const divisionsData = ref([]);
const isLoading = ref(true);

// --- State for Announcements ---
const announcements = ref([]);
const isAnnouncementsLoading = ref(true);

// --- Fetch Announcements (With JavaScript filtering to prevent Firebase index errors) ---
const fetchAnnouncements = async () => {
  try {
    // 1. Fetch announcements ordered by date
    const q = query(
      collection(db, 'announcements'), 
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);

    // 2. Map the data
    const allAnnouncements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 3. Filter for 'Published' and keep only the top 3 using JavaScript
    announcements.value = allAnnouncements
      .filter(item => item.status === 'Published')
      .slice(0, 3);

  } catch(error) {
    console.error("Firestore Error (Announcements):", error);
  } finally {
    isAnnouncementsLoading.value = false;
  }
};

// --- Fetch Disaggregated Data ---
const fetchDisaggregatedData = async () => {
  try {
    const snapshot = await getDocs(
      collection(db, 'divisionsData')
    );

    divisionsData.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch(error) {
    console.error("Firestore Error (Data):", error);
  } finally {
    isLoading.value = false;
  }
};

// --- Computed Properties for Data ---
const maleData = computed(() => {
  return divisionsData.value.map(item => ({
    division: item.name,
    count: Number(item.male)
  }));
});

const femaleData = computed(() => {
  return divisionsData.value.map(item => ({
    division: item.name,
    count: Number(item.female)
  }));
});

const totalMale = computed(() => {
  return divisionsData.value.reduce((total,item)=> total + Number(item.male), 0);
});

const totalFemale = computed(() => {
  return divisionsData.value.reduce((total,item)=> total + Number(item.female), 0);
});

// --- Helpers ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  // Adding T00:00:00 prevents timezone shifting
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
};

onMounted(() => {
  fetchAnnouncements();
  fetchDisaggregatedData();
});
</script>

<template>
  <PublicLayout>
    <Banner/>

    <!-- Sex Disaggregated Data Section -->
    <section class="w-full py-16 bg-[#fafafa]">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        
        <!-- Header -->
        <div class="text-center mb-10">
          <h2 class="text-2xl font-extrabold text-black uppercase tracking-wider">
            Administrative Service
          </h2>
          <h3 class="text-lg font-bold text-[#9b2cdd] uppercase tracking-wide mt-1">
            Sex Disaggregated Data
          </h3>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="flex flex-col items-center gap-3">
            <svg class="animate-spin h-8 w-8 text-[#4c0f89]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path>
            </svg>
            <span class="text-sm text-gray-500">Loading sex-disaggregated data...</span>
          </div>
        </div>

        <!-- Data Cards -->
        <div v-else class="flex flex-col md:flex-row justify-center items-start gap-8">
          
          <!-- Male Card -->
          <div class="bg-white rounded-xl shadow-lg shadow-gray-200/50 p-5 w-full md:w-[400px]">
            <div class="bg-[#3f51b5] rounded-md px-4 py-2.5 flex justify-between items-center mb-4">
              <span class="text-white font-bold tracking-widest text-sm uppercase">Male</span>
              <span class="bg-white text-[#3f51b5] font-bold px-3 py-0.5 rounded text-sm">{{ totalMale }}</span>
            </div>
            
            <div class="text-[13px] text-gray-800 mb-2 px-1">No. per Division</div>
            
            <ul class="flex flex-col">
              <li 
                v-for="(item, index) in maleData" 
                :key="'male-'+index" 
                class="flex justify-between py-2.5 px-2 border-b border-gray-100 last:border-none text-[13px]"
              >
                <span class="text-gray-700">{{ item.division }}</span>
                <span class="text-[#3f51b5] font-bold">{{ item.count }}</span>
              </li>
            </ul>
          </div>

          <!-- Female Card -->
          <div class="bg-white rounded-xl shadow-lg shadow-gray-200/50 p-5 w-full md:w-[400px]">
            <div class="bg-[#3f51b5] rounded-md px-4 py-2.5 flex justify-between items-center mb-4">
              <span class="text-white font-bold tracking-widest text-sm uppercase">Female</span>
              <span class="bg-white text-[#3f51b5] font-bold px-3 py-0.5 rounded text-sm">{{ totalFemale }}</span>
            </div>
            
            <div class="text-[13px] text-gray-800 mb-2 px-1">No. per Division</div>
            
            <ul class="flex flex-col">
              <li 
                v-for="(item, index) in femaleData" 
                :key="'female-'+index" 
                class="flex justify-between py-2.5 px-2 border-b border-gray-100 last:border-none text-[13px]"
              >
                <span class="text-gray-700">{{ item.division }}</span>
                <span class="text-[#3f51b5] font-bold">{{ item.count }}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>

    <!-- GAD Documentations Section -->
    <section class="w-full py-16 bg-white overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        
        <h2 class="text-lg md:text-xl font-bold text-[#4c0f89] uppercase tracking-wide mb-12">
          GAD Documentations
        </h2>

        <!-- Simulated Coverflow Carousel -->
        <div class="relative w-full max-w-5xl mx-auto flex items-center justify-center h-[250px] sm:h-[350px] md:h-[450px] mb-8">
          
          <div class="absolute left-0 md:left-10 w-2/3 md:w-3/5 h-4/5 bg-gray-200 rounded-lg shadow-md overflow-hidden opacity-90 transform -translate-x-4 md:-translate-x-12 scale-90 z-0">
            <img src="https://via.placeholder.com/800x600/e2e8f0/94a3b8?text=Left+Image" alt="Previous Event" class="w-full h-full object-cover" />
          </div>

          <div class="absolute right-0 md:right-10 w-2/3 md:w-3/5 h-4/5 bg-gray-200 rounded-lg shadow-md overflow-hidden opacity-90 transform translate-x-4 md:translate-x-12 scale-90 z-0">
            <img src="https://via.placeholder.com/800x600/e2e8f0/94a3b8?text=Right+Image" alt="Next Event" class="w-full h-full object-cover" />
          </div>

          <div class="relative w-3/4 md:w-3/5 h-full bg-white rounded-xl shadow-2xl overflow-hidden z-10 border-4 border-white transition-transform duration-300 hover:scale-[1.02]">
            <img src="https://via.placeholder.com/800x600/ffffff/4c0f89?text=Main+Campaign+Image" alt="18-Day Campaign to End VAW" class="w-full h-full object-cover" />
          </div>

        </div>

        <div class="flex justify-center items-center space-x-4 mt-6">
          <button class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors duration-200 shadow-md">
            <svg class="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors duration-200 shadow-md">
            <svg class="w-5 h-5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

      </div>
    </section>

    <!-- Announcements Section (Updated Design) -->
    <section class="w-full py-16 bg-[#fafafa]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        
        <!-- Custom Tab Navigation Buttons -->
        <div class="flex flex-wrap justify-center items-stretch gap-4 mb-12">
          
          <!-- Announcements Button (Active/Styled) -->
          <button class="bg-white border-2 border-[#6b21a8] text-[#6b21a8] px-8 py-2 rounded shadow-sm transform -rotate-1 hover:rotate-0 transition-all flex flex-col items-center justify-center">
            <span class="font-extrabold text-sm tracking-widest">ANNOUNCEMENTS</span>
            <span class="text-[10px] font-medium italic">What's the latest?</span>
          </button>

          <!-- Calendar Button -->
          <button class="bg-[#581c87] text-white px-8 py-2 rounded shadow-sm hover:bg-[#4c1d95] transition-colors flex flex-col items-center justify-center">
            <span class="font-bold text-sm tracking-widest">CALENDAR</span>
            <span class="text-xs font-medium tracking-widest">OF ACTIVITIES</span>
          </button>

          <!-- Hotlines Button -->
          <button class="bg-[#dc2626] text-white px-8 py-2 rounded shadow-sm hover:bg-[#b91c1c] transition-colors flex items-center justify-center gap-2">
            <span class="font-bold text-lg tracking-widest">HOTLINES</span>
            <div class="bg-white/20 p-1 rounded">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
          </button>

        </div>

        <!-- Loading State -->
        <div v-if="isAnnouncementsLoading" class="flex justify-center items-center py-10">
          <svg class="animate-spin h-8 w-8 text-[#4c0f89]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path>
          </svg>
        </div>

        <!-- Empty State -->
        <div v-else-if="announcements.length === 0" class="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">
          No recent announcements available.
        </div>

        <!-- Announcement Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="announcement in announcements" 
            :key="announcement.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <!-- Image Header (Using fallback if announcement.imageUrl doesn't exist yet) -->
            <div class="w-full h-32 md:h-40 bg-gray-100 relative overflow-hidden shrink-0 border-b border-gray-100">
              <img 
                :src="announcement.imageUrl || 'https://via.placeholder.com/800x300/4c0f89/ffffff?text=Announcement'" 
                :alt="announcement.title"
                class="w-full h-full object-cover"
              />
            </div>
            
            <!-- Card Content Area -->
            <div class="p-4 flex flex-col flex-1">
              <!-- Title (Purple, Uppercase, bold) -->
              <h4 class="text-[15px] font-bold text-[#581c87] mb-2 leading-tight line-clamp-2 uppercase">
                {{ announcement.title }}
              </h4>
              
              <!-- Description -->
              <p class="text-gray-600 text-xs line-clamp-2 flex-1 mb-3">
                {{ announcement.content || announcement.description }}
              </p>
              
              <!-- Date/Meta Data -->
              <div class="text-[10px] text-gray-400 mt-auto pt-2 border-t border-gray-100">
                {{ formatDate(announcement.date) }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

  </PublicLayout>
</template>
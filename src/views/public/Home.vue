<script setup>
import { ref, computed, onMounted } from 'vue';
import Banner from '../../components/Banner.vue';
import PublicLayout from '../../layouts/PublicLayout.vue';

import { db } from '../../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';


const divisionsData = ref([]);
const isLoading = ref(true);


// Fetch Firestore Data
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
    console.error("Firestore Error:", error);
  } finally {
    isLoading.value = false;
  }
};


// Male Data
const maleData = computed(() => {

  return divisionsData.value.map(item => ({
    division: item.name,
    count: Number(item.male)
  }));

});


// Female Data
const femaleData = computed(() => {

  return divisionsData.value.map(item => ({
    division: item.name,
    count: Number(item.female)
  }));

});


// Total Male
const totalMale = computed(() => {

  return divisionsData.value.reduce(
    (total,item)=> total + Number(item.male),
    0
  );

});


// Total Female
const totalFemale = computed(() => {

  return divisionsData.value.reduce(
    (total,item)=> total + Number(item.female),
    0
  );

});


onMounted(()=>{
  fetchDisaggregatedData();
});

</script>

<template>
  <PublicLayout>
    <Banner/>
    
    <!-- Sex Disaggregated Data Section -->
    <section class="w-full py-12 bg-[#fafafa]">
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

        <!-- Cards Container -->
        <!-- Loading State -->
<div v-if="isLoading" class="flex justify-center items-center py-20">
  <div class="flex flex-col items-center gap-3">
    <svg 
      class="animate-spin h-8 w-8 text-[#4c0f89]" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        class="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        stroke-width="4">
      </circle>

      <path 
        class="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z">
      </path>
    </svg>

    <span class="text-sm text-gray-500">
      Loading sex-disaggregated data...
    </span>
  </div>
</div>


<!-- Data Cards -->
<div 
  v-else
  class="flex flex-col md:flex-row justify-center items-start gap-8"
>
          
          <!-- Male Card -->
          <div class="bg-white rounded-xl shadow-lg shadow-gray-200/50 p-5 w-full md:w-[400px]">
            <!-- Card Header -->
            <div class="bg-[#3f51b5] rounded-md px-4 py-2.5 flex justify-between items-center mb-4">
              <span class="text-white font-bold tracking-widest text-sm uppercase">Male</span>
              <span class="bg-white text-[#3f51b5] font-bold px-3 py-0.5 rounded text-sm">
{{ totalMale }}
</span>
            </div>
            
            <div class="text-[13px] text-gray-800 mb-2 px-1">No. per Division</div>
            
            <!-- List Items -->
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
            <!-- Card Header -->
            <div class="bg-[#3f51b5] rounded-md px-4 py-2.5 flex justify-between items-center mb-4">
              <span class="text-white font-bold tracking-widest text-sm uppercase">Female</span>
              <span class="bg-white text-[#3f51b5] font-bold px-3 py-0.5 rounded text-sm">
{{ totalFemale }}
</span>
            </div>
            
            <div class="text-[13px] text-gray-800 mb-2 px-1">No. per Division</div>
            
            <!-- List Items -->
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
        
        <!-- Section Title -->
        <h2 class="text-lg md:text-xl font-bold text-[#4c0f89] uppercase tracking-wide mb-12">
          GAD Documentations
        </h2>

        <!-- Simulated Coverflow Carousel -->
        <div class="relative w-full max-w-5xl mx-auto flex items-center justify-center h-[250px] sm:h-[350px] md:h-[450px] mb-8">
          
          <!-- Background Left Image -->
          <div class="absolute left-0 md:left-10 w-2/3 md:w-3/5 h-4/5 bg-gray-200 rounded-lg shadow-md overflow-hidden opacity-90 transform -translate-x-4 md:-translate-x-12 scale-90 z-0">
            <!-- Replace src with your actual image path -->
            <img src="https://via.placeholder.com/800x600/e2e8f0/94a3b8?text=Left+Image" alt="Previous Event" class="w-full h-full object-cover" />
          </div>

          <!-- Background Right Image -->
          <div class="absolute right-0 md:right-10 w-2/3 md:w-3/5 h-4/5 bg-gray-200 rounded-lg shadow-md overflow-hidden opacity-90 transform translate-x-4 md:translate-x-12 scale-90 z-0">
            <!-- Replace src with your actual image path -->
            <img src="https://via.placeholder.com/800x600/e2e8f0/94a3b8?text=Right+Image" alt="Next Event" class="w-full h-full object-cover" />
          </div>

          <!-- Center Active Image -->
          <div class="relative w-3/4 md:w-3/5 h-full bg-white rounded-xl shadow-2xl overflow-hidden z-10 border-4 border-white transition-transform duration-300 hover:scale-[1.02]">
            <!-- Replace src with your actual image path -->
            <img src="https://via.placeholder.com/800x600/ffffff/4c0f89?text=Main+Campaign+Image" alt="18-Day Campaign to End VAW" class="w-full h-full object-cover" />
          </div>

        </div>

        <!-- Carousel Navigation Controls -->
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
  </PublicLayout>
</template>
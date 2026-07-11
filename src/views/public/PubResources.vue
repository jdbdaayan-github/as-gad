<script setup>
import { ref, computed, onMounted } from 'vue';
import PublicLayout from '../../layouts/PublicLayout.vue';
import { db } from '../../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';
import Banner from '../../components/Banner.vue';

const resources = ref([]);
const isLoading = ref(true);

const fetchResources = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'resources'));
    resources.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch(error) {
    console.error("Error fetching resources:", error);
  } finally {
    isLoading.value = false;
  }
};

// Grouping by Category
const laws = computed(() => resources.value.filter(r => r.category === 'Laws'));
const agenda = computed(() => resources.value.filter(r => r.category === 'Agenda'));
const specialOrders = computed(() => resources.value.filter(r => r.category === 'Special Orders'));
const reports = computed(() => resources.value.filter(r => r.category === 'Reports'));

onMounted(() => {
  fetchResources();
});
</script>

<template>
  <PublicLayout>
    <Banner/>
    <div class="bg-white min-h-screen pb-24">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-32">
        <div class="flex flex-col items-center gap-3">
          <svg class="animate-spin h-10 w-10 text-[#1e3aa2]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path></svg>
          <span class="text-sm text-gray-500 font-medium tracking-widest uppercase">Loading Resources...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="resources.length === 0" class="max-w-4xl mx-auto px-4 sm:px-6 pt-24 text-center">
        <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center">
          <svg class="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No Resources Available</h3>
          <p class="text-sm text-slate-500 max-w-sm">We are currently updating our document library. Please check back later for uploaded laws, agendas, and reports.</p>
        </div>
      </div>

      <!-- Content Sections -->
      <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 pt-16 space-y-20">

        <!-- 1. GENDER AND DEVELOPMENT LAWS -->
        <section v-if="laws.length > 0">
          <div class="text-center mb-10">
            <h2 class="text-2xl md:text-4xl font-extrabold text-[#1e3aa2] uppercase tracking-wide mb-3">
              GENDER AND DEVELOPMENT<br/>LAWS
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Learn about key Philippine laws that promote gender equality, protect women and children, and ensure a safe and just society.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="item in laws" 
              :key="item.id" 
              class="border-2 border-[#b848c9] rounded-lg p-5 flex flex-col h-full bg-white hover:shadow-md transition-shadow"
            >
              <h3 class="text-[#b848c9] font-bold text-[15px] leading-tight mb-2">{{ item.title }}</h3>
              <p class="text-[12px] text-slate-700 mb-5 flex-1">{{ item.description }}</p>
              <a 
                :href="item.link" 
                target="_blank" 
                class="inline-block self-start bg-[#b848c9] hover:bg-[#9d36ac] text-white text-[11px] font-bold px-5 py-1.5 rounded transition-colors"
              >
                Read More
              </a>
            </div>
          </div>
        </section>

        <!-- 2. DSWD GAD Agenda -->
        <section v-if="agenda.length > 0">
          <div class="text-center mb-8">
            <h2 class="text-2xl md:text-3xl font-extrabold text-[#1e3aa2] uppercase tracking-wide">
              DSWD GAD Agenda
            </h2>
          </div>
          
          <div class="max-w-4xl mx-auto space-y-4">
            <div 
              v-for="item in agenda" 
              :key="item.id" 
              class="border-2 border-[#b848c9] rounded-lg p-5 bg-white hover:shadow-md transition-shadow"
            >
              <h3 class="text-[#b848c9] font-bold text-[15px] mb-2">{{ item.title }}</h3>
              <p class="text-[13px] text-slate-700 mb-4">{{ item.description }}</p>
              <a 
                :href="item.link" 
                target="_blank" 
                class="inline-block bg-[#b848c9] hover:bg-[#9d36ac] text-white text-[11px] font-bold px-5 py-1.5 rounded transition-colors"
              >
                Read More
              </a>
            </div>
          </div>
        </section>

        <!-- 3. SPECIAL ORDERS -->
        <section v-if="specialOrders.length > 0">
          <div class="text-center mb-8">
            <h2 class="text-2xl md:text-3xl font-extrabold text-[#1e3aa2] uppercase tracking-wide">
              SPECIAL ORDERS
            </h2>
          </div>
          
          <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="item in specialOrders" 
              :key="item.id" 
              class="border-2 border-[#b848c9] rounded-lg p-5 flex flex-col h-full bg-[#fcf9fd] hover:bg-white hover:shadow-md transition-all"
            >
              <h3 class="text-[#b848c9] font-bold text-[15px] leading-tight mb-2">{{ item.title }}</h3>
              <p class="text-[12px] text-slate-700 mb-5 flex-1">{{ item.description }}</p>
              <a 
                :href="item.link" 
                target="_blank" 
                class="inline-block self-start bg-[#b848c9] hover:bg-[#9d36ac] text-white text-[11px] font-bold px-5 py-1.5 rounded transition-colors"
              >
                Read More
              </a>
            </div>
          </div>
        </section>

        <!-- 4. ACCOMPLISHMENT REPORTS -->
        <section v-if="reports.length > 0">
          <div class="text-center mb-8">
            <h2 class="text-2xl md:text-3xl font-extrabold text-[#1e3aa2] uppercase tracking-wide">
              ACCOMPLISHMENT REPORTS
            </h2>
          </div>
          
          <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="item in reports" 
              :key="item.id" 
              class="border-2 border-[#d3b8d9] rounded-lg p-6 flex flex-col h-full bg-[#f6ebf9] hover:shadow-md transition-all"
            >
              <h3 class="text-[#a567b1] font-bold text-[16px] leading-tight mb-3">{{ item.title }}</h3>
              <p class="text-[11px] text-slate-600 mb-5 flex-1 leading-relaxed text-justify">{{ item.description }}</p>
              <a 
                :href="item.link" 
                target="_blank" 
                class="inline-block self-start bg-[#c28ccb] hover:bg-[#b06dbb] text-white text-[11px] font-bold px-6 py-2 rounded transition-colors"
              >
                Read More
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  </PublicLayout>
</template>
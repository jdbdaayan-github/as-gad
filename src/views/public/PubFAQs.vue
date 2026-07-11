<script setup>
import { ref, onMounted } from 'vue';
import PublicLayout from '../../layouts/PublicLayout.vue';
import { db } from '../../firebase/index.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Banner from '../../components/Banner.vue';

const faqs = ref([]);
const isLoading = ref(true);
const activeIndex = ref(null); 

// Fetch FAQs Ordered by createdAt (descending: newest first)
const fetchFAQs = async () => {
  try {
    // If you want OLDEST first instead of newest first, change 'desc' to 'asc'
    const q = query(collection(db, 'faqs'), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    faqs.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch(error) {
    console.error("Error fetching FAQs:", error);
  } finally {
    isLoading.value = false;
  }
};

const toggleAccordion = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

onMounted(() => {
  fetchFAQs();
});
</script>

<template>
  <PublicLayout>
    <Banner/>
    <div class="bg-slate-50 min-h-screen pb-24">
      
      <!-- Main Content Area -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-12 md:pt-16">
        
        <!-- Clean Title -->
        <div class="text-center mb-10">
          <h1 class="text-2xl md:text-4xl font-extrabold text-[#4c0f89] uppercase tracking-wide">
            Frequently Asked Questions
          </h1>
          <p class="text-slate-500 mt-2 text-sm md:text-base">
            Find answers to common questions about Gender and Development (GAD) and our services.
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="flex flex-col items-center gap-3">
            <svg class="animate-spin h-10 w-10 text-[#4c0f89]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path></svg>
            <span class="text-sm text-gray-500 font-medium tracking-widest uppercase">Loading FAQs...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="faqs.length === 0" class="text-center py-20">
          <div class="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center">
            <svg class="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="text-xl font-bold text-slate-900 mb-2">No FAQs Available Yet</h3>
            <p class="text-sm text-slate-500 max-w-sm">We are currently updating our knowledge base. Please check back soon.</p>
          </div>
        </div>

        <!-- FAQ Accordion List -->
        <div v-else class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="faq.id"
            class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200"
            :class="activeIndex === index ? 'ring-2 ring-purple-100' : 'hover:shadow-md'"
          >
            <!-- Accordion Header (Question) -->
            <button 
              @click="toggleAccordion(index)" 
              class="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
            >
              <span class="font-bold text-lg text-slate-800 pr-4" :class="activeIndex === index ? 'text-[#b848c9]' : ''">
                {{ faq.question }}
              </span>
              
              <!-- Toggle Icon -->
              <span class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300" :class="activeIndex === index ? 'bg-purple-100 text-[#b848c9] rotate-180' : 'bg-slate-100 text-slate-500'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            </button>

            <!-- Accordion Body (Answer) -->
            <div 
              v-show="activeIndex === index" 
              class="px-6 pb-6"
            >
              <div class="h-px w-full bg-slate-100 mb-4"></div>
              <p class="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </PublicLayout>
</template>
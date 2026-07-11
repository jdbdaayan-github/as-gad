<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Banner from '../../components/Banner.vue';
import PublicLayout from '../../layouts/PublicLayout.vue';

import { db } from '../../firebase/index.js';
import { collection, getDocs, query, orderBy, limit, getDoc, doc } from 'firebase/firestore';

// --- Tab State ---
const activeTab = ref('announcements'); // Options: 'announcements', 'calendar', 'hotlines'

// --- Data States ---
const divisionsData = ref([]);
const isLoading = ref(true);

const announcements = ref([]);
const isAnnouncementsLoading = ref(true);

const activities = ref([]);
const isActivitiesLoading = ref(true);

const directory = ref([]);
const isDirectoryLoading = ref(true);

const campaignTheme = ref(null);

// --- State for Documentations Carousel & AutoPlay ---
const documentations = ref([]);
const currentDocIndex = ref(0);
const carouselConfig = ref({ autoPlay: true, speed: 3 });
let autoplayInterval = null;

// --- State for Swipe Logic ---
const touchStartX = ref(0);
const touchEndX = ref(0);

// --- State for Announcement Modal ---
const showAnnouncementModal = ref(false);
const selectedAnnouncement = ref(null);

// --- Fetch Announcements ---
const fetchAnnouncements = async () => {
  try {
    const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const allAnnouncements = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));

    announcements.value = allAnnouncements
      .filter(item => item.status === 'Published')
      .slice(0, 3);
  } catch(error) {
    console.error("Firestore Error (Announcements):", error);
  } finally {
    isAnnouncementsLoading.value = false;
  }
};

// --- Fetch Activities ---
const fetchActivities = async () => {
  try {
    const q = query(collection(db, 'activities'), orderBy('date', 'desc'), limit(6));
    const snapshot = await getDocs(q);
    activities.value = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.error("Firestore Error (Activities):", error);
  } finally {
    isActivitiesLoading.value = false;
  }
};

// --- Fetch Disaggregated Data ---
const fetchDisaggregatedData = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'divisionsData'));
    divisionsData.value = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  } catch(error) {
    console.error("Firestore Error (Data):", error);
  } finally {
    isLoading.value = false;
  }
};

// --- Fetch Directory (Hotlines) ---
const fetchDirectory = async () => {
  try {
    const q = query(collection(db, 'directory'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    directory.value = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  } catch(error) {
    console.error("Firestore Error (Directory):", error);
  } finally {
    isDirectoryLoading.value = false;
  }
};

// --- Fetch Campaign Theme ---
const fetchCampaignTheme = async () => {
  try {
    const snap = await getDoc(doc(db, 'settings', 'campaignTheme'));
    if (snap.exists()) {
      campaignTheme.value = snap.data();
    }
  } catch(error) {
    console.error("Error fetching theme:", error);
  }
};

// --- Fetch Documentations & Carousel Config ---
const fetchDocumentationsAndConfig = async () => {
  try {
    const configSnap = await getDoc(doc(db, 'settings', 'carouselConfig'));
    if (configSnap.exists()) {
      carouselConfig.value = configSnap.data();
    }

    const q = query(collection(db, 'documentations'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    documentations.value = snapshot.docs.map(item => item.data());

    startAutoplay();
  } catch(error) {
    console.error("Error fetching docs & config:", error);
  }
};

// --- Computed Properties for Data ---
const maleData = computed(() => divisionsData.value.map(item => ({ division: item.name, count: Number(item.male) })));
const femaleData = computed(() => divisionsData.value.map(item => ({ division: item.name, count: Number(item.female) })));
const totalMale = computed(() => divisionsData.value.reduce((total,item)=> total + Number(item.male), 0));
const totalFemale = computed(() => divisionsData.value.reduce((total,item)=> total + Number(item.female), 0));

// --- Carousel Logic & Timers ---
const prevDocIndex = computed(() => {
  if (documentations.value.length === 0) return 0;
  return (currentDocIndex.value - 1 + documentations.value.length) % documentations.value.length;
});

const nextDocIndex = computed(() => {
  if (documentations.value.length === 0) return 0;
  return (currentDocIndex.value + 1) % documentations.value.length;
});

const nextSlide = () => { currentDocIndex.value = nextDocIndex.value; };
const prevSlide = () => { currentDocIndex.value = prevDocIndex.value; };

const startAutoplay = () => {
  if (autoplayInterval) clearInterval(autoplayInterval);
  if (carouselConfig.value.autoPlay && documentations.value.length > 1) {
    autoplayInterval = setInterval(nextSlide, carouselConfig.value.speed * 1000);
  }
};

const pauseAutoplay = () => {
  if (autoplayInterval) clearInterval(autoplayInterval);
};

// --- Swipe Logic Implementations ---
const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
  pauseAutoplay();
};

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
  startAutoplay();
};

const handleSwipe = () => {
  const threshold = 40; 
  if (touchStartX.value - touchEndX.value > threshold) {
    nextSlide();
  }
  if (touchEndX.value - touchStartX.value > threshold) {
    prevSlide();
  }
};

onUnmounted(() => {
  pauseAutoplay();
});

// --- Date Helpers ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
};

const getMonth = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
};

const getDay = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { day: '2-digit' });
};

// --- Modal Handlers ---
const openAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement;
  showAnnouncementModal.value = true;
  document.body.style.overflow = 'hidden'; 
};

const closeAnnouncementModal = () => {
  showAnnouncementModal.value = false;
  selectedAnnouncement.value = null;
  document.body.style.overflow = 'auto'; 
};

onMounted(() => {
  fetchAnnouncements();
  fetchActivities();
  fetchDisaggregatedData();
  fetchDocumentationsAndConfig();
  fetchCampaignTheme();
  fetchDirectory();
});
</script>

<template>
  <PublicLayout>
    <Banner/>

    <!-- Sex Disaggregated Data Section -->
    <section class="w-full py-16 bg-[#fafafa]">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl font-extrabold text-black uppercase tracking-wider">
            Administrative Service
          </h2>
          <h3 class="text-lg font-bold text-[#9b2cdd] uppercase tracking-wide mt-1">
            Sex Disaggregated Data
          </h3>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="flex flex-col items-center gap-3">
            <svg class="animate-spin h-8 w-8 text-[#4c0f89]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path></svg>
            <span class="text-sm text-gray-500">Loading sex-disaggregated data...</span>
          </div>
        </div>

        <div v-else class="flex flex-col md:flex-row justify-center items-start gap-8">
          <div class="bg-white rounded-xl shadow-lg shadow-gray-200/50 p-5 w-full md:w-[400px]">
            <div class="bg-[#3f51b5] rounded-md px-4 py-2.5 flex justify-between items-center mb-4">
              <span class="text-white font-bold tracking-widest text-sm uppercase">Male</span>
              <span class="bg-white text-[#3f51b5] font-bold px-3 py-0.5 rounded text-sm">{{ totalMale }}</span>
            </div>
            <div class="text-[13px] text-gray-800 mb-2 px-1">No. per Division</div>
            <ul class="flex flex-col">
              <li v-for="(item, index) in maleData" :key="'male-'+index" class="flex justify-between py-2.5 px-2 border-b border-gray-100 last:border-none text-[13px]">
                <span class="text-gray-700">{{ item.division }}</span>
                <span class="text-[#3f51b5] font-bold">{{ item.count }}</span>
              </li>
            </ul>
          </div>

          <div class="bg-white rounded-xl shadow-lg shadow-gray-200/50 p-5 w-full md:w-[400px]">
            <div class="bg-[#3f51b5] rounded-md px-4 py-2.5 flex justify-between items-center mb-4">
              <span class="text-white font-bold tracking-widest text-sm uppercase">Female</span>
              <span class="bg-white text-[#3f51b5] font-bold px-3 py-0.5 rounded text-sm">{{ totalFemale }}</span>
            </div>
            <div class="text-[13px] text-gray-800 mb-2 px-1">No. per Division</div>
            <ul class="flex flex-col">
              <li v-for="(item, index) in femaleData" :key="'female-'+index" class="flex justify-between py-2.5 px-2 border-b border-gray-100 last:border-none text-[13px]">
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

        <div v-if="documentations.length === 0" class="text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-xl">
          No documentations uploaded yet.
        </div>

        <div v-else>
          <div 
            @mouseenter="pauseAutoplay"
            @mouseleave="startAutoplay"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            class="relative w-full max-w-5xl mx-auto flex items-center justify-center h-[250px] sm:h-[350px] md:h-[450px] mb-8 select-none touch-pan-y"
          >
            <div 
              v-if="documentations.length >= 2"
              @click="prevSlide"
              class="absolute left-0 md:left-10 w-2/3 md:w-3/5 h-4/5 bg-gray-200 rounded-lg shadow-md overflow-hidden opacity-50 hover:opacity-80 cursor-pointer transform -translate-x-4 md:-translate-x-12 scale-90 z-0 transition-all duration-500 ease-in-out"
            >
              <img :src="documentations[prevDocIndex]?.imageUrl" class="w-full h-full object-cover pointer-events-none" />
            </div>

            <div 
              v-if="documentations.length >= 3"
              @click="nextSlide"
              class="absolute right-0 md:right-10 w-2/3 md:w-3/5 h-4/5 bg-gray-200 rounded-lg shadow-md overflow-hidden opacity-50 hover:opacity-80 cursor-pointer transform translate-x-4 md:translate-x-12 scale-90 z-0 transition-all duration-500 ease-in-out"
            >
              <img :src="documentations[nextDocIndex]?.imageUrl" class="w-full h-full object-cover pointer-events-none" />
            </div>

            <div class="relative w-3/4 md:w-3/5 h-full bg-white rounded-xl shadow-2xl overflow-hidden z-10 border-4 border-white transition-transform duration-500 ease-in-out flex flex-col group cursor-grab active:cursor-grabbing">
              <img :src="documentations[currentDocIndex]?.imageUrl" class="w-full h-full object-cover pointer-events-none" />
              <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p class="font-semibold text-sm md:text-base truncate">{{ documentations[currentDocIndex]?.title }}</p>
              </div>
            </div>
          </div>

          <div v-if="documentations.length > 1" class="flex justify-center items-center space-x-4 mt-6">
            <button @click="prevSlide" @mouseenter="pauseAutoplay" @mouseleave="startAutoplay" class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors duration-200 shadow-md">
              <svg class="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button @click="nextSlide" @mouseenter="pauseAutoplay" @mouseleave="startAutoplay" class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors duration-200 shadow-md">
              <svg class="w-5 h-5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- NEW GAD CAMPAIGN THEME SECTION -->
    <section v-if="campaignTheme" class="w-full py-16 bg-[#fafafa]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        
        <!-- Left: Text Content -->
        <div class="flex-1 space-y-6 text-center md:text-left">
          <h2 class="text-2xl md:text-[28px] font-bold text-[#6b21a8] uppercase tracking-wide">
            {{ campaignTheme.title }}
          </h2>
          
          <div class="text-slate-800 text-sm md:text-[15px] space-y-5 whitespace-pre-wrap leading-relaxed">
            {{ campaignTheme.description }}
          </div>
          
          <div class="pt-2" v-if="campaignTheme.buttonText && campaignTheme.buttonLink">
            <a 
              :href="campaignTheme.buttonLink" 
              target="_blank" 
              class="inline-block bg-black text-white px-8 py-2.5 rounded-full font-bold text-sm tracking-wide hover:bg-gray-800 transition-colors shadow-md"
            >
              {{ campaignTheme.buttonText }}
            </a>
          </div>
        </div>

        <!-- Right: Image Logo -->
        <div class="flex-1 w-full flex justify-center md:justify-end shrink-0">
          <img 
            v-if="campaignTheme.imageUrl"
            :src="campaignTheme.imageUrl" 
            alt="Campaign Theme Graphic" 
            class="max-w-full h-auto object-contain max-h-[350px] drop-shadow-sm"
          />
        </div>

      </div>
    </section>

    <!-- Tabbed Updates Section -->
    <section class="w-full py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        
        <!-- Tab Navigation Buttons -->
        <div class="flex flex-wrap justify-center items-stretch gap-4 mb-12">
          <button 
            @click="activeTab = 'announcements'"
            :class="activeTab === 'announcements' ? 'transform -rotate-1 shadow-md opacity-100 z-10 scale-105' : 'opacity-70 scale-95 hover:opacity-100 hover:scale-100'"
            class="bg-white border-2 border-[#6b21a8] text-[#6b21a8] px-8 py-2 rounded transition-all duration-300 flex flex-col items-center justify-center"
          >
            <span class="font-extrabold text-sm tracking-widest">ANNOUNCEMENTS</span>
            <span class="text-[10px] font-medium italic">What's the latest?</span>
          </button>

          <button 
            @click="activeTab = 'calendar'"
            :class="activeTab === 'calendar' ? 'transform -rotate-1 shadow-md opacity-100 z-10 scale-105' : 'opacity-70 scale-95 hover:opacity-100 hover:scale-100'"
            class="bg-[#581c87] text-white px-8 py-2 rounded transition-all duration-300 flex flex-col items-center justify-center"
          >
            <span class="font-bold text-sm tracking-widest">CALENDAR</span>
            <span class="text-xs font-medium tracking-widest">OF ACTIVITIES</span>
          </button>

          <button 
            @click="activeTab = 'hotlines'"
            :class="activeTab === 'hotlines' ? 'transform -rotate-1 shadow-md opacity-100 z-10 scale-105' : 'opacity-70 scale-95 hover:opacity-100 hover:scale-100'"
            class="bg-[#dc2626] text-white px-8 py-2 rounded transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span class="font-bold text-lg tracking-widest">HOTLINES</span>
            <div class="bg-white/20 p-1 rounded">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
          </button>
        </div>

        <transition name="fade-slide" mode="out-in">
          
          <!-- TAB 1: ANNOUNCEMENTS CONTENT -->
          <div v-if="activeTab === 'announcements'" key="announcements">
            <div v-if="isAnnouncementsLoading" class="flex justify-center items-center py-10">
              <svg class="animate-spin h-8 w-8 text-[#4c0f89]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path></svg>
            </div>

            <div v-else-if="announcements.length === 0" class="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
              No recent announcements available.
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="announcement in announcements" 
                :key="announcement.id"
                @click="openAnnouncement(announcement)"
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer group"
              >
                <div class="w-full h-32 md:h-40 bg-gray-100 relative overflow-hidden shrink-0 border-b border-gray-100">
                  <img 
                    :src="announcement.imageUrl || 'https://via.placeholder.com/800x300/4c0f89/ffffff?text=Announcement'" 
                    :alt="announcement.title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div class="p-4 flex flex-col flex-1">
                  <h4 class="text-[15px] font-bold text-[#581c87] mb-2 leading-tight line-clamp-2 uppercase group-hover:underline">
                    {{ announcement.title }}
                  </h4>
                  <p class="text-gray-600 text-xs line-clamp-2 flex-1 mb-3">
                    {{ announcement.content || announcement.description }}
                  </p>
                  <div class="text-[10px] text-gray-400 mt-auto pt-2 border-t border-gray-100">
                    {{ formatDate(announcement.date) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: CALENDAR OF ACTIVITIES -->
          <div v-else-if="activeTab === 'calendar'" key="calendar">
            <div v-if="isActivitiesLoading" class="flex justify-center items-center py-10">
              <svg class="animate-spin h-8 w-8 text-[#4c0f89]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path></svg>
            </div>
            
            <div v-else-if="activities.length === 0" class="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
              No upcoming activities scheduled.
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
              <div 
                v-for="activity in activities" 
                :key="activity.id"
                class="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div class="bg-[#4c0f89] text-white w-24 flex flex-col items-center justify-center p-3 shrink-0">
                  <span class="text-sm uppercase font-semibold tracking-widest opacity-90">{{ getMonth(activity.date) }}</span>
                  <span class="text-3xl font-extrabold leading-none mt-1">{{ getDay(activity.date) }}</span>
                </div>
                <div class="p-4 flex-1 flex flex-col justify-center">
                  <h4 class="font-bold text-gray-900 text-sm md:text-base leading-tight mb-1">{{ activity.title }}</h4>
                  <p class="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span class="truncate">{{ activity.location || 'Location TBA' }}</span>
                  </p>
                  <div class="mt-3">
                    <span 
                      class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                      :class="{
                        'bg-green-100 text-green-700': activity.status === 'Ongoing',
                        'bg-blue-100 text-blue-700': activity.status === 'Upcoming',
                        'bg-gray-100 text-gray-600': activity.status === 'Completed'
                      }"
                    >
                      {{ activity.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: HOTLINES CONTENT -->
          <div v-else-if="activeTab === 'hotlines'" key="hotlines">
            <div v-if="isDirectoryLoading" class="flex justify-center items-center py-10">
              <svg class="animate-spin h-8 w-8 text-[#4c0f89]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path></svg>
            </div>

            <!-- Fallback if database is empty -->
            <div v-else-if="directory.length === 0" class="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Emergency Hotlines</h3>
              <p class="text-gray-500 text-sm mb-6">If you are in immediate danger, please dial 911 or contact your local authorities.</p>
            </div>

            <!-- Hotline Grid Cards -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div 
                v-for="contact in directory" 
                :key="contact.id"
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <!-- Decorative Top Border -->
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-[#4c0f89] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div class="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 shrink-0 shadow-sm border border-red-100">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                
                <h4 class="font-bold text-slate-900 mb-1 leading-tight">{{ contact.name }}</h4>
                <p class="text-xl font-extrabold text-[#dc2626] mb-2 tracking-wide font-mono">{{ contact.number }}</p>
                <p v-if="contact.description" class="text-xs text-slate-500 line-clamp-3">{{ contact.description }}</p>
              </div>
            </div>
          </div>

        </transition>

      </div>
    </section>

    <!-- VUE TRANSITION FOR FULL DETAILS MODAL -->
    <transition name="modal-fade">
      <div v-if="showAnnouncementModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm" @click.self="closeAnnouncementModal">
        
        <div class="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative">
          
          <button @click="closeAnnouncementModal" class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md transition-colors shadow-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div class="w-full h-48 sm:h-64 bg-slate-100 shrink-0 relative">
            <img 
              :src="selectedAnnouncement?.imageUrl || 'https://via.placeholder.com/800x300/4c0f89/ffffff?text=Announcement'" 
              :alt="selectedAnnouncement?.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="p-6 sm:p-8 overflow-y-auto">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-4 border border-purple-100">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {{ formatDate(selectedAnnouncement?.date) }}
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 leading-tight uppercase">
              {{ selectedAnnouncement?.title }}
            </h2>
            <div class="prose prose-slate max-w-none">
              <p class="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm sm:text-base">{{ selectedAnnouncement?.content || selectedAnnouncement?.description }}</p>
            </div>
          </div>

        </div>
      </div>
    </transition>

  </PublicLayout>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.3s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.95);
}
</style>
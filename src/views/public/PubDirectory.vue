<script setup>
import { ref, computed, onMounted } from 'vue';
import PublicLayout from '../../layouts/PublicLayout.vue'; // Adjust the path if needed
import { db } from '../../firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';
import Banner from '../../components/Banner.vue';

const members = ref([]);
const isLoading = ref(true);

const fetchMembers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'twg_members'));
    let fetchedMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort members from oldest to newest upload based on a timestamp.
    // If no timestamp exists on older records, they default to 0 (placed at the beginning).
    fetchedMembers.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
      return timeA - timeB; // Ascending order (oldest first)
    });

    members.value = fetchedMembers;
  } catch(error) {
    console.error("Error fetching TWG members:", error);
  } finally {
    isLoading.value = false;
  }
};

// Group members by their category
const chairpersons = computed(() => members.value.filter(m => m.category === 'Chairperson'));
const viceChairpersons = computed(() => members.value.filter(m => m.category === 'Vice-Chairperson'));
const secretariats = computed(() => members.value.filter(m => m.category === 'Secretariat'));
const regularMembers = computed(() => members.value.filter(m => m.category === 'Member'));

onMounted(() => {
  fetchMembers();
});
</script>

<template>
  <PublicLayout>
    <Banner/>
    <div class="bg-slate-50 min-h-screen pb-20">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        
        <!-- Main Header Banner (Dark Blue to Gold Gradient) -->
        <div class="bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#854d0e] shadow-md mb-12">
          <h1 class="text-white text-center py-6 px-4 font-extrabold text-xl md:text-[22px] leading-snug uppercase">
            Administrative Service – Gender and Development<br/>
            Focal Point System Technical Working Group
          </h1>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="flex flex-col items-center gap-3">
            <svg class="animate-spin h-8 w-8 text-[#1e3a8a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3a8 8 0 00-8 8h4z"></path></svg>
            <span class="text-sm text-gray-500 font-medium">Loading Directory...</span>
          </div>
        </div>

        <!-- Directory Content -->
        <div v-else class="space-y-12">

          <!-- CHAIRPERSON SECTION -->
          <div v-if="chairpersons.length > 0">
            <h3 class="bg-[#f1f5f9] text-[#1e3a8a] font-bold text-center py-2.5 border-l-4 border-[#1e3a8a] text-sm tracking-widest uppercase mb-6 shadow-sm">
              Chairperson
            </h3>
            <div class="flex flex-wrap justify-center gap-6">
              <div v-for="person in chairpersons" :key="person.id" class="w-48 bg-white border border-gray-200 shadow-sm p-4 flex flex-col items-center text-center">
                <div class="w-28 h-28 mb-3 bg-gray-100 overflow-hidden shadow-sm">
                  <img :src="person.imageUrl || 'https://via.placeholder.com/150'" alt="Profile" class="w-full h-full object-cover" />
                </div>
                <h4 class="text-[13px] font-bold text-gray-900 leading-tight mb-1">{{ person.name }}</h4>
                <p class="text-[10px] text-gray-500 font-medium leading-tight mb-1">{{ person.position }}</p>
                <p v-if="person.role" class="text-[10px] text-[#1e3a8a] font-semibold leading-tight">{{ person.role }}</p>
              </div>
            </div>
          </div>

          <!-- VICE-CHAIRPERSON SECTION -->
          <div v-if="viceChairpersons.length > 0">
            <h3 class="bg-[#f1f5f9] text-[#1e3a8a] font-bold text-center py-2.5 border-l-4 border-[#1e3a8a] text-sm tracking-widest uppercase mb-6 shadow-sm">
              Vice-Chairperson
            </h3>
            <div class="flex flex-wrap justify-center gap-6">
              <div v-for="person in viceChairpersons" :key="person.id" class="w-48 bg-white border border-gray-200 shadow-sm p-4 flex flex-col items-center text-center">
                <div class="w-28 h-28 mb-3 bg-gray-100 overflow-hidden shadow-sm">
                  <img :src="person.imageUrl || 'https://via.placeholder.com/150'" alt="Profile" class="w-full h-full object-cover" />
                </div>
                <h4 class="text-[13px] font-bold text-gray-900 leading-tight mb-1">{{ person.name }}</h4>
                <p class="text-[10px] text-gray-500 font-medium leading-tight mb-1">{{ person.position }}</p>
                <p v-if="person.role" class="text-[10px] text-[#1e3a8a] font-semibold leading-tight">{{ person.role }}</p>
              </div>
            </div>
          </div>

          <!-- SECRETARIAT SECTION -->
          <div v-if="secretariats.length > 0">
            <h3 class="bg-[#f1f5f9] text-[#1e3a8a] font-bold text-center py-2.5 border-l-4 border-[#1e3a8a] text-sm tracking-widest uppercase mb-6 shadow-sm">
              Secretariat
            </h3>
            <div class="flex flex-wrap justify-center gap-6">
              <div v-for="person in secretariats" :key="person.id" class="w-48 bg-white border border-gray-200 shadow-sm p-4 flex flex-col items-center text-center">
                <div class="w-28 h-28 mb-3 bg-gray-100 overflow-hidden shadow-sm">
                  <img :src="person.imageUrl || 'https://via.placeholder.com/150'" alt="Profile" class="w-full h-full object-cover" />
                </div>
                <h4 class="text-[13px] font-bold text-gray-900 leading-tight mb-1">{{ person.name }}</h4>
                <p class="text-[10px] text-gray-500 font-medium leading-tight mb-1">{{ person.position }}</p>
                <p v-if="person.role" class="text-[10px] text-[#1e3a8a] font-semibold leading-tight">{{ person.role }}</p>
              </div>
            </div>
          </div>

          <!-- MEMBERS SECTION -->
          <div v-if="regularMembers.length > 0">
            <h3 class="bg-[#f1f5f9] text-[#1e3a8a] font-bold text-center py-2.5 border-l-4 border-[#1e3a8a] text-sm tracking-widest uppercase mb-6 shadow-sm">
              Members
            </h3>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
              <div v-for="person in regularMembers" :key="person.id" class="w-[165px] sm:w-48 bg-white border border-gray-200 shadow-sm p-4 flex flex-col items-center text-center">
                <div class="w-24 h-24 sm:w-28 sm:h-28 mb-3 bg-gray-100 overflow-hidden shadow-sm">
                  <img :src="person.imageUrl || 'https://via.placeholder.com/150'" alt="Profile" class="w-full h-full object-cover" />
                </div>
                <h4 class="text-[12px] sm:text-[13px] font-bold text-gray-900 leading-tight mb-1">{{ person.name }}</h4>
                <p class="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-tight mb-1">{{ person.position }}</p>
                <p v-if="person.role" class="text-[9px] sm:text-[10px] text-[#1e3a8a] font-semibold leading-tight">{{ person.role }}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
    
  </PublicLayout>
</template>
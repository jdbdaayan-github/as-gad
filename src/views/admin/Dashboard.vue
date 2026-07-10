<template>
  <AdminLayout>
    <!-- Override the default header title -->
    <template #header-title>
      Dashboard
    </template>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      <!-- Stat Card 1: Total Personnel (Data Disaggregation) -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div class="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Personnel</p>
          <div v-if="isLoading" class="h-8 w-16 bg-slate-200 animate-pulse rounded mt-1"></div>
          <p v-else class="text-2xl font-extrabold text-slate-900">{{ totalPersonnel }}</p>
        </div>
      </div>

      <!-- Stat Card 2: Total Activities -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div class="p-3 bg-purple-50 text-[#4c0f89] rounded-lg shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Activities</p>
          <div v-if="isLoading" class="h-8 w-16 bg-slate-200 animate-pulse rounded mt-1"></div>
          <p v-else class="text-2xl font-extrabold text-slate-900">{{ totalActivities }}</p>
        </div>
      </div>

      <!-- Stat Card 3: Active Banners -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div class="p-3 bg-green-50 text-green-600 rounded-lg shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Banners</p>
          <div v-if="isLoading" class="h-8 w-16 bg-slate-200 animate-pulse rounded mt-1"></div>
          <p v-else class="text-2xl font-extrabold text-slate-900">{{ activeBanners }}</p>
        </div>
      </div>

    </div>

    <!-- Recent Activity Table Area -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 class="font-bold text-lg text-slate-800">Recent Activities</h3>
        <router-link to="/admin/activities" class="text-sm font-semibold text-[#4c0f89] hover:underline">
          View All
        </router-link>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 flex justify-center">
        <svg class="animate-spin h-8 w-8 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>

      <!-- Empty State -->
      <div v-else-if="recentActivities.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        <p class="text-slate-500 text-sm">No recent activity to display.</p>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left text-slate-600">
          <thead class="text-xs text-slate-500 bg-white uppercase font-medium border-b border-slate-100">
            <tr>
              <th scope="col" class="px-6 py-4">Activity Title</th>
              <th scope="col" class="px-6 py-4">Location</th>
              <th scope="col" class="px-6 py-4">Date</th>
              <th scope="col" class="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-medium text-slate-900 truncate max-w-[250px]">
                {{ activity.title }}
              </td>
              <td class="px-6 py-4 truncate max-w-[200px]">
                {{ activity.location }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatDate(activity.date) }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm"
                  :class="{
                    'bg-blue-50 text-blue-700 border-blue-200': activity.status === 'Upcoming',
                    'bg-green-50 text-green-700 border-green-200': activity.status === 'Ongoing',
                    'bg-slate-100 text-slate-700 border-slate-200': activity.status === 'Completed'
                  }"
                >
                  {{ activity.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { db } from '../../firebase/index.js'; // Adjust path to your firebase config
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

// Reactive Data States
const isLoading = ref(true);
const totalPersonnel = ref(0);
const totalActivities = ref(0);
const activeBanners = ref(0);
const recentActivities = ref([]);

// Date formatter helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
};

// Fetch Dashboard Metrics
const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    // 1. Fetch Total Personnel (Sum of male + female from divisionsData)
    const divisionsSnap = await getDocs(collection(db, 'divisionsData'));
    let personnelCount = 0;
    divisionsSnap.forEach((doc) => {
      const data = doc.data();
      personnelCount += (Number(data.male) || 0) + (Number(data.female) || 0);
    });
    totalPersonnel.value = personnelCount;

    // 2. Fetch Active Banners
    const bannersQuery = query(collection(db, 'banners'), where('isActive', '==', true));
    const bannersSnap = await getDocs(bannersQuery);
    activeBanners.value = bannersSnap.size; // .size gets the number of documents in the snapshot

    // 3. Fetch Activities (Total count + latest 5 for the table)
    const activitiesQuery = query(collection(db, 'activities'), orderBy('date', 'desc'));
    const activitiesSnap = await getDocs(activitiesQuery);
    
    totalActivities.value = activitiesSnap.size;
    
    // Extract only the first 5 for the recent activities table
    recentActivities.value = activitiesSnap.docs.slice(0, 5).map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
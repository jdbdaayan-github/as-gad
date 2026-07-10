<template>
  <AdminLayout>
    <template #header-title>Banner Management</template>

    <div class="w-full space-y-6">
      
      <!-- Page Header & Global Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Banners
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Manage the hero banners displayed on the public landing page.
          </p>
        </div>
        
        <button 
          @click="showAddForm = !showAddForm"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm"
        >
          <svg v-if="!showAddForm" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          {{ showAddForm ? 'Cancel' : 'Add New Banner' }}
        </button>
      </div>

      <!-- Add New Banner Form (Conditionally Displayed) -->
      <div v-if="showAddForm" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Upload New Banner</h2>
        <form @submit.prevent="saveNewBanner" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left: Info -->
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none text-slate-900">Banner Title</label>
                <input type="text" placeholder="e.g., 2026 Women's Month" class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none text-slate-900">Redirect Link (Optional)</label>
                <input type="url" placeholder="https://..." class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" />
              </div>
              <div class="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950" checked />
                <label for="isActive" class="text-sm font-medium text-slate-900">Set as Active immediately</label>
              </div>
            </div>
            
            <!-- Right: Image Upload -->
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-slate-900">Image File</label>
              <div class="w-full h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                <svg class="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span class="text-sm font-medium text-slate-600">Click to upload</span>
                <span class="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max. 5MB)</span>
                <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
              </div>
            </div>
          </div>
          <div class="pt-4 border-t border-slate-100 mt-6 flex justify-end">
            <button type="submit" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm">
              Save Banner
            </button>
          </div>
        </form>
      </div>

      <!-- Banners Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Banner Card Loop -->
        <div 
          v-for="banner in banners" 
          :key="banner.id" 
          class="group rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col"
        >
          <!-- Image Preview -->
          <div class="w-full aspect-[21/9] bg-slate-100 relative overflow-hidden">
            <img 
              :src="banner.imageUrl" 
              :alt="banner.title" 
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span v-if="banner.isActive" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm backdrop-blur-sm bg-white/90">
                <span class="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></span>
                Active
              </span>
              <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-sm backdrop-blur-sm bg-white/90">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                Inactive
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-semibold text-slate-900 truncate" :title="banner.title">
                {{ banner.title }}
              </h3>
              <p class="text-xs text-slate-500 mt-1 truncate">
                {{ banner.link || 'No link provided' }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <!-- Toggle Active Status Button -->
              <button 
                @click="toggleStatus(banner.id)"
                class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 px-3 text-slate-600 mr-auto"
              >
                {{ banner.isActive ? 'Deactivate' : 'Activate' }}
              </button>

              <button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 h-8 w-8 text-slate-500" title="Delete">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';

// State to toggle the "Add New Banner" form
const showAddForm = ref(false);

// Mock data for banners
const banners = ref([
  {
    id: 1,
    title: '2026 National Women\'s Month',
    imageUrl: 'https://via.placeholder.com/800x400/4c0f89/ffffff?text=Womens+Month+Banner',
    link: 'https://pcw.gov.ph/womens-month',
    isActive: true,
  },
  {
    id: 2,
    title: '18-Day Campaign to End VAW',
    imageUrl: 'https://via.placeholder.com/800x400/e78119/ffffff?text=End+VAW+Campaign',
    link: 'https://pcw.gov.ph/end-vaw',
    isActive: false,
  },
  {
    id: 3,
    title: 'Safe Spaces Act Awareness',
    imageUrl: 'https://via.placeholder.com/800x400/0f172a/ffffff?text=Safe+Spaces+Act',
    link: '',
    isActive: true,
  }
]);

// Handlers
const saveNewBanner = () => {
  console.log('Saving new banner...');
  // Logic to save to Firebase goes here
  showAddForm.value = false;
};

const toggleStatus = (id) => {
  const banner = banners.value.find(b => b.id === id);
  if (banner) {
    banner.isActive = !banner.isActive;
    // Logic to update Firebase goes here
  }
};
</script>
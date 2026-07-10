<template>
  <AdminLayout>
    <template #header-title>Campaign Theme</template>

    <!-- Removed max-w-4xl to allow it to occupy the layout space -->
    <div class="w-full space-y-6">
      
      <!-- Page Header & Global Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Campaign Theme
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Manage and update the central theme, branding, and links for the GAD portal.
          </p>
        </div>
        
        <!-- Moved Save button to the top for easier access in a full layout -->
        <button 
          @click="saveChanges"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          Save Changes
        </button>
      </div>

      <!-- 2-Column Grid Layout -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        <!-- Left Column: Main Form Area (Takes up 2/3 space) -->
        <div class="xl:col-span-2 space-y-6">
          <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            
            <div class="px-6 py-4 border-b border-slate-100">
              <h2 class="text-base font-semibold text-slate-900">Theme Details</h2>
            </div>

            <div class="p-6 space-y-6">
              <!-- Title Input -->
              <div class="space-y-2">
                <label for="title" class="text-sm font-medium leading-none text-slate-900">
                  Campaign Title
                </label>
                <input 
                  type="text" 
                  id="title" 
                  v-model="form.title"
                  class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 transition-colors"
                />
              </div>

              <!-- Description Textarea -->
              <div class="space-y-2">
                <label for="description" class="text-sm font-medium leading-none text-slate-900">
                  Description
                </label>
                <textarea 
                  id="description" 
                  v-model="form.description"
                  rows="10"
                  class="flex w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 transition-colors resize-y leading-relaxed"
                ></textarea>
              </div>

              <!-- Button Link Input -->
              <div class="space-y-2 pt-2">
                <label for="buttonLink" class="text-sm font-medium leading-none text-slate-900">
                  Redirect Link (Call to Action)
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-3 py-2 shrink-0">URL</span>
                  <input 
                    type="url" 
                    id="buttonLink" 
                    v-model="form.buttonLink"
                    class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Image & Media (Takes up 1/3 space) -->
        <div class="xl:col-span-1 space-y-6">
          <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            
            <div class="px-6 py-4 border-b border-slate-100">
              <h2 class="text-base font-semibold text-slate-900">Media</h2>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Current Image Display -->
              <div class="space-y-3">
                <span class="text-sm font-medium text-slate-900">Current Branding Image</span>
                <div class="w-full aspect-video border-2 border-dashed border-slate-200 bg-slate-50 p-4 rounded-lg flex items-center justify-center overflow-hidden relative group">
                  <img 
                    src="https://via.placeholder.com/300x200/ffffff/0f172a?text=WE+for+Gender+Equality+Logo" 
                    alt="Current Theme Logo" 
                    class="max-w-full max-h-full object-contain rounded-sm transition-opacity group-hover:opacity-50" 
                  />
                  <!-- Hover Overlay for Upload -->
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span class="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                      Click below to change
                    </span>
                  </div>
                </div>
              </div>

              <!-- Theme Image Upload -->
              <div class="space-y-2 pt-2">
                <label class="text-sm font-medium leading-none text-slate-900">
                  Upload New Image
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  class="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 file:border-0 file:bg-transparent file:text-sm file:font-medium hover:file:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 cursor-pointer transition-colors"
                />
                <p class="text-xs text-slate-500 mt-2">
                  Recommended size: 800x600px. Max size: 2MB.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue'; // Adjust path if necessary

const form = ref({
  title: 'GAD CAMPAIGN THEME',
  description: 'Gender equality is the cornerstone of the Gender and Development advocacy, representing the essential goal of advancing women\'s rights while fostering inclusive opportunities for all. Despite decades of progress, current global and national data show that achieving full gender parity remains a distant target, requiring concerted and urgent action from all sectors of society.\n\nThe concept of WE—Women and Everyone underscores that achieving gender equality is a shared responsibility. It is not solely the duty of women, but requires the engagement of individuals, institutions, public and private sectors, and community leaders at every level. WE also embody Women\'s Empowerment, which can only be realized when collective efforts ensure women have equal access to rights, resources, and opportunities, while women actively participate in shaping their own futures.',
  buttonLink: 'https://pcw.gov.ph/'
});

const saveChanges = () => {
  console.log('Saving changes...', form.value);
  // Add your update logic here (e.g., Firebase Firestore update)
};
</script>
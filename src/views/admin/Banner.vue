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
          @click="toggleForm"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm"
        >
          <svg v-if="!showForm" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          {{ showForm ? 'Cancel' : 'Add New Banner' }}
        </button>
      </div>

      <!-- Add/Edit Banner Form (Conditionally Displayed) -->
      <div v-if="showForm" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">
          {{ isEditing ? 'Edit Banner' : 'Upload New Banner' }}
        </h2>
        <form @submit.prevent="saveBanner" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left: Info -->
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none text-slate-900">Banner Title</label>
                <input 
                  type="text" 
                  v-model="form.title"
                  placeholder="e.g., 2026 Women's Month" 
                  class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:opacity-50" 
                  required
                  :disabled="isSaving"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none text-slate-900">Redirect Link (Optional)</label>
                <input 
                  type="url" 
                  v-model="form.link"
                  placeholder="https://..." 
                  class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:opacity-50" 
                  :disabled="isSaving"
                />
              </div>
              <div class="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  v-model="form.isActive"
                  class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950 disabled:opacity-50" 
                  :disabled="isSaving"
                />
                <label for="isActive" class="text-sm font-medium text-slate-900 cursor-pointer">
                  Set as Active immediately
                </label>
              </div>
            </div>
            
            <!-- Right: Image Upload -->
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-slate-900">Image File (16:9 or 21:9 Recommended)</label>
              <div class="w-full h-40 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
                <!-- Preview Image -->
                <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover" />
                
                <!-- Upload Prompt (Hidden if image exists, but still clickable via absolute input) -->
                <div v-if="!imagePreview" class="flex flex-col items-center pointer-events-none">
                  <svg class="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span class="text-sm font-medium text-slate-600">Click to upload</span>
                  <span class="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max. 5MB)</span>
                </div>
                
                <!-- Change Image overlay (Shows when hover over an existing image) -->
                <div v-if="imagePreview" class="absolute inset-0 bg-slate-900/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span class="text-white text-sm font-medium">Click to change image</span>
                </div>

                <input 
                  type="file" 
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*" 
                  @change="handleFileChange"
                  :disabled="isSaving"
                />
              </div>
            </div>
          </div>
          <div class="pt-4 border-t border-slate-100 mt-6 flex justify-end">
            <button 
              type="submit" 
              :disabled="isSaving || (!selectedFile && !form.imageUrl)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm disabled:opacity-70"
            >
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Save Banner') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>

      <!-- Empty State -->
      <div v-else-if="banners.length === 0" class="text-center py-12 bg-white rounded-xl border border-slate-200">
        <p class="text-slate-500">No banners uploaded yet. Click "Add New Banner" to get started.</p>
      </div>

      <!-- Banners Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
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
              <p class="text-xs text-blue-600 mt-1 truncate hover:underline cursor-pointer">
                <a v-if="banner.link" :href="banner.link" target="_blank">{{ banner.link }}</a>
                <span v-else class="text-slate-400 cursor-default">No link provided</span>
              </p>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <!-- Toggle Active Status Button -->
              <button 
                @click="toggleStatus(banner)"
                class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 px-3 text-slate-600 mr-auto"
              >
                {{ banner.isActive ? 'Deactivate' : 'Activate' }}
              </button>

              <button @click="openEditForm(banner)" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button @click="openDeleteModal(banner)" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 h-8 w-8 text-slate-500" title="Delete">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-lg border p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold text-slate-900">Delete Banner</h2>
        <p class="text-sm text-slate-500 mt-2">Are you sure you want to permanently remove the "{{ bannerToDelete?.title }}" banner?</p>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="closeDeleteModal" :disabled="isDeleting" class="h-10 px-4 py-2 border rounded-md text-sm transition-colors hover:bg-slate-50">Cancel</button>
          <button @click="confirmDelete" :disabled="isDeleting" class="h-10 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { db } from '../../firebase'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// --- CLOUDINARY CONFIGURATION CREDENTIALS ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// UI State
const showForm = ref(false);
const isEditing = ref(false);
const showDeleteModal = ref(false);
const bannerToDelete = ref(null);

const isLoading = ref(true);
const isSaving = ref(false);
const isDeleting = ref(false);

const selectedFile = ref(null);
const imagePreview = ref('');

const banners = ref([]);

// Form State
const form = ref({
  id: null,
  title: '',
  link: '',
  isActive: true,
  imageUrl: '',
  createdAt: null
});

// Fetch Banners from Firestore
const fetchBanners = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    banners.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchBanners());

// Form & File Handlers
const toggleForm = () => {
  if (showForm.value) {
    showForm.value = false;
  } else {
    resetForm();
    showForm.value = true;
  }
};

const resetForm = () => {
  isEditing.value = false;
  selectedFile.value = null;
  imagePreview.value = '';
  form.value = { id: null, title: '', link: '', isActive: true, imageUrl: '', createdAt: new Date().toISOString() };
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  selectedFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

// Cloudinary Upload
const uploadToCloudinary = async () => {
  if (!selectedFile.value) return form.value.imageUrl;

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) throw new Error('Cloudinary Upload Failed');

  const data = await response.json();
  return data.secure_url;
};

// Save (Create/Update)
const saveBanner = async () => {
  isSaving.value = true;
  try {
    const finalImageUrl = await uploadToCloudinary();
    form.value.imageUrl = finalImageUrl;

    if (isEditing.value) {
      const docRef = doc(db, 'banners', form.value.id);
      const { id, ...dataToUpdate } = form.value;
      await updateDoc(docRef, dataToUpdate);
      
      const index = banners.value.findIndex(b => b.id === form.value.id);
      if (index !== -1) banners.value[index] = { ...form.value };
    } else {
      const { id, ...dataToAdd } = form.value;
      dataToAdd.createdAt = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'banners'), dataToAdd);
      banners.value.unshift({ ...dataToAdd, id: docRef.id });
    }
    
    showForm.value = false;
    resetForm();
  } catch (error) {
    console.error(error);
    alert('Failed to save banner.');
  } finally {
    isSaving.value = false;
  }
};

// Edit
const openEditForm = (banner) => {
  isEditing.value = true;
  selectedFile.value = null;
  form.value = { ...banner };
  imagePreview.value = banner.imageUrl || '';
  showForm.value = true;
  
  // Scroll to top of window to see the form
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Instantly toggle active status in DB
const toggleStatus = async (banner) => {
  const previousStatus = banner.isActive;
  banner.isActive = !banner.isActive; // Optimistic UI update

  try {
    const docRef = doc(db, 'banners', banner.id);
    await updateDoc(docRef, { isActive: banner.isActive });
  } catch (error) {
    console.error("Failed to update status", error);
    banner.isActive = previousStatus; // Revert on failure
    alert("Could not update banner status.");
  }
};

// Delete
const openDeleteModal = (banner) => { 
  bannerToDelete.value = banner; 
  showDeleteModal.value = true; 
};

const closeDeleteModal = () => { 
  bannerToDelete.value = null; 
  showDeleteModal.value = false; 
};

const confirmDelete = async () => {
  if (!bannerToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, 'banners', bannerToDelete.value.id));
    banners.value = banners.value.filter(b => b.id !== bannerToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error(error);
    alert("Could not delete banner.");
  } finally {
    isDeleting.value = false;
  }
};
</script>
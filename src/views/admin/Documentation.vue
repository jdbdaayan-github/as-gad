<template>
  <AdminLayout>
    <template #header-title>GAD Documentations</template>

    <div class="w-full space-y-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Documentations Gallery</h1>
          <p class="text-sm text-slate-500 mt-1">Upload and manage photos for the public GAD Documentations carousel.</p>
        </div>
        
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          Upload Photo
        </button>
      </div>

      <!-- Carousel Configuration Panel -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 class="font-semibold text-slate-900">Carousel Animation Settings</h3>
          <p class="text-xs text-slate-500">Configure how the public 3D carousel behaves.</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="carouselConfig.autoPlay" class="w-4 h-4 text-[#4c0f89] rounded border-slate-300 focus:ring-[#4c0f89]">
            <span class="text-sm font-medium text-slate-700">Enable Auto-Play</span>
          </label>
          
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-700">Speed (Seconds):</span>
            <input 
              type="number" 
              v-model.number="carouselConfig.speed" 
              min="1" 
              max="15" 
              class="w-16 h-8 rounded-md border border-slate-200 text-center text-sm focus-visible:ring-1 focus-visible:ring-slate-950"
            >
          </div>

          <button 
            @click="saveCarouselConfig"
            :disabled="isSavingConfig"
            class="px-4 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors border border-slate-200 flex items-center gap-2"
          >
            <svg v-if="isSavingConfig" class="animate-spin h-3 w-3 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSavingConfig ? 'Saving...' : 'Save Config' }}
          </button>
        </div>
      </div>

      <!-- Gallery Grid -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>

      <div v-else-if="documentations.length === 0" class="text-center py-12 bg-white rounded-xl border border-slate-200">
        <p class="text-slate-500">No photos uploaded yet. Click "Upload Photo" to add one to the gallery.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="doc in documentations" 
          :key="doc.id"
          class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group"
        >
          <div class="w-full h-48 bg-slate-100 relative">
            <img :src="doc.imageUrl" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <button 
              @click="confirmDelete(doc)"
              class="absolute top-2 right-2 bg-red-600/90 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-sm"
              title="Delete Photo"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
          <div class="p-3">
            <h3 class="font-medium text-sm text-slate-900 truncate">{{ doc.title }}</h3>
            <p class="text-xs text-slate-500 mt-0.5">{{ formatDate(doc.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-lg border p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Upload Gallery Photo</h2>
        
        <form @submit.prevent="saveDocumentation" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Photo Event / Title</label>
            <input type="text" v-model="form.title" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" required :disabled="isSaving" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Image File</label>
            <input type="file" accept="image/*" @change="handleFileChange" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white" required :disabled="isSaving" />
            <div v-if="imagePreview" class="mt-3 w-full h-40 bg-slate-50 rounded-lg overflow-hidden border">
              <img :src="imagePreview" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
            <button type="button" @click="closeFormModal" :disabled="isSaving" class="px-4 py-2 text-sm border rounded-md hover:bg-slate-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="px-6 py-2 text-sm bg-slate-900 text-white rounded-md hover:bg-slate-800 flex items-center">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Uploading...' : 'Upload' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { db } from '../../firebase/index.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, getDoc, setDoc } from 'firebase/firestore';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Config State
const carouselConfig = ref({ autoPlay: true, speed: 3 });
const isSavingConfig = ref(false);

const documentations = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showFormModal = ref(false);

const selectedFile = ref(null);
const imagePreview = ref('');
const form = ref({ title: '' });

// Fetch Carousel Settings
const fetchCarouselConfig = async () => {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'carouselConfig'));
    if (docSnap.exists()) {
      carouselConfig.value = docSnap.data();
    }
  } catch (error) {
    console.error("Error fetching config:", error);
  }
};

// Save Carousel Settings
const saveCarouselConfig = async () => {
  isSavingConfig.value = true;
  try {
    await setDoc(doc(db, 'settings', 'carouselConfig'), carouselConfig.value);
  } catch (error) {
    console.error("Error saving config:", error);
    alert('Failed to save settings.');
  } finally {
    isSavingConfig.value = false;
  }
};

const fetchDocumentations = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'documentations'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    documentations.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDocumentations();
  fetchCarouselConfig();
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const openCreateModal = () => {
  form.value = { title: '' };
  selectedFile.value = null;
  imagePreview.value = '';
  showFormModal.value = true;
};

const closeFormModal = () => showFormModal.value = false;

const uploadToCloudinary = async () => {
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
  const data = await response.json();
  return data.secure_url;
};

const saveDocumentation = async () => {
  isSaving.value = true;
  try {
    const imageUrl = await uploadToCloudinary();
    const payload = {
      title: form.value.title,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'documentations'), payload);
    documentations.value.unshift({ id: docRef.id, ...payload });
    closeFormModal();
  } catch (error) {
    console.error(error);
    alert('Upload failed.');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (item) => {
  if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
  try {
    await deleteDoc(doc(db, 'documentations', item.id));
    documentations.value = documentations.value.filter(d => d.id !== item.id);
  } catch (error) {
    console.error(error);
  }
};

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
</script>
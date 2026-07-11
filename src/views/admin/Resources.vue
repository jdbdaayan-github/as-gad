<template>
  <AdminLayout>
    <template #header-title>Resources Management</template>

    <div class="w-full space-y-6">
      
      <!-- Page Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Resources & Documents
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Manage Laws, GAD Agenda, Special Orders, and Accomplishment Reports via Links or PDF Uploads.
          </p>
        </div>
        
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          Add Resource
        </button>
      </div>

      <!-- Data Table -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden z-10 relative">
        <div class="w-full overflow-auto">
          <table class="w-full text-sm text-left text-slate-600">
            <thead class="text-xs text-slate-500 bg-slate-50/80 uppercase font-medium border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-4">Title</th>
                <th scope="col" class="px-6 py-4">Category</th>
                <th scope="col" class="px-6 py-4 w-1/3">Description</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              
              <tr v-if="isLoading">
                <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading resources...
                  </div>
                </td>
              </tr>

              <tr 
                v-for="item in resources" 
                :key="item.id"
                class="hover:bg-slate-50/50 transition-colors group"
                v-else-if="resources.length > 0"
              >
                <td class="px-6 py-4 font-medium text-slate-900">
                  <div class="line-clamp-2">{{ item.title }}</div>
                  <a v-if="item.link" :href="item.link" target="_blank" class="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1">
                    <svg v-if="item.sourceType === 'pdf'" class="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8l-6-6H6zm4 1.5L14.5 8H10V3.5zM7 12a1 1 0 011-1h1.5a1 1 0 110 2H8v1.5a1 1 0 11-2 0V12zm4 0a1 1 0 011-1h1.5a1 1 0 110 2H12v2a1 1 0 11-2 0v-3z"/></svg>
                    <svg v-else class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    View Document
                  </a>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border"
                    :class="{
                      'bg-purple-50 text-purple-700 border-purple-200': item.category === 'Laws',
                      'bg-blue-50 text-blue-700 border-blue-200': item.category === 'Agenda',
                      'bg-emerald-50 text-emerald-700 border-emerald-200': item.category === 'Special Orders',
                      'bg-slate-100 text-slate-700 border-slate-200': item.category === 'Reports'
                    }"
                  >
                    {{ item.category }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">
                  <div class="line-clamp-2">{{ item.description }}</div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button @click="openEditModal(item)" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button @click="openDeleteModal(item)" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 h-8 w-8 text-slate-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr v-else>
                <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                  No resources found. Click "Add Resource" to create one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">{{ isEditing ? 'Edit Resource' : 'Add New Resource' }}</h2>
          <button @click="closeFormModal" :disabled="isSaving" class="text-slate-400 hover:text-slate-600 focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveResource" class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Title</label>
            <input type="text" v-model="form.title" placeholder="e.g. Safe Spaces Act" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50" required :disabled="isSaving" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Category</label>
            <select v-model="form.category" class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-50" required :disabled="isSaving">
              <option value="Laws">Gender and Development Laws</option>
              <option value="Agenda">DSWD GAD Agenda</option>
              <option value="Special Orders">Special Orders</option>
              <option value="Reports">Accomplishment Reports</option>
            </select>
          </div>

          <!-- Document Source Toggle -->
          <div class="space-y-2 pt-2 border-t border-slate-100">
            <label class="text-sm font-medium text-slate-900">Document Source</label>
            <div class="flex gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.sourceType" value="url" class="text-[#1e3aa2] focus:ring-[#1e3aa2]" :disabled="isSaving" />
                <span class="text-sm text-slate-700">External URL Link</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.sourceType" value="pdf" class="text-[#1e3aa2] focus:ring-[#1e3aa2]" :disabled="isSaving" />
                <span class="text-sm text-slate-700">Upload PDF File</span>
              </label>
            </div>
          </div>

          <!-- URL Input -->
          <div v-if="form.sourceType === 'url'" class="space-y-2">
            <input type="url" v-model="form.link" placeholder="https://..." class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50" :required="form.sourceType === 'url'" :disabled="isSaving" />
          </div>

          <!-- PDF Upload Input -->
          <div v-if="form.sourceType === 'pdf'" class="space-y-2">
            <input type="file" accept="application/pdf" @change="handleFileChange" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer disabled:opacity-50" :required="form.sourceType === 'pdf' && !form.link" :disabled="isSaving" />
            <p v-if="form.link && isEditing" class="text-xs text-slate-500 mt-1">
              Current File: <a :href="form.link" target="_blank" class="text-blue-500 hover:underline">View Uploaded PDF</a>
              (Upload a new file to replace)
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Description</label>
            <textarea v-model="form.description" rows="4" placeholder="Brief summary of the document..." class="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50 resize-y" required :disabled="isSaving"></textarea>
          </div>

          <div class="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" @click="closeFormModal" :disabled="isSaving" class="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-10 px-4 py-2 border border-slate-200 text-slate-700 disabled:opacity-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm disabled:opacity-75">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Saving...' : 'Save Resource' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <h2 class="text-lg font-semibold text-slate-900 mb-2">Delete Resource</h2>
        <p class="text-sm text-slate-500 mb-4">Are you sure you want to remove "{{ itemToDelete?.title }}"? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeDeleteModal" :disabled="isDeleting" class="px-4 py-2 text-sm border rounded-md hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button @click="confirmDelete" :disabled="isDeleting" class="px-6 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center disabled:opacity-75">
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Delete
          </button>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { db } from '../../firebase/index.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const itemToDelete = ref(null);

const isLoading = ref(true);
const isSaving = ref(false);
const isDeleting = ref(false);

const selectedFile = ref(null);
const resources = ref([]);

const form = ref({ id: null, title: '', category: 'Laws', link: '', description: '', sourceType: 'url' });

// Fetch Resources
const fetchResources = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'resources'), orderBy('title', 'asc'));
    const snapshot = await getDocs(q);
    resources.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching resources:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchResources());

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile.value = file;
};

const resetForm = () => { 
  form.value = { id: null, title: '', category: 'Laws', link: '', description: '', sourceType: 'url' }; 
  selectedFile.value = null;
};

const openCreateModal = () => { isEditing.value = false; resetForm(); showFormModal.value = true; };

const openEditModal = (item) => { 
  isEditing.value = true; 
  // Map old documents that don't have a sourceType
  const type = item.sourceType || (item.link.includes('cloudinary') ? 'pdf' : 'url');
  form.value = { ...item, sourceType: type }; 
  selectedFile.value = null;
  showFormModal.value = true; 
};

const closeFormModal = () => showFormModal.value = false;

// PDF Cloudinary Upload using "auto" to handle raw documents
const uploadDocumentToCloudinary = async () => {
  if (!selectedFile.value) return form.value.link;

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  return data.secure_url;
};

const saveResource = async () => {
  isSaving.value = true;
  try {
    // If the user selected PDF upload and provided a file, upload it.
    if (form.value.sourceType === 'pdf' && selectedFile.value) {
      form.value.link = await uploadDocumentToCloudinary();
    }

    if (isEditing.value) {
      const docRef = doc(db, 'resources', form.value.id);
      const { id, ...data } = form.value;
      await updateDoc(docRef, data);
      const index = resources.value.findIndex(r => r.id === id);
      if (index !== -1) resources.value[index] = { ...form.value };
    } else {
      const { id, ...data } = form.value;
      const docRef = await addDoc(collection(db, 'resources'), data);
      resources.value.push({ ...data, id: docRef.id });
    }
    closeFormModal();
  } catch (error) {
    console.error("Error saving resource:", error);
  } finally {
    isSaving.value = false;
  }
};

const openDeleteModal = (item) => { itemToDelete.value = item; showDeleteModal.value = true; };
const closeDeleteModal = () => { showDeleteModal.value = false; itemToDelete.value = null; };

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, 'resources', itemToDelete.value.id));
    resources.value = resources.value.filter(r => r.id !== itemToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting resource:", error);
  } finally {
    isDeleting.value = false;
  }
};
</script>
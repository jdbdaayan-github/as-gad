<template>
  <AdminLayout>
    <template #header-title>Announcements</template>

    <div class="w-full space-y-6">
      
      <!-- Page Header & Global Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Announcements
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Create and manage public announcements, news, and updates for the hub.
          </p>
        </div>
        
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          New Announcement
        </button>
      </div>

      <!-- Main Data Table Area -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden z-10 relative">
        
        <!-- Table Toolbar -->
        <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
          <div class="relative w-full sm:max-w-sm">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search announcements..." 
              class="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 pl-9 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950" 
            />
          </div>
          
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <select v-model="statusFilter" class="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 w-full sm:w-auto">
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <!-- The Table -->
        <div class="w-full overflow-auto">
          <table class="w-full text-sm text-left text-slate-600">
            <thead class="text-xs text-slate-500 bg-slate-50/80 uppercase font-medium border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-4 w-16">Cover</th>
                <th scope="col" class="px-6 py-4 w-2/5">Announcement</th>
                <th scope="col" class="px-6 py-4 text-left">Status</th>
                <th scope="col" class="px-6 py-4 text-left">Date Posted</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              
              <tr v-if="isLoading">
                <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading announcements records...
                  </div>
                </td>
              </tr>

              <tr 
                v-for="item in filteredAnnouncements" 
                :key="item.id"
                class="hover:bg-slate-50/50 transition-colors group"
                v-else-if="filteredAnnouncements.length > 0"
              >
                <!-- Thumbnail Preview -->
                <td class="px-6 py-4">
                  <div class="w-16 h-10 rounded bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                    <img 
                      v-if="item.imageUrl" 
                      :src="item.imageUrl" 
                      class="w-full h-full object-cover" 
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-slate-50 text-[10px] text-slate-400">
                      None
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="font-medium text-slate-900 mb-1">{{ item.title }}</div>
                  <div class="text-xs text-slate-500 line-clamp-1 pr-4">{{ item.content }}</div>
                </td>
                
                <td class="px-6 py-4">
                  <span v-if="item.status === 'Published'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 shadow-sm">
                    Published
                  </span>
                  <span v-else-if="item.status === 'Draft'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                    Draft
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                    Archived
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-slate-500">
                  {{ formatDate(item.date) }}
                </td>
                
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                      @click="openEditModal(item)"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button 
                      @click="openDeleteModal(item)"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 h-8 w-8 text-slate-500"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr v-else>
                <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                  No announcements found. Click "New Announcement" to create one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal Overlay -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ isEditing ? 'Edit Announcement' : 'Compose Announcement' }}
          </h2>
          <button @click="closeFormModal" :disabled="isSaving" class="text-slate-400 hover:text-slate-600 focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveAnnouncement" class="p-6 space-y-6">
          <div class="space-y-4">
            
            <!-- Image Upload Field -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-900">Cover Image</label>
              <div class="flex items-center gap-4">
                <div class="w-24 h-16 rounded bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
                  <span v-else class="text-[10px] text-slate-400">No Image</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  @change="handleFileChange"
                  class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer disabled:opacity-50"
                  :disabled="isSaving"
                />
              </div>
            </div>

            <!-- Title -->
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-slate-900">Announcement Title</label>
              <input 
                type="text" 
                v-model="form.title"
                placeholder="e.g., Scheduled System Maintenance" 
                class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:opacity-50" 
                required
                :disabled="isSaving"
              />
            </div>

            <!-- Content -->
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-slate-900">Message Content</label>
              <textarea 
                v-model="form.content"
                rows="5"
                placeholder="Write the full details of the announcement here..." 
                class="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 resize-y disabled:opacity-50" 
                required
                :disabled="isSaving"
              ></textarea>
            </div>

            <!-- Meta details row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none text-slate-900">Status</label>
                <select 
                  v-model="form.status"
                  class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:opacity-50"
                  :disabled="isSaving"
                >
                  <option value="Published">Published (Live)</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none text-slate-900">Date Posted</label>
                <input 
                  type="date" 
                  v-model="form.date"
                  class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:opacity-50" 
                  required
                  :disabled="isSaving"
                />
              </div>
            </div>
          </div>

          <div class="pt-2 flex justify-end gap-2 border-t border-slate-100 mt-4">
            <button 
              type="button" 
              @click="closeFormModal"
              :disabled="isSaving"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 border border-slate-200 bg-white text-slate-700 disabled:opacity-50 mt-4"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSaving"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm disabled:opacity-75 mt-4"
            >
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Publish') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal Overlay -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div class="flex flex-col gap-4">
          <div class="flex items-start gap-4">
            <div class="p-2 bg-red-100 text-red-600 rounded-full shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Delete Announcement</h2>
              <p class="text-sm text-slate-500 mt-1">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </p>
              <div class="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-md text-sm text-slate-700 font-medium line-clamp-1">
                "{{ itemToDelete?.title }}"
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-2">
            <button 
              type="button" 
              @click="closeDeleteModal"
              :disabled="isDeleting"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 border border-slate-200 bg-white text-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete"
              :disabled="isDeleting"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-red-600 text-white hover:bg-red-700 h-10 px-6 py-2 shadow-sm disabled:opacity-75"
            >
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { db } from '../../firebase/index.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// --- CLOUDINARY ENVIRONMENT VARIABLES ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// --- Local UI & Interaction State ---
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const itemToDelete = ref(null);

const isLoading = ref(true);
const isSaving = ref(false);
const isDeleting = ref(false);

const searchQuery = ref('');
const statusFilter = ref('all');

// Image upload state
const selectedFile = ref(null);
const imagePreview = ref('');

// Reactive state target for array payload
const announcements = ref([]);

// Form configuration blueprint instance
const form = ref({
  id: null,
  title: '',
  content: '',
  status: 'Published',
  date: '',
  imageUrl: ''
});

// --- Fetch Announcements ---
const fetchAnnouncements = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    announcements.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error retrieving announcements metrics:", error);
    alert("Could not load data. Check console output.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAnnouncements();
});

// --- File Handling & Upload ---
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  selectedFile.value = file;
  imagePreview.value = URL.createObjectURL(file); // Local preview
};

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

// --- Filters ---
const filteredAnnouncements = computed(() => {
  return announcements.value.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' || item.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

// --- Utilities ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    content: '',
    status: 'Published',
    date: getTodayDate(),
    imageUrl: ''
  };
  selectedFile.value = null;
  imagePreview.value = '';
};

// --- Modal Controls ---
const openCreateModal = () => {
  isEditing.value = false;
  resetForm();
  showFormModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  form.value = { ...item };
  selectedFile.value = null;
  imagePreview.value = item.imageUrl || ''; // Set existing image preview
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
};

// --- Save Data ---
const saveAnnouncement = async () => {
  isSaving.value = true;
  try {
    // 1. Upload image if a new file was selected
    const finalImageUrl = await uploadToCloudinary();
    form.value.imageUrl = finalImageUrl;

    // 2. Save to Firestore
    if (isEditing.value) {
      const docRef = doc(db, 'announcements', form.value.id);
      const { id, ...dataToUpdate } = form.value;
      
      await updateDoc(docRef, dataToUpdate);
      
      const index = announcements.value.findIndex(a => a.id === form.value.id);
      if (index !== -1) {
        announcements.value[index] = { ...form.value };
      }
    } else {
      const { id, ...dataToAdd } = form.value;
      const docRef = await addDoc(collection(db, 'announcements'), dataToAdd);
      
      announcements.value.unshift({
        ...dataToAdd,
        id: docRef.id
      });
    }
    closeFormModal();
  } catch (error) {
    console.error("Error committing update:", error);
    alert("Write transaction failed. Please retry.");
  } finally {
    isSaving.value = false;
  }
};

// --- Delete Logic ---
const openDeleteModal = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, 'announcements', itemToDelete.value.id));
    announcements.value = announcements.value.filter(a => a.id !== itemToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error("Error dropping document:", error);
    alert("Failed to drop record context safely.");
  } finally {
    isDeleting.value = false;
  }
};
</script>
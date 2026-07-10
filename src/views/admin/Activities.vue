<template>
  <AdminLayout>
    <template #header-title>Activities</template>

    <div class="w-full space-y-6">
      
      <!-- Page Header & Global Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Activities & Events (Admin)
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Manage upcoming campaigns, seminars, and agency-wide GAD activities.
          </p>
        </div>
        
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          New Activity
        </button>
      </div>

      <!-- Main Data Table Area -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden z-10 relative">
        <!-- Table Toolbar -->
        <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
          <div class="relative w-full sm:max-w-sm">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search activities..." 
              class="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 pl-9 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950" 
            />
          </div>
        </div>

        <!-- The Table -->
        <div class="w-full overflow-auto">
          <table class="w-full text-sm text-left text-slate-600">
            <thead class="text-xs text-slate-500 bg-slate-50/80 uppercase font-medium border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-4 w-1/5">Preview</th>
                <th scope="col" class="px-6 py-4 w-2/5">Activity Details</th>
                <th scope="col" class="px-6 py-4 text-left">Date & Time</th>
                <th scope="col" class="px-6 py-4 text-left">Location</th>
                <th scope="col" class="px-6 py-4 text-left">Status</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                  Loading activities...
                </td>
              </tr>

              <tr 
                v-for="item in activities" 
                :key="item.id"
                class="hover:bg-slate-50/50 transition-colors group"
                v-else-if="activities.length > 0"
              >
                <!-- Thumbnail Column -->
                <td class="px-6 py-4">
                  <div class="w-16 h-12 rounded bg-gray-100 overflow-hidden border border-gray-200">
                    <img :src="item.imageUrl || 'https://via.placeholder.com/150'" class="w-full h-full object-cover" />
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="font-medium text-slate-900 mb-1">{{ item.title }}</div>
                  <div class="text-xs text-slate-500 line-clamp-2 pr-4">{{ item.description }}</div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-slate-600">
                  <span>{{ formatDate(item.date) }}</span>
                </td>

                <td class="px-6 py-4 text-slate-600">
                  <span class="line-clamp-1">{{ item.location }}</span>
                </td>
                
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="item.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'">
                    {{ item.status }}
                  </span>
                </td>
                
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button @click="openEditModal(item)" class="p-1 hover:text-slate-900"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                    <button @click="openDeleteModal(item)" class="p-1 hover:text-red-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal Overlay -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ isEditing ? 'Edit Activity' : 'Add New Activity' }}
          </h2>
          <button @click="closeFormModal" :disabled="isSaving" class="text-slate-400">✕</button>
        </div>

        <form @submit.prevent="saveActivity" class="p-6 space-y-5">
          
          <!-- Image Upload File Input Section -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Activity Image Cover</label>
            <div class="flex items-center gap-4">
              <div class="w-20 h-16 rounded bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
                <span v-else class="text-[10px] text-slate-400">No Image</span>
              </div>
              <input 
                type="file" 
                accept="image/*"
                @change="handleFileChange"
                class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                :disabled="isSaving"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Activity Title</label>
            <input type="text" v-model="form.title" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" required :disabled="isSaving"/>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Description</label>
            <textarea v-model="form.description" rows="3" class="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm" :disabled="isSaving"></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Location / Platform</label>
            <input type="text" v-model="form.location" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" required :disabled="isSaving"/>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-900">Date</label>
              <input type="date" v-model="form.date" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" required :disabled="isSaving"/>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-900">Status</label>
              <select v-model="form.status" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" :disabled="isSaving">
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-2">
            <button type="button" @click="closeFormModal" :disabled="isSaving" class="h-10 px-4 py-2 border rounded-md text-sm">Cancel</button>
            <button type="submit" :disabled="isSaving" class="h-10 px-6 py-2 bg-slate-900 text-white rounded-md text-sm">
              {{ isSaving ? 'Uploading & Saving...' : (isEditing ? 'Save Changes' : 'Create Activity') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal (Unchanged structural logic) -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-lg border p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold text-slate-900">Delete Activity</h2>
        <p class="text-sm text-slate-500 mt-2">Are you sure you want to permanently remove "{{ itemToDelete?.title }}"?</p>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="closeDeleteModal" :disabled="isDeleting" class="h-10 px-4 py-2 border rounded-md text-sm">Cancel</button>
          <button @click="confirmDelete" :disabled="isDeleting" class="h-10 px-6 py-2 bg-red-600 text-white rounded-md text-sm">Delete</button>
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
// --- CLOUDINARY CONFIGURATION CREDENTIALS ---
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
const imagePreview = ref('');

const form = ref({
  id: null,
  title: '',
  description: '',
  location: '',
  status: 'Upcoming',
  date: '',
  imageUrl: ''
});

const activities = ref([]);

const fetchActivities = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'activities'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    activities.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchActivities());

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  selectedFile.value = file;
  imagePreview.value = URL.createObjectURL(file); // Generates instant local temporary preview
};

// --- Cloudinary Native Fetch Upload Function ---
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
  return data.secure_url; // Returns the HTTP public CDN secure link string
};

const saveActivity = async () => {
  isSaving.value = true;
  try {
    // 1. Process image file upload sequentially if a new image was uploaded
    const finalImageUrl = await uploadToCloudinary();
    form.value.imageUrl = finalImageUrl;

    // 2. Write record changes directly to Firestore
    if (isEditing.value) {
      const docRef = doc(db, 'activities', form.value.id);
      const { id, ...dataToUpdate } = form.value;
      await updateDoc(docRef, dataToUpdate);
      
      const index = activities.value.findIndex(a => a.id === form.value.id);
      if (index !== -1) activities.value[index] = { ...form.value };
    } else {
      const { id, ...dataToAdd } = form.value;
      const docRef = await addDoc(collection(db, 'activities'), dataToAdd);
      activities.value.unshift({ ...dataToAdd, id: docRef.id });
    }
    closeFormModal();
  } catch (error) {
    console.error(error);
    alert('Failed to save activity details.');
  } finally {
    isSaving.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  selectedFile.value = null;
  imagePreview.value = '';
  form.value = { id: null, title: '', description: '', location: '', status: 'Upcoming', date: new Date().toISOString().split('T')[0], imageUrl: '' };
  showFormModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  selectedFile.value = null;
  form.value = { ...item };
  imagePreview.value = item.imageUrl || '';
  showFormModal.value = true;
};

const closeFormModal = () => showFormModal.value = false;
const openDeleteModal = (item) => { itemToDelete.value = item; showDeleteModal.value = true; };
const closeDeleteModal = () => { showDeleteModal.value = null; showDeleteModal.value = false; };

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, 'activities', itemToDelete.value.id));
    activities.value = activities.value.filter(a => a.id !== itemToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
};

const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
</script>
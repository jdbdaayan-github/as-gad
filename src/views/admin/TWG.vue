<template>
  <AdminLayout>
    <template #header-title>TWG Directory</template>

    <div class="w-full space-y-6">
      
      <!-- Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Focal Point System (TWG)
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Manage the officials and members of the GAD Technical Working Group.
          </p>
        </div>
        
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          Add Member
        </button>
      </div>

      <!-- Data Table -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden z-10 relative">
        <div class="w-full overflow-auto">
          <table class="w-full text-sm text-left text-slate-600">
            <thead class="text-xs text-slate-500 bg-slate-50/80 uppercase font-medium border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-4 w-16">Photo</th>
                <th scope="col" class="px-6 py-4">Name & Position</th>
                <th scope="col" class="px-6 py-4">Category</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              
              <tr v-if="isLoading">
                <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading members...
                  </div>
                </td>
              </tr>

              <tr 
                v-for="member in twgMembers" 
                :key="member.id"
                class="hover:bg-slate-50/50 transition-colors group"
                v-else-if="twgMembers.length > 0"
              >
                <td class="px-6 py-4">
                  <div class="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                    <img v-if="member.imageUrl" :src="member.imageUrl" class="w-full h-full object-cover" />
                    <svg v-else class="w-full h-full text-slate-300 p-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="font-semibold text-slate-900">{{ member.name }}</div>
                  <div class="text-xs text-slate-500">{{ member.position }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border"
                    :class="{
                      'bg-amber-50 text-amber-700 border-amber-200': member.category === 'Chairperson',
                      'bg-blue-50 text-blue-700 border-blue-200': member.category === 'Vice-Chairperson',
                      'bg-purple-50 text-purple-700 border-purple-200': member.category === 'Secretariat',
                      'bg-slate-100 text-slate-700 border-slate-200': member.category === 'Member'
                    }"
                  >
                    {{ member.category }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button @click="openEditModal(member)" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button @click="openDeleteModal(member)" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 h-8 w-8 text-slate-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr v-else>
                <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                  No members added yet. Click "Add Member" to begin.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">{{ isEditing ? 'Edit Member' : 'Add Member' }}</h2>
          <button @click="closeFormModal" :disabled="isSaving" class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveMember" class="p-6 space-y-4">
          
          <!-- Image Upload -->
          <div class="flex flex-col items-center gap-3 pb-2 border-b border-slate-100">
            <div class="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
              <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
              <svg v-else class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <input type="file" accept="image/*" @change="handleFileChange" class="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" :disabled="isSaving" />
          </div>

          <div class="space-y-2 pt-2">
            <label class="text-sm font-medium text-slate-900">Full Name</label>
            <input type="text" v-model="form.name" placeholder="e.g. Atty. Karina Antonette A. Agudo" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50" required :disabled="isSaving" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Position / Title</label>
            <input type="text" v-model="form.position" placeholder="e.g. Director IV, Administrative Service" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50" required :disabled="isSaving" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Hierarchy Category</label>
            <select v-model="form.category" class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-50" required :disabled="isSaving">
              <option value="Chairperson">Chairperson</option>
              <option value="Vice-Chairperson">Vice-Chairperson</option>
              <option value="Secretariat">Secretariat</option>
              <option value="Member">Member</option>
            </select>
          </div>

          <div class="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" @click="closeFormModal" :disabled="isSaving" class="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-10 px-4 py-2 border border-slate-200 text-slate-700 disabled:opacity-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm disabled:opacity-75">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Saving...' : 'Save Member' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <h2 class="text-lg font-semibold text-slate-900 mb-2">Remove Member</h2>
        <p class="text-sm text-slate-500 mb-4">Are you sure you want to remove "{{ itemToDelete?.name }}" from the directory? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeDeleteModal" :disabled="isDeleting" class="px-4 py-2 text-sm border rounded-md hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button @click="confirmDelete" :disabled="isDeleting" class="px-6 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center disabled:opacity-75">
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Remove
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
const imagePreview = ref('');
const twgMembers = ref([]);

const form = ref({ id: null, name: '', position: '', category: 'Member', imageUrl: '' });

// 1. Fetch Members
const fetchMembers = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'twg_members'), orderBy('category', 'asc'));
    const snapshot = await getDocs(q);
    twgMembers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching TWG members:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchMembers());

// 2. Form & Image Handlers
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const resetForm = () => {
  form.value = { id: null, name: '', position: '', category: 'Member', imageUrl: '' };
  selectedFile.value = null;
  imagePreview.value = '';
};

const openCreateModal = () => { isEditing.value = false; resetForm(); showFormModal.value = true; };
const openEditModal = (item) => { isEditing.value = true; form.value = { ...item }; imagePreview.value = item.imageUrl || ''; selectedFile.value = null; showFormModal.value = true; };
const closeFormModal = () => showFormModal.value = false;

// 3. Upload to Cloudinary
const uploadToCloudinary = async () => {
  if (!selectedFile.value) return form.value.imageUrl;
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
  const data = await response.json();
  return data.secure_url;
};

// 4. Save to Firestore
const saveMember = async () => {
  isSaving.value = true;
  try {
    const uploadedImageUrl = await uploadToCloudinary();
    form.value.imageUrl = uploadedImageUrl;

    if (isEditing.value) {
      const docRef = doc(db, 'twg_members', form.value.id);
      const { id, ...data } = form.value;
      await updateDoc(docRef, data);
      const index = twgMembers.value.findIndex(d => d.id === id);
      if (index !== -1) twgMembers.value[index] = { ...form.value };
    } else {
      const { id, ...data } = form.value;
      const docRef = await addDoc(collection(db, 'twg_members'), data);
      twgMembers.value.push({ ...data, id: docRef.id });
    }
    closeFormModal();
  } catch (error) {
    console.error("Error saving member:", error);
  } finally {
    isSaving.value = false;
  }
};

// 5. Delete Handlers
const openDeleteModal = (item) => { itemToDelete.value = item; showDeleteModal.value = true; };
const closeDeleteModal = () => { showDeleteModal.value = false; itemToDelete.value = null; };

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, 'twg_members', itemToDelete.value.id));
    twgMembers.value = twgMembers.value.filter(d => d.id !== itemToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting member:", error);
  } finally {
    isDeleting.value = false;
  }
};
</script>
<template>
  <AdminLayout>
    <template #header-title>Emergency Directory</template>

    <div class="w-full space-y-6">
      
      <!-- Page Header & Global Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Emergency Hotlines & Directory
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Manage the emergency contact numbers displayed on the public hotlines tab.
          </p>
        </div>
        
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          Add Contact
        </button>
      </div>

      <!-- Main Data Table Area -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden z-10 relative">
        <div class="w-full overflow-auto">
          <table class="w-full text-sm text-left text-slate-600">
            <thead class="text-xs text-slate-500 bg-slate-50/80 uppercase font-medium border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-4">Agency / Office</th>
                <th scope="col" class="px-6 py-4">Contact Number</th>
                <th scope="col" class="px-6 py-4 w-1/3">Description</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              
              <tr v-if="isLoading">
                <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading directory...
                  </div>
                </td>
              </tr>

              <tr 
                v-for="item in directory" 
                :key="item.id"
                class="hover:bg-slate-50/50 transition-colors group"
                v-else-if="directory.length > 0"
              >
                <td class="px-6 py-4 font-medium text-slate-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 font-bold text-red-600">
                  {{ item.number }}
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">
                  {{ item.description || '--' }}
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
                  No contacts found. Click "Add Contact" to create one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">{{ isEditing ? 'Edit Contact' : 'Add New Contact' }}</h2>
          <button @click="closeFormModal" :disabled="isSaving" class="text-slate-400 hover:text-slate-600 focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveContact" class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Agency / Office Name</label>
            <input type="text" v-model="form.name" placeholder="e.g. PNP Women's Desk" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50" required :disabled="isSaving" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Contact Number</label>
            <input type="text" v-model="form.number" placeholder="e.g. 911 or (02) 8532-6690" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50" required :disabled="isSaving" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Description / Notes (Optional)</label>
            <textarea v-model="form.description" rows="3" placeholder="Additional details..." class="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50 resize-y" :disabled="isSaving"></textarea>
          </div>

          <div class="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" @click="closeFormModal" :disabled="isSaving" class="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-10 px-4 py-2 border border-slate-200 text-slate-700 disabled:opacity-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm disabled:opacity-75">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Saving...' : 'Save Contact' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <h2 class="text-lg font-semibold text-slate-900 mb-2">Delete Contact</h2>
        <p class="text-sm text-slate-500 mb-4">Are you sure you want to remove "{{ itemToDelete?.name }}"? This action cannot be undone.</p>
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

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const itemToDelete = ref(null);

const isLoading = ref(true);
const isSaving = ref(false);
const isDeleting = ref(false);

const directory = ref([]);

const form = ref({ id: null, name: '', number: '', description: '' });

// Fetch Directory Contacts
const fetchDirectory = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'directory'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    directory.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching directory:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchDirectory());

const resetForm = () => { form.value = { id: null, name: '', number: '', description: '' }; };

const openCreateModal = () => { isEditing.value = false; resetForm(); showFormModal.value = true; };

const openEditModal = (item) => { isEditing.value = true; form.value = { ...item }; showFormModal.value = true; };

const closeFormModal = () => showFormModal.value = false;

const saveContact = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      const docRef = doc(db, 'directory', form.value.id);
      const { id, ...data } = form.value;
      await updateDoc(docRef, data);
      const index = directory.value.findIndex(d => d.id === id);
      if (index !== -1) directory.value[index] = { ...form.value };
    } else {
      const { id, ...data } = form.value;
      const docRef = await addDoc(collection(db, 'directory'), data);
      directory.value.push({ ...data, id: docRef.id });
      // Sort immediately locally
      directory.value.sort((a, b) => a.name.localeCompare(b.name));
    }
    closeFormModal();
  } catch (error) {
    console.error("Error saving contact:", error);
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
    await deleteDoc(doc(db, 'directory', itemToDelete.value.id));
    directory.value = directory.value.filter(d => d.id !== itemToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting contact:", error);
  } finally {
    isDeleting.value = false;
  }
};
</script>
<template>
  <AdminLayout>
    <template #header-title>FAQs Management</template>

    <div class="w-full space-y-6">
      
      <!-- Page Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Manage the questions and answers displayed on the public FAQs page.
          </p>
        </div>
        
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          Add FAQ
        </button>
      </div>

      <!-- Data Table -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden z-10 relative">
        <div class="w-full overflow-auto">
          <table class="w-full text-sm text-left text-slate-600">
            <thead class="text-xs text-slate-500 bg-slate-50/80 uppercase font-medium border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-4 w-1/3">Question</th>
                <th scope="col" class="px-6 py-4">Answer</th>
                <th scope="col" class="px-6 py-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              
              <tr v-if="isLoading">
                <td colspan="3" class="px-6 py-12 text-center text-slate-500">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading FAQs...
                  </div>
                </td>
              </tr>

              <tr 
                v-for="faq in faqs" 
                :key="faq.id"
                class="hover:bg-slate-50/50 transition-colors group"
                v-else-if="faqs.length > 0"
              >
                <td class="px-6 py-4 font-semibold text-slate-900 align-top">
                  {{ faq.question }}
                </td>
                <td class="px-6 py-4 text-slate-500 align-top">
                  <div class="line-clamp-3 whitespace-pre-wrap">{{ faq.answer }}</div>
                </td>
                <td class="px-6 py-4 text-right align-top">
                  <div class="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button @click="openEditModal(faq)" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button @click="openDeleteModal(faq)" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 h-8 w-8 text-slate-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr v-else>
                <td colspan="3" class="px-6 py-12 text-center text-slate-500">
                  No FAQs found. Click "Add FAQ" to create one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">{{ isEditing ? 'Edit FAQ' : 'Add New FAQ' }}</h2>
          <button @click="closeFormModal" :disabled="isSaving" class="text-slate-400 hover:text-slate-600 focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveFAQ" class="p-6 space-y-4">
          <div class="space-y-2 flex-1">
            <label class="text-sm font-medium text-slate-900">Question</label>
            <input type="text" v-model="form.question" placeholder="e.g. What is GAD?" class="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50" required :disabled="isSaving" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Answer</label>
            <textarea v-model="form.answer" rows="6" placeholder="Provide a clear and detailed answer..." class="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50 resize-y" required :disabled="isSaving"></textarea>
          </div>

          <div class="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" @click="closeFormModal" :disabled="isSaving" class="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 h-10 px-4 py-2 border border-slate-200 text-slate-700 disabled:opacity-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm disabled:opacity-75">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Saving...' : 'Save FAQ' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <h2 class="text-lg font-semibold text-slate-900 mb-2">Delete FAQ</h2>
        <p class="text-sm text-slate-500 mb-4">Are you sure you want to remove this question? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeDeleteModal" :disabled="isDeleting" class="px-4 py-2 text-sm border rounded-md hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button @click="confirmDelete" :disabled="isDeleting" class="px-6 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center disabled:opacity-75">
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification Alert -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 translate-y-4"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-4"
    >
      <div v-if="alertMessage" 
           class="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 text-sm font-medium"
           :class="alertType === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'">
        <!-- Success Icon -->
        <svg v-if="alertType === 'success'" class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <!-- Error Icon -->
        <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ alertMessage }}
      </div>
    </transition>

  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { db } from '../../firebase/index.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const itemToDelete = ref(null);

const isLoading = ref(true);
const isSaving = ref(false);
const isDeleting = ref(false);

const faqs = ref([]);

const form = ref({ id: null, question: '', answer: '' });

// Alert State
const alertMessage = ref('');
const alertType = ref('success');

const showAlert = (message, type = 'success') => {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = '';
  }, 3000); // Disappears after 3 seconds
};

// Fetch FAQs Ordered by createdAt (ascending: oldest first / order of creation)
const fetchFAQs = async () => {
  isLoading.value = true;
  try {
    const q = query(collection(db, 'faqs'), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    faqs.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    showAlert("Failed to load FAQs.", "error");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchFAQs());

const resetForm = () => { 
  form.value = { id: null, question: '', answer: '' }; 
};

const openCreateModal = () => { isEditing.value = false; resetForm(); showFormModal.value = true; };

const openEditModal = (item) => { isEditing.value = true; form.value = { ...item }; showFormModal.value = true; };

const closeFormModal = () => showFormModal.value = false;

const saveFAQ = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      const docRef = doc(db, 'faqs', form.value.id);
      const { id, createdAt, ...data } = form.value;
      await updateDoc(docRef, data);
      
      const index = faqs.value.findIndex(f => f.id === id);
      if (index !== -1) faqs.value[index] = { ...form.value, createdAt: createdAt };
      
      showAlert("FAQ updated successfully!");
    } else {
      const { id, ...data } = form.value;
      data.createdAt = serverTimestamp(); 
      const docRef = await addDoc(collection(db, 'faqs'), data);
      
      // Push places the newly created item at the bottom visually
      faqs.value.push({ ...data, id: docRef.id, createdAt: new Date() });
      
      showAlert("FAQ added successfully!");
    }
    
    closeFormModal();
  } catch (error) {
    console.error("Error saving FAQ:", error);
    showAlert("An error occurred while saving.", "error");
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
    await deleteDoc(doc(db, 'faqs', itemToDelete.value.id));
    faqs.value = faqs.value.filter(f => f.id !== itemToDelete.value.id);
    closeDeleteModal();
    
    showAlert("FAQ deleted successfully!");
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    showAlert("Failed to delete FAQ.", "error");
  } finally {
    isDeleting.value = false;
  }
};
</script>
<template>
  <AdminLayout>
    <template #header-title>Data Disaggregation</template>

    <div class="w-full space-y-6">
      
      <!-- Page Header & Global Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Sex-Disaggregated Data
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Manage and monitor personnel distribution by sex across all divisions.
          </p>
        </div>
        
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          Add Division Data
        </button>
      </div>

      <!-- Quick Stats Grid -->
      <div v-if="!isLoading" class="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        
        <!-- Total Personnel -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-row items-center justify-between pb-2">
            <h3 class="tracking-tight text-sm font-medium text-slate-500">Total Personnel</h3>
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div class="text-3xl font-bold text-slate-900">{{ grandTotal }}</div>
        </div>

        <!-- Total Male -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-row items-center justify-between pb-2">
            <h3 class="tracking-tight text-sm font-medium text-slate-500">Total Male</h3>
            <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div class="text-3xl font-bold text-slate-900">{{ totalMale }}</div>
        </div>

        <!-- Total Female -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-row items-center justify-between pb-2">
            <h3 class="tracking-tight text-sm font-medium text-slate-500">Total Female</h3>
            <svg class="h-4 w-4 text-pink-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div class="text-3xl font-bold text-slate-900">{{ totalFemale }}</div>
        </div>
      </div>

      <!-- Main Data Table Area -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden z-10 relative">
        
        <!-- Table Toolbar -->
        <div class="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div class="relative w-full max-w-sm">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search division..." 
              class="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 pl-9 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950" 
            />
          </div>
          <button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-900 h-9 px-3 border border-slate-200 bg-white">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export CSV
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-12 text-center text-slate-500">
          Loading data from Firebase...
        </div>

        <!-- The Table -->
        <div v-else class="w-full overflow-auto">
          <table class="w-full text-sm text-left text-slate-600">
            <thead class="text-xs text-slate-500 bg-slate-50/80 uppercase font-medium border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-4">Division</th>
                <th scope="col" class="px-6 py-4 text-center">Male Count</th>
                <th scope="col" class="px-6 py-4 text-center">Female Count</th>
                <th scope="col" class="px-6 py-4 text-center font-bold text-slate-700">Total</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="item in divisionsData" 
                :key="item.id"
                class="hover:bg-slate-50/50 transition-colors group"
              >
                <td class="px-6 py-4 font-medium text-slate-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {{ item.male }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-100">
                    {{ item.female }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center font-bold text-slate-900">
                  {{ Number(item.male) + Number(item.female) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <!-- Edit Button -->
                    <button 
                      @click="openEditModal(item)"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <!-- Delete Button -->
                    <button 
                      @click="openDeleteModal(item)"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 h-8 w-8 text-slate-500"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="divisionsData.length === 0 && !isLoading">
                <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                  No division data found. Click "Add Division Data" to start.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ isEditing ? 'Edit Division' : 'Add Division' }}
          </h2>
          <button @click="closeFormModal" class="text-slate-400 hover:text-slate-600 focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveDivision" class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none text-slate-900">Division Name</label>
            <input 
              type="text" 
              v-model="form.name"
              placeholder="e.g., GSD" 
              class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" 
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-slate-900">Male Count</label>
              <input 
                type="number" 
                v-model.number="form.male"
                min="0"
                class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" 
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-slate-900">Female Count</label>
              <input 
                type="number" 
                v-model.number="form.female"
                min="0"
                class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" 
                required
              />
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-2">
            <button 
              type="button" 
              @click="closeFormModal"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 border border-slate-200 bg-white text-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Division') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div class="flex flex-col gap-4">
          <div class="flex items-start gap-4">
            <div class="p-2 bg-red-100 text-red-600 rounded-full shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Delete Division Data</h2>
              <p class="text-sm text-slate-500 mt-1">
                Are you sure you want to delete the data for <strong>{{ itemToDelete?.name }}</strong>? This action cannot be undone.
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button 
              type="button" 
              @click="closeDeleteModal"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 border border-slate-200 bg-white text-slate-700"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete"
              :disabled="isSubmitting"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-red-600 text-white hover:bg-red-700 h-10 px-6 py-2 shadow-sm disabled:opacity-50"
            >
              {{ isSubmitting ? 'Deleting...' : 'Delete' }}
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
import { db } from '../../firebase/index.js'; // Verify this path points to your firebase init file
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// --- State ---
const divisionsData = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const itemToDelete = ref(null);

const form = ref({
  id: null,
  name: '',
  male: 0,
  female: 0
});

// --- Computed Stats ---
const totalMale = computed(() => {
  return divisionsData.value.reduce((sum, item) => sum + Number(item.male), 0);
});

const totalFemale = computed(() => {
  return divisionsData.value.reduce((sum, item) => sum + Number(item.female), 0);
});

const grandTotal = computed(() => {
  return totalMale.value + totalFemale.value;
});

// --- Firebase Operations ---

// 1. Fetch Data
const fetchData = async () => {
  isLoading.value = true;
  try {
    const querySnapshot = await getDocs(collection(db, 'divisionsData'));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    // Optional: Sort alphabetically by name
    divisionsData.value = data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching data: ", error);
    alert("Failed to load data from Firebase.");
  } finally {
    isLoading.value = false;
  }
};

// 2. Save Data (Create or Update)
const saveDivision = async () => {
  isSubmitting.value = true;
  
  const divisionPayload = {
    name: form.value.name,
    male: Number(form.value.male),
    female: Number(form.value.female)
  };

  try {
    if (isEditing.value) {
      // Update existing document
      const docRef = doc(db, 'divisionsData', form.value.id);
      await updateDoc(docRef, divisionPayload);
      
      // Update local state to avoid refetching everything
      const index = divisionsData.value.findIndex(d => d.id === form.value.id);
      if (index !== -1) divisionsData.value[index] = { id: form.value.id, ...divisionPayload };
      
    } else {
      // Create new document
      const docRef = await addDoc(collection(db, 'divisionsData'), divisionPayload);
      
      // Update local state
      divisionsData.value.push({ id: docRef.id, ...divisionPayload });
    }
    
    closeFormModal();
  } catch (error) {
    console.error("Error saving document: ", error);
    alert("An error occurred while saving data.");
  } finally {
    isSubmitting.value = false;
  }
};

// 3. Delete Data
const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  isSubmitting.value = true;
  try {
    await deleteDoc(doc(db, 'divisionsData', itemToDelete.value.id));
    
    // Update local state
    divisionsData.value = divisionsData.value.filter(d => d.id !== itemToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting document: ", error);
    alert("An error occurred while deleting data.");
  } finally {
    isSubmitting.value = false;
  }
};

// --- Modal Actions ---
const resetForm = () => {
  form.value = { id: null, name: '', male: 0, female: 0 };
};

const openCreateModal = () => {
  isEditing.value = false;
  resetForm();
  showFormModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  form.value = { ...item };
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
};

const openDeleteModal = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchData();
});
</script>
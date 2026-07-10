<template>
  <AdminLayout>
    <template #header-title>Activities</template>

    <div class="w-full space-y-6">
      
      <!-- Page Header & Global Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Activities & Events
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
          
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <select class="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 w-full sm:w-auto">
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <!-- The Table -->
        <div class="w-full overflow-auto">
          <table class="w-full text-sm text-left text-slate-600">
            <thead class="text-xs text-slate-500 bg-slate-50/80 uppercase font-medium border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-4 w-2/5">Activity Details</th>
                <th scope="col" class="px-6 py-4 text-left">Date & Time</th>
                <th scope="col" class="px-6 py-4 text-left">Location</th>
                <th scope="col" class="px-6 py-4 text-left">Status</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="item in activities" 
                :key="item.id"
                class="hover:bg-slate-50/50 transition-colors group"
              >
                <!-- Title & Description -->
                <td class="px-6 py-4">
                  <div class="font-medium text-slate-900 mb-1">{{ item.title }}</div>
                  <div class="text-xs text-slate-500 line-clamp-2 pr-4">{{ item.description }}</div>
                </td>
                
                <!-- Date -->
                <td class="px-6 py-4 whitespace-nowrap text-slate-600">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>{{ formatDate(item.date) }}</span>
                  </div>
                </td>

                <!-- Location -->
                <td class="px-6 py-4 text-slate-600">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span class="line-clamp-1">{{ item.location }}</span>
                  </div>
                </td>
                
                <!-- Status Badge -->
                <td class="px-6 py-4">
                  <span v-if="item.status === 'Upcoming'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                    Upcoming
                  </span>
                  <span v-else-if="item.status === 'Ongoing'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 shadow-sm">
                    Ongoing
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                    Completed
                  </span>
                </td>
                
                <!-- Actions -->
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
              
              <!-- Empty State -->
              <tr v-if="activities.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                  No activities found. Click "New Activity" to add one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal Overlay -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ isEditing ? 'Edit Activity' : 'Add New Activity' }}
          </h2>
          <button @click="closeFormModal" class="text-slate-400 hover:text-slate-600 focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveActivity" class="p-6 space-y-5">
          
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none text-slate-900">Activity Title</label>
            <input 
              type="text" 
              v-model="form.title"
              placeholder="e.g., GAD Planning and Budgeting Workshop" 
              class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" 
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none text-slate-900">Description</label>
            <textarea 
              v-model="form.description"
              rows="3"
              placeholder="Brief overview of the activity..." 
              class="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 resize-y" 
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none text-slate-900">Location / Platform</label>
            <input 
              type="text" 
              v-model="form.location"
              placeholder="e.g., DSWD Central Office Auditorium" 
              class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" 
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-slate-900">Date</label>
              <input 
                type="date" 
                v-model="form.date"
                class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" 
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-slate-900">Status</label>
              <select 
                v-model="form.status"
                class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
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
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 shadow-sm"
            >
              {{ isEditing ? 'Save Changes' : 'Create Activity' }}
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
              <h2 class="text-lg font-semibold text-slate-900">Delete Activity</h2>
              <p class="text-sm text-slate-500 mt-1">
                Are you sure you want to delete this activity? It will be permanently removed from the system.
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
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 border border-slate-200 bg-white text-slate-700"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-red-600 text-white hover:bg-red-700 h-10 px-6 py-2 shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';

// --- State for Modals ---
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const itemToDelete = ref(null);

// Form model
const form = ref({
  id: null,
  title: '',
  description: '',
  location: '',
  status: 'Upcoming',
  date: ''
});

// Mock data for activities
const activities = ref([
  {
    id: 1,
    title: 'GAD Planning and Budgeting Workshop',
    description: 'Annual workshop for division heads to align GAD plans and budgets for the upcoming fiscal year.',
    location: 'DSWD Central Office Auditorium',
    status: 'Upcoming',
    date: '2026-08-15'
  },
  {
    id: 2,
    title: '18-Day Campaign to End VAW Kick-off',
    description: 'Opening ceremony and motorcade for the 18-Day Campaign to End Violence Against Women.',
    location: 'Quezon Memorial Circle',
    status: 'Upcoming',
    date: '2026-11-25'
  },
  {
    id: 3,
    title: 'Gender Sensitivity Training (Batch 4)',
    description: 'Mandatory GST for newly hired personnel of the Administrative Service.',
    location: 'Zoom (Virtual)',
    status: 'Completed',
    date: '2026-05-10'
  }
]);

// --- Helper Functions ---
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    description: '',
    location: '',
    status: 'Upcoming',
    date: getTodayDate()
  };
};

// --- Form Modal Actions ---
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

const saveActivity = () => {
  if (isEditing.value) {
    const index = activities.value.findIndex(a => a.id === form.value.id);
    if (index !== -1) {
      activities.value[index] = { ...form.value };
    }
  } else {
    const newId = activities.value.length ? Math.max(...activities.value.map(a => a.id)) + 1 : 1;
    activities.value.unshift({
      ...form.value,
      id: newId
    });
  }
  
  // Replace with actual API call here
  closeFormModal();
};

// --- Delete Modal Actions ---
const openDeleteModal = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

const confirmDelete = () => {
  if (itemToDelete.value) {
    activities.value = activities.value.filter(a => a.id !== itemToDelete.value.id);
    // Replace with actual API delete call here
  }
  closeDeleteModal();
};
</script>
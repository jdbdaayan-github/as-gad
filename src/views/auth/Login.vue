<template>
  <div class="min-h-screen flex bg-gray-50">
    
    <!-- Left Branding Panel (Hidden on Mobile) -->
    <div class="hidden lg:flex lg:w-1/2 bg-[#4c0f89] flex-col justify-center items-center p-12 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg class="absolute w-96 h-96 -top-10 -left-10 text-white" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"></circle></svg>
        <svg class="absolute w-64 h-64 bottom-10 right-10 text-[#FFD700]" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"></circle></svg>
      </div>

      <div class="z-10 flex flex-col items-center text-center space-y-6">
        <div class="flex space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <!-- Placeholder for Logos -->
          <div class="w-16 h-16 bg-transparent rounded-md flex items-center justify-center font-bold text-white text-xs text-center leading-tight"><DSWDLogo/></div>
          <div class="w-16 h-16 bg-transparent rounded-md flex items-center justify-center font-bold text-white text-xs text-center leading-tight"><BPLogo/></div>
        </div>
        
        <div class="space-y-2">
          <h1 class="text-3xl font-extrabold text-white tracking-wide">Administrative Service</h1>
          <h2 class="text-xl font-semibold text-[#FFD700] tracking-wide">Gender and Development Information Hub</h2>
        </div>
        
        <p class="text-[#e2d8f0] max-w-md mt-4 leading-relaxed text-lg">
          Welcome to the Administrative Service Gender and Development Information Hub.
          Access reports, resources, and information through a secure and centralized
          platform designed to support efficient data management and collaboration.
        </p>
      </div>
    </div>

    <!-- Right Login Form Panel -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
      <div class="w-full max-w-md space-y-8">
        
        <!-- Mobile Header (Visible only on small screens) -->
        <div class="lg:hidden flex flex-col items-center text-center space-y-4 mb-8">
          <div class="flex space-x-3">
             <div class="w-12 h-12 bg-[#4c0f89] rounded-md flex items-center justify-center font-bold text-white text-[10px]">DSWD</div>
          </div>
          <div>
            <h1 class="text-xl font-extrabold text-gray-900">GAD Info Hub</h1>
          </div>
        </div>

        <div>
          <h2 class="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p class="mt-2 text-sm text-gray-600">
            Enter your credentials to access the portal.
          </p>
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600 text-center">
        {{ errorMessage }}
        </p>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-4">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  required 
                  v-model="email"
                  :disabled="isLoading"
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c0f89] focus:border-[#4c0f89] sm:text-sm transition-colors disabled:bg-gray-100 disabled:text-gray-500" 
                  placeholder="Enter"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autocomplete="current-password" 
                  required 
                  v-model="password"
                  :disabled="isLoading"
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c0f89] focus:border-[#4c0f89] sm:text-sm transition-colors disabled:bg-gray-100 disabled:text-gray-500" 
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#4c0f89] hover:bg-[#3a0b69] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c0f89] transition-colors uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <!-- Loading Spinner SVG -->
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
        
        <!-- Support Text -->
        <div class="mt-6 text-center text-xs text-gray-500">
          Having trouble logging in? <a href="mailto:records@dswd.gov.ph" class="text-[#4c0f89] hover:underline">Contact System Administrator</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DSWDLogo from '../../components/DSWDLogo.vue';
import BPLogo from '../../components/BPLogo.vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/index.ts'; // Adjust path if necessary
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false); // Added loading state

const handleLogin = async () => {
  // Start loading and clear any previous errors
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const user = userCredential.user;
    console.log('Successfully logged in!', user);

    // Redirect to admin dashboard
    router.push('/admin');

  } catch (error) {
    console.error('Error logging in:', error.message);
    errorMessage.value = "Invalid email or password.";
  } finally {
    // Stop loading whether it succeeds or fails
    isLoading.value = false;
  }
};
</script>
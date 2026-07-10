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
        
        <p class="text-[#e2d8f0] max-w-md mt-4 leading-relaxed">
          Access your dashboard to manage sex-disaggregated data, GAD documentations, and resources to help build a safe and inclusive society for all genders.
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
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c0f89] focus:border-[#4c0f89] sm:text-sm transition-colors" 
                  placeholder="admin@dswd.gov.ph"
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
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c0f89] focus:border-[#4c0f89] sm:text-sm transition-colors" 
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                v-model="rememberMe"
                class="h-4 w-4 text-[#4c0f89] focus:ring-[#4c0f89] border-gray-300 rounded" 
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-[#4c0f89] hover:text-[#3a0b69]">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#4c0f89] hover:bg-[#3a0b69] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c0f89] transition-colors uppercase tracking-wider"
            >
              Sign in
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

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log('Successfully logged in!', user);
    
    // Redirect the user to the dashboard here (e.g., using vue-router)
    
  } catch (error) {
    console.error('Error logging in:', error.message);
    errorMessage.value = "Invalid email or password.";
  }
};
</script>
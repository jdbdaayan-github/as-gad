<template>
  <footer class="bg-[#4c0f89] w-full py-12 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-4 items-center justify-items-center md:justify-items-stretch">
      
      <!-- Left Section: Address & Contact -->
      <div class="flex flex-col space-y-8 text-[#e2d8f0] text-sm sm:text-base max-w-md md:justify-self-end md:mr-10">
        
        <!-- Address -->
        <div>
          <h3 class="font-bold text-white mb-2 uppercase tracking-wide">Our Address:</h3>
          <p class="leading-relaxed">
            DSWD Central Office, IBP Road, Batasan Pambansang Complex, Constitution<br class="hidden sm:block" />
            Hills, Quezon City, Philippines, 1126
          </p>
        </div>

        <!-- Contact Us -->
        <div>
          <h3 class="font-bold text-white mb-2 uppercase tracking-wide">Contact Us:</h3>
          <p class="mb-1">
            Tel. Nos.: Tel. Nos.: 8931-9105 to 107 Local VoIP: 10130
          </p>
          <p>
            Email: <a href="mailto:records@dswd.gov.ph" class="text-[#cda631] hover:text-[#FFD700] transition-colors">records@dswd.gov.ph</a>
          </p>
        </div>

      </div>

      <!-- Right Section: Google Maps Embed -->
      <div class="w-full max-w-lg h-[250px] sm:h-[300px] rounded-xl overflow-hidden shadow-lg border border-gray-300 md:justify-self-start md:ml-10">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.183492723326!2d121.0898516!3d14.7013899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ba0942ef7381%3A0xc345f053e1eb4a68!2sDepartment%20of%20Social%20Welfare%20and%20Development!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph" 
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full h-full object-cover"
        ></iframe>
      </div>

    </div>
  </footer>
</template>

<script setup>
// This component relies purely on HTML and standard Tailwind classes 
// for structure, so no internal reactive state is necessary.
</script>
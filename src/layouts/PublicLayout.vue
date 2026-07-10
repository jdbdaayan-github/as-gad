<script setup>
import Footer from '../components/layouts/public/Footer.vue';
import Navbar from '../components/layouts/public/Navbar.vue'

</script>

<template>
    <Navbar/>
    <slot />
    <Footer/>
</template>
<script setup>
import Cart from '../components/Cart.vue'
</script>

<template>
  <nav class="flex justify-between py-4 m-2 px-12">
    <!-- logo -->
    <div class="flex flex-col justify-center py-2">
      <span class="text-lg md:text-xl lg:text-2xl font-extrabold">CHISEL STORE</span>
    </div>

    <!-- nav items -->
    <div class="flex flex-col justify-center">
      <ul class="p-2 flex space-x-3 text-xl font-semibold">
        <li>LINK-ONE</li>
        <li>LINK-TWO</li>
        <li>LINK-THREE</li>
      </ul>
    </div>

    <!-- cart -->
    <Cart></Cart>
    <!-- cart -->
  </nav>
</template>
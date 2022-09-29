<script setup>
import { useStore } from 'vuex';

defineProps({
  product: Object
})

const store = useStore();

</script>

<template>
  <div class="p-2 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4">
    <div class="card card-compact w-full h-full bg-base-100 shadow-xl ">
      <figure><img :src="product.image" alt="Shoes" /></figure>
      <div class="card-body">
        <h2 class="card-title">{{product.name}}</h2>
        <p>{{ product.details.slice(0, 60) + '..' }}</p>
        <div class="card-actions justify-between">
          <h3 class="card-title p-2">${{product.price}}</h3>
          <button class="btn btn-primary" @click="store.dispatch('addToCart', product)">Add To Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { apiUrl } from '../vars';
import ProductCard from '../components/ProductCard.vue';
import { onMounted, ref, watch, computed } from 'vue';
import axios from 'axios';
let products = ref([]);
let categories = ref([]);
let nextPageFilter = ref([]);
let prevPageFilter = ref([]);
/**
 * @description Fetches products from Chiselstrike
 * @param {String | null} filters 
 */
const fetchProducts = async (filters = null) => {
    products.value = [];
  try {
    const {data: {results, prev_page, next_page}} = await axios.get(`${apiUrl}/products?${filters ?? ''}`);
    prevPageFilter.value = prev_page ?? "";
    nextPageFilter.value = next_page ?? "";
    products.value = results;
  } catch(e){
    console.log(`An error occured - ${e}`)
  }
}

/**
 * @description Fetches categories from Chiselstrike
 */
const fetchCategories = async () => {
  categories.value = []
  try {
    const {data: {results}} = await axios.get(`${apiUrl}/categories`);
    categories.value = results;
  } catch(e){
    console.log(`An error occured - ${e}`)
  }
}
</script>

<template>
</template>
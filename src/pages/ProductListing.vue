<script setup>
import { apiUrl } from '../vars';
import ProductCard from '../components/ProductCard.vue';

import { onMounted, ref, watch, computed } from 'vue';
import axios from 'axios';

let products = ref([]);
let categories = ref([]);
// let contentFetchFilters = ref ({"page_size": 2, "sort": "price"});
let contentFetchFilters = ref ({});
let nextPageFilter = ref([]);
let prevPageFilter = ref([]);
let sortingProperties = ref([
  {name: 'name', attribute: 'name'},
  {name: 'High-Low Price', attribute: '-price'},
  {name: 'Low-High Price', attribute: 'price'},
  {name: 'Last Added', attribute: 'createdAt'},
  {name: 'First Added', attribute: '-createdAt'}
])
let selectedSortingProperty = ref('');
let perPageOptions = ref(['2','3','5','8','10'])
let perPage = ref(10)

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

/**
 * @description Converts the filters object into a url compatible string
 * @param {Object} filters
 */
const stringifyFilters = (filters) => Object.keys(filters).map(key => `${key}=${filters[key]}`).join('&');

// Run functions when the component is mounted
onMounted(() => {
  fetchProducts()
  fetchCategories()
})

const resetAllOtherFilters = () => {
  contentFetchFilters.value = {}
  selectedCategory.value = 'all'
  price.value = {start: "", end: ""}
}


// FILTERS
// * Chiselstrike: GET method endpoint filters, gt, gte, lt, lte

let selectedCategory = ref('all');
let price = ref({start: "", end: ""})

// Watch for changes in the selectedCategory reactive variable
watch(selectedCategory, async (newCategory) => {
  let currentFiltersQuery = contentFetchFilters.value, newCategoryFilter;

  // update route with the new category filter selected
  if(newCategory !== "all") {
    newCategoryFilter = Object.assign(currentFiltersQuery, {'.category.name': newCategory})
  } else {
    delete currentFiltersQuery['.category.name']
    newCategoryFilter = currentFiltersQuery;
  }
  contentFetchFilters.value = newCategoryFilter;
  let newRequestFilters = stringifyFilters(newCategoryFilter);
  fetchProducts(newRequestFilters)
})

// Updates the price related filters for products to be listed
const updatePrices = () => {
  let currentFiltersQuery = contentFetchFilters.value, priceFilter;

  if(price.value.from) {
    priceFilter = Object.assign(currentFiltersQuery, {'.price~gte': parseFloat(price.value.from)})
  } else {
    if(priceFilter) delete priceFilter['.price~gte']
  }
  if(price.value.to) {
    priceFilter = Object.assign(currentFiltersQuery, {'.price~lte': parseFloat(price.value.to)})
  } else {
    if(priceFilter) delete priceFilter['.price~lte']
  }
  if(price.value.from || price.value.to){
    contentFetchFilters.value = priceFilter;
    let newRequestFilters = stringifyFilters(priceFilter);
    fetchProducts(newRequestFilters)
  }
}

// SITE SEARCH 
// * IMPORTANT: Chiselstrike SQL like "like" filter implementation

let searchQuery = ref('')

/**
 * @description Performs a search
 */
const search = () => {
  resetAllOtherFilters();
  if(searchQuery.value && searchQuery.value.length >= 3){
    fetchProducts(`?.name~like=%${searchQuery.value}%&.details~like=%${searchQuery.value}%`)
  }
}

// PAGINATION
// * Chiselstrike: next_page and prev_page from get endpoints
// go to previous page
function prevPage(){
  if(nextPageFilter.value) fetchProducts(nextPageFilter.value.replace(`${apiUrl}/products?`,''))
}
// go to next page
function nextPage(){
  if(prevPageFilter.value) fetchProducts(prevPageFilter.value.replace(`${apiUrl}/products?`,''))
}

// * Chiselstrike: page_size endpoint attribute
watch(perPage, (itemsCount) => {
  let currentFiltersQuery = contentFetchFilters.value, sortProperty;

  if(itemsCount) {
    sortProperty = Object.assign(currentFiltersQuery, {'page_size': parseInt(itemsCount)})
  } else {
    delete sortProperty['page_size']
  }
  
  contentFetchFilters.value = sortProperty;
  let newRequestFilters = stringifyFilters(sortProperty);
  fetchProducts(newRequestFilters)
})

// SORTING
// * Chiselstrike: order ascending and descending
watch(selectedSortingProperty, (newSortingProperty) => {
  let currentFiltersQuery = contentFetchFilters.value, sortProperty;

  if(newSortingProperty) {
    sortProperty = Object.assign(currentFiltersQuery, {'sort': newSortingProperty})
  } else {
    delete sortProperty['sort']
  }
  
  contentFetchFilters.value = sortProperty;
  let newRequestFilters = stringifyFilters(sortProperty);
  fetchProducts(newRequestFilters)
})
</script>

<template>
</template>
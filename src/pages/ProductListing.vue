<script setup>
import SiteNavigation from '../components/SiteNavigation.vue';
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
  <!-- header & nav -->
  <header class="flex flex-col w-full space-x-3">
    <SiteNavigation></SiteNavigation>

    <div class="flex w-full px-12">
      <!-- site search -->
      <div class="flex-1 flex justify-center"> 
        <form @submit.prevent="search()">
          <div class="form-control">
            <div class="input-group">
              <input type="text" placeholder="Search…" class="input input-bordered w-96" v-model="searchQuery" />
              <button class="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </div>
        </form>
      </div>
      <!-- site search end -->

      <!-- sort -->
      <div class="ml-4">
        <div class="form-control w-full max-w-xs">
          <select 
            id="sort"
            v-model="selectedSortingProperty"
            class="select select-bordered w-full max-w-xs"
          >
            <option value="" selected>Sort By</option>
            <option
              v-for="(cat, key) of sortingProperties"
              :key="key"
              :value="cat.attribute"
            >{{ cat.name }}</option>
          </select>
        </div>
      </div>
      <!-- sort end -->
    </div>

  </header>

  <!-- main content -->
  <main class="flex flex-row w-full p-4">

    <!-- filter -->
    <div class="sticky mt-3 top-4">
      <ul class="flex flex-col max-w-[270px] p-4 border-r-2 border-gray-400 min-h-full space-y-2 bg-base-100">
        <li>
          <h4>
            FILTERS
          </h4>
        </li>
        <li>
          <label for="price" class="my-2 font-light font-mono">Price:</label>
          <div class="flex ml-2 space-x-2">
            <input type="text" class="w-12 border-2 border-slate-400 font-mono text-md" v-model.number="price.from" @keyup="updatePrices()">
            <div class="m-x-4"> to </div>
            <input type="text" class="w-12 border-2 border-slate-400" v-model.number="price.to" @keyup="updatePrices()">
          </div>
        </li>
        <li>
          <div class="mt-2 font-light font-mono">Categories:</div>
          <div v-if="categories.length">
            <ul class="ml-2 p-2">
              <li class="flex justify-between">
                <label for="all font-mono text-md"> All </label>
                <input type="radio" value="all" v-model="selectedCategory">
              </li>
              <li v-for="(category, key) of categories" class="flex justify-between">
                <label :for="category.name" class="mr-4 font-mono text-md">{{ category.name }}</label>
                <input
                  type="radio"
                  :id="category.name"
                  :value="category.name"
                  v-model="selectedCategory"
                >
              </li>
            </ul>
          </div>
          <div v-else>
            Loading categories
          </div>
        </li>
      </ul>
    </div>
    <!-- filter end -->
    
    <!-- products listing -->
    <div class="flex flex-wrap flex-1">
      <div class="w-full flex flex-wrap p-4" v-if="products.length">
        <ProductCard
        v-for="(product, key) of products"
        :key="key"
        :product="product"
        ></ProductCard>
      </div>

      <div class="flex flex-col p-4" v-else>
        <p class="text-3xl text-center">
          No Items
        </p>
      </div>
      
      <!-- pagination -->
      <div class="flex justify-center p-4 m-2 w-full">
        <!-- pagination -->
        <div class="btn-group">
          <button class="btn" @click="prevPage()">« Prev</button>
          <button class="btn" @click="nextPage()">Next »</button>
        </div>
        <!-- pagination end -->

        <!-- per page -->
        <div class="ml-4">
          <div class="form-control w-full max-w-xs">
            <select 
              id="sort"
              v-model="perPage"
              class="select select-bordered"
            >
              <option
                v-for="(item, key) of perPageOptions"
                :key="key"
                :value="item"
              >{{ item }}</option>
            </select>
          </div>
        </div>
        <!-- per page end -->
      </div>
      <!-- pagination end -->
    </div>
    <!-- products listing end -->

  </main>
  <!-- main content end -->
</template>
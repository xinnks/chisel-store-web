<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const cart = computed(() => store.getters.getCart);
let totalPrice = 0;
const totalAmount = computed(() => store.getters.getCart.length ? store.getters.getCart.map(item => item.count * parseFloat(item.price)).reduce((agg, val) => agg + val) : 0)
</script>

<template>
  <div class="p-2 flex justify-center">
    <!-- The button to open modal -->
    <label for="cart-modal" class="btn modal-button flex">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6 fill-white"><path fill="none" d="M0 0h24v24H0z"/><path d="M6 9h13.938l.5-2H8V5h13.72a1 1 0 0 1 .97 1.243l-2.5 10a1 1 0 0 1-.97.757H5a1 1 0 0 1-1-1V4H2V2h3a1 1 0 0 1 1 1v6zm0 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
      <span class="p-2">
        ${{totalAmount}}
      </span>
    </label>

    <!-- cart model -->
    <input type="checkbox" id="cart-modal" class="modal-toggle" />
    <div class="modal flex-flex-col w-full">
      <div class="modal-box flex flex-col justify-between h-[80vh]">
        <label for="cart-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        
        <div class="flex p-2 border-b-2 border-slate-200">
          <h3 class="text-lg font-bold">Cart</h3>
        </div>

        <div class="flex-1 flex flex-col space-y-2 py-4 overflow-y-auto" v-if="cart.length">
          <div
            v-for="(product, key) of cart"
            class="relative flex justify-between p-3 border-2 rounded border-slate-300"
          >
            <figure
              class="h-24 relative"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="relative h-full w-auto p-2"
              /></figure>
            <div
              class="flex-1 px-3 flex flex-col justify-center"
            > {{ product.name }} </div>
            <div class="flex flex-col justify-center">
              <div class="flex align-middle space-x-2 h-8">
                <div class="p-2"> {{ product.count }} </div>
                <div class="flex flex-col justify-center h-8">
                  <button class="flex w-6 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-white" @click="store.dispatch('cartIncrement', product.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
                  </button>
                  <button class="flex w-6 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-white" @click="store.dispatch('cartDecrement', product.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5 11h14v2H5z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-center align-middle" v-else>
          <div class="p-4 rounded text-center w-full text-slate-400 font-bold text-2xl">
            KEEP ON SHOPPING!
          </div>
        </div>

        <div class="flex justify-between align-middle p-2 border-t-2 border-slate-200">
          <h3 class="text-lg font-bold flex flex-col justify-center">Total (${{totalAmount}})</h3>
          <button class="btn btn-primary">BUY NOW</button>
        </div>
      </div>
    </div>
  </div>
</template>
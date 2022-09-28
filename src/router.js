import { createRouter, createWebHistory } from "vue-router";

export const routes = [{
  path: '/',
  name: 'Home Page',
  component: () => import('./pages/ProductListing.vue'),
},{
  path: '/products',
  name: 'Products Listing',
  component: () => import('./pages/ProductListing.vue'),
},{
  path: '/:pathMatch(.*)',
  name: 'Error Page',
  component: () => import('./pages/Error.vue'),
}];

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
});
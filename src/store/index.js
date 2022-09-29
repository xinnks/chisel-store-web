import { createStore } from 'vuex'

export const store = createStore({
  state: {
    cart: []
  },
  getters: {
    getCart: (state) => state.cart
  },
  actions: {
    addToCart({state, dispatch}, payload) {
      const index = state.cart.findIndex(item => item.id === payload.id)
      if(index !== -1){
        dispatch('cartIncrement', payload.id)
      } else {
        state.cart.push(Object.assign(payload, {count: 1}))
      }
    },
    removeFromCart({state}, id) {
      state.cart = state.cart.filter(item => item.id !== id);
    },
    cartIncrement({state}, id){
      let index = state.cart.findIndex(item => item.id === id);
      if(index !== -1){
        state.cart[index].count += 1
        console.log("incremented item count")
      }
    },
    cartDecrement({state, dispatch}, id){
      let index = state.cart.findIndex(item => item.id === id);
      if(index !== -1){
        if(state.cart[index].count <= 1){
          dispatch('removeFromCart', id)
        } else {
          state.cart[index].count -= 1
          console.log("decremented item count")
        }
      }
    }
  }
})
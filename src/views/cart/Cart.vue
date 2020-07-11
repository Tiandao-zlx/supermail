<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";

import CartList from "./childComps/CartList";
import CartBottomBar from "./childComps/CartBottomBar"

import { mapGetters } from "vuex";
export default {
  name: "cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // ...mapGetters(['cartLength','cartList'])
    ...mapGetters({
      length: "cartLength"
    })
  }
};
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: white;
  /* font-weight: 700; */
}
</style>

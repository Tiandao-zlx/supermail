<template>
    <scroll class="cart-list" ref="scroll">
      <!-- <li v-for="item in list">{{item}}</li> -->
      <cart-list-item v-for="(item,index) in list" :key="index" :itemInfo="item"></cart-list-item>
    </scroll>
</template>

<script>

import CartListItem from "./CartListItem"

import { mapGetters } from "vuex";
import Scroll from "../../../components/common/scroll/Scroll";

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    // ...mapGetters(['cartLength','cartList'])
    ...mapGetters({
      list: "cartList"
    })
  }
};
</script>

<style>
 .cart-list {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 93px;
    overflow: hidden;
  }
</style>

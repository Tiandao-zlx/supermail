<template>
  <div class="cart-bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">合计：{{totalPrice}}</div>
    <div class="calculate" @click="calcClick">去结算：{{checkLength}}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import CheckButton from "../../../components/content/checkButton/CheckButton";
export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return (
        "￥" +
        this.$store.getters.cartList
          .filter(item => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            console.log(item.price)
            console.log(item)
            return preValue + item.price * item.count;
          }, 0)
      );
    },
    checkLength() {
      return this.$store.getters.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      // return !(this.cartList.filter(item => !item.checked).length)
      if(this.cartList.length === 0) return false
      return !this.cartList.find(item => !item.checked);
    }
  },
  methods:{
    checkClick(){
      // console.log('全选')
      if(this.isSelectAll){//全部选中变成全部不选中
      this.cartList.forEach(item => item.checked = false)
      }else {
        this.cartList.forEach(item => item.checked = true)
      }

    },
    calcClick(){
      if(!this.isSelectAll){
        this.$toast.show('请选择购买的商品',2000)
      }
    }
  }
};
</script>

<style scoped>
.cart-bottom-bar {
  width: 100%;
  height: 44px;
  background-color: #eee;
  position: fixed;
  bottom: 49px;
  line-height: 44px;
  display: flex;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 22px;
  margin-right: 5px;
}
.price {
  margin-left: 10px;
  flex: 1;
}
.calculate {
  width: 90px;
  background-color: salmon;
  text-align: center;
}
</style>

<template>
  <div class="tab-bar-item">
    <div v-if="isActive" @click="itemClick"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>

  </div>

</template>

<script>
    export default {
        name: "TabBarItem",
        props:{
          path:String,
          activeColor:{
            type:String,
            default:'red'
          }
        },
      data(){
          return{
            // isActive:true
          }
      },
      computed:{
          isActive(){
            return this.$route.path.indexOf(this.path)
          },
          activeStyle(){
            return !(this.isActive) ? {color:this.activeColor} :{}
          }
      },
      methods:{
          itemClick(){
            this.$router.push(this.path)
          }
      }
    }
</script>

<style scoped>
  .tab-bar-item{
    flex: 1px;
    text-align: center;
    height: 49px;
    font-size: 12px;
    color: darkgray;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
  }
  /*.active{*/
  /*  color: orange;*/
  /*}*/
</style>

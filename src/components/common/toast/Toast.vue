<template>
  <div class="toast" v-if="isShow">{{message}}</div>
</template>

<script>
export default {
  name: "Toast",
  props: {
    // message:{
    //   type:String,
    //   default:''
    // },
    // show:{
    //   type:Boolean,
    //   default:false
    // }
  },
  data(){
    return {
      message:'',
      isShow:false
    }
  },
  methods:{
    show(message,duration=2000){
      console.log('打印i')
      this.isShow = true
      this.message = message
      console.log(this.message)
      setTimeout(()=>{
        this.isShow = false,
        this.message = ''
      },duration)
    }
  }
};
</script>

<style>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px 10px;
  font-size: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
}
</style>

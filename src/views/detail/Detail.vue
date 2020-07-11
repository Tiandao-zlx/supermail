<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">


      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <!-- <toast :message="message" :show="show"></toast> -->

  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "../../components/common/scroll/Scroll";
// import Toast from "../../components/common/toast/Toast";
import GoodsList from "../../components/content/goods/GoodsList";

import { backTopMixin } from "../../common/mixin";

import { debounce } from "../../common/utils";

import { mapActions } from "vuex"

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "../../network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    // Toast,
    Scroll
  },
  mixins: [backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopYs: null,
      // message:'',
      // show:false
      // currentIndex:null
    };
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh();
      //防抖
      this.getThemeTopYs();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500);
    },
    contentScroll(position) {
      const positionY = -position.y;
      if (positionY < this.themeTopYs[1]) {
        this.$refs.nav.currentIndex = 0;
      } else if (positionY < this.themeTopYs[2]) {
        this.$refs.nav.currentIndex = 1;
      } else if (positionY < this.themeTopYs[3]) {
        this.$refs.nav.currentIndex = 2;
      } else {
        this.$refs.nav.currentIndex = 3;
      }
      //判断简写
      // let length = this.themeTopYs.length
      // for(let i = 0;i<length;i++){
      //   if(this.currentIndex !== i && ((i<length-1 && positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1] || i>length-1 && positionY>=this.themeTopYs[i]))){
      //     console.log(i)
      //     this.currentIndex = i
      //     this.$refs.nav.currentIndex = currentIndex
      //   }
      // }
    },
    contentScroll(position) {
      //判断backTop是否显示
      this.isShowBackTop = -position.y > 1000;
    },
    addToCart(){
      // console.log("5464653")
      //获取购物车列表需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid
      //将商品添加到购物车里(1.Promise 2.mapActions)
      // this.$store.commit('addCart',product)
      this.addCart(product).then(res => {
        console.log(res)

        // this.show = true;
        // this.message = res;
        // setTimeout(()=>{
        //   this.show = false
        //   this.message = ''
        // },1500)
        console.log(this.$toast);
        this.$toast.show(res,2000);
      })
      // this.$store.dispatch('addCart',product).then(res => {
      //   console.log(res)
      // })
    }
  },
  created() {
    //保存传入的iid
    // console.log(this.$route.params.iid)
    this.iid = this.$route.params.iid;
    //根据iid请求相关信息
    getDetail(this.iid).then(res => {
      console.log(res);
      const data = res.result;
      //获取顶部轮播图
      this.topImages = data.itemInfo.topImages;
      //获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      //获取店家信息
      this.shop = new Shop(data.shopInfo);
      //保存商品的详情数据
      this.detailInfo = data.detailInfo;
      //获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      //取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      // this.$nextTick(() => {
      //   this.themeTopYs = []
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //   console.log(this.themeTopYs)
      // });
    });
    getRecommend().then(res => {
      console.log(res);
      this.recommends = res.data.list;
    });
    //给Y赋值防抖
    this.getThemeTopYs = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      console.log(this.themeTopYs);
    }, 100);
  }
  // mounted(){
  //   this.themeTopYs.push(0),
  //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
  //   console.log(this.themeTopYs)
  // },
  // updated(){
  //   this.themeTopYs = []
  //   this.themeTopYs.push(0),
  //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
  //   console.log(this.themeTopYs)
  // }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: white;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 44px - 58px);
}
</style>

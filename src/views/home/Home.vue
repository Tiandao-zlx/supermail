<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" :titles="['流行','新品','精选']" @tabClick="tabClick" ref="tabControl1" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control  :titles="['流行','新品','精选']" @tabClick="tabClick" ref="tabControl2"></tab-control>
      <goods-list :goods="goods[currentType].list"></goods-list>
    </scroll>
    <!-- 对组件进行监听需要加.native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import featureView from "./childComps/featureView";

import Scroll from "../../components/common/scroll/Scroll";
import NavBar from "../../components/common/navbar/NavBar";
import TabControl from "../../components/content/tabControl/TabControl";
import GoodsList from "../../components/content/goods/GoodsList";
import BackTop from "../../components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "../../network/home";

import {debounce} from "../../common/utils"

import BScroll from "better-scroll";
import { backTopMixin } from '../../common/mixin';
export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    featureView,
    TabControl,
    GoodsList,
    Scroll,
  },
  mixins:[backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      tabOffsetTop:0,
      isTabFixed:false,
      saveY:0
    };
  },
  created() {
    //1.请求多个数据
    this.getHomeMultidata();
    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");


  },
  mounted(){
    //图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh,500)

    this.$bus.$on('itemImageLoad',()=>{
      refresh()
    })
    //读取tabControl的offsetTop
    //所有的组件都有一个属性$el ： 用于获取组件中的元素

  },
  activated(){
    this.$refs.scroll.scrollTo(0,this.saveY)
    console.log(this.saveY)
    this.$refs.scroll.refresh()
  },
  deactivated(){
    this.saveY = this.$refs.scroll.scroll.y
  },
  methods: {
    //事件监听相关方法



    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break
      }
      this.$refs.tabControl1.currentIndex = index ;
      this.$refs.tabControl2.currentIndex = index ;
    },

    contentScroll(position){
      //判断backTop是否显示
      this.isShowBackTop = (-position.y)>1000
      //决定tabControl是否吸顶（position：fixed）
      this.isTabFixed = (-position.y)>this.tabOffsetTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      // console.log(this.$refs.tabControl.$el.offsetTop)
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    //网络请求相关方法
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res)
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        console.log(res);
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp()
      });
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: white;
  /* 使用原生滚动时使用 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
/* .tab-control {
  position: sticky;
  top: 44px;
  background-color: #fff;
  z-index: 999;
} */
.tab-control{
  position: relative;
  top: 0px;
  z-index: 99;
  background-color: white;
}
.content {
  /* height: 300px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
}
/* .content{
  height:calc(100% - 93px) ;
  margin-top: 44px;
} */
.fixed{
  position:fixed;
  left: 0;
  right: 0;
  top: 44px;
}
</style>

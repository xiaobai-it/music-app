<template>
  <div class="recommend">
    <!--推荐页面-->
    <Scroll :data="GeDanData" class="recommend-content" ref="lunboDiv">
      <div>
        <!--轮播图,注意要有数据的时候，显示轮播才可以，否则只循环一次到末尾，就停止轮播了-->
        <div class="slider-wrapper" v-if="lunboImgs.length" >
          <swiper :options="swiperOption" ref="mySwiper" class="swiper-container">
            <!-- 轮播图片的个数 -->
            <swiperSlide v-for="(img,index) in lunboImgs" :key="index">
              <img :src="img.picUrl" @load="loadImg" alt="" class="lun-img" @click="clickImg(index)"/>
            </swiperSlide>
            <!-- 小圆点 -->
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <!--热门歌单推荐-->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul v-if="GeDanData.length">
            <li v-for="(item, index) in GeDanData" :key="index" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="" width="60" height="60"/>
              </div>
              <div class="text">
                <!--<h2 class="name" v-html="item.creator.name"></h2>-->
                <h2 class="name" v-html="item.creator.name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container">
        <Loading title="玩命加载中..." v-if="!GeDanData.length"></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import 'swiper/dist/css/swiper.css'
import {swiper, swiperSlide} from 'vue-awesome-swiper'

import {getRecommend, getHotGeDan} from '../../api/allAPI'
import Scroll from '../../components/scroll/scroll'
import Loading from '../../components/loading/loading'

export default {
  components: {
    swiper,
    swiperSlide,
    Scroll,
    Loading
  },
  data() {
    return {
      swiperOption: {
        // 所有的参数同 swiper 官方 api 参数
        loop: true,
        autoplay: {delay: 2000, disableOnInteraction: false},
        pagination: {el: '.swiper-pagination'},
        preventClicks: false,
        effect: 'coverflow'
      },
      lunboImgs: [],
      GeDanData: [],
      lunboimgloadfinish: false
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted() {
    // 获取轮播图的图片
    getRecommend().then((response) => {
      if (response.code === 0) {
        this.lunboImgs = response.data.slider
      }
    }).catch((err) => {
      console.log(err)
    })
    // 获取热门歌单的数据
    getHotGeDan().then((response) => {
      if (response.data.code === 0) {
        this.GeDanData = response.data.data.list
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  methods: {
    // 点击推荐页面轮播图，进行跳转
    clickImg (index) {
      const linkUrl = this.lunboImgs[index].linkUrl
      console.log(linkUrl)
      window.location.href = linkUrl
    },
    loadImg() {
      // 轮播图片加载完成的时候，让滚动重新刷新，保证，可以滚动到最底部
      if (!this.lunboimgloadfinish) {
        this.$refs.lunboDiv.refresh()
        this.lunboimgloadfinish = true
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .swiper-container >>> .swiper-pagination-bullet-active
    background: #ffcd32
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
        .swiper-container
          background-color: #000
          .lun-img
            width: 100%
            height :auto
      .recommend-list
        .list-title
          height: 50px
          line-height: 50px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 10px 20px 10px 20px
          border-bottom : 1px solid #000
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

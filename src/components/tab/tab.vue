<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend" >
      <span class="tab-link" @click="recommend">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link" @click="singer">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link" @click="rank">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link" @click="search">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
import PubSub from 'pubsub-js'
export default {
  methods: {
    recommend () {
      PubSub.publish('clickRecommendNav')
    },
    singer () {
      PubSub.publish('clickSingerNav')
    },
    rank () {
      PubSub.publish('clickRankNav')
    },
    search () {
      PubSub.publish('clickSearchNav')
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>

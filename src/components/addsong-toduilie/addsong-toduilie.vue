<template>
  <transition name="slide">
    <div class="add-song" v-show="showComponent" @click.stop >
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click.stop="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <!--搜索框组件-->
        <SearchKuang ref="searchkuang" placeholder="搜索歌曲" @queryValue="queryValue"/>
      </div>
      <div class="shortcut" >
        <!--2个大按钮组件-->
        <Switches v-show="!showSearchResult" :switches="switches" :currentIndex="currentIndex" @switch="switchItem"/>
        <div class="list-wrapper">
          <div class="list-scroll" v-if="currentIndex === 0">
            <div class="list-inner">
              <!--最近播放的歌曲的组件,歌曲列表组件-->
              <SongList :musicData="savePlaySongsRecently"/>
              <span v-show="!savePlaySongsRecently.length">您还没有播放过任何歌曲</span>
            </div>
          </div>
          <div class="list-scroll"  v-if="currentIndex === 1" ref="SearchHistoryList">
            <div class="list-inner">
              <!--搜索历史记录展示的组件-->
              <SearchHistoryList  :searchHistoryJiLu="searchHistoryJiLu"
                                  @clickOneSearchHistory="clickOneSearchHistory"
                                  @deleteOneSearchHistory="deleteOneSearchHistory"/>
            </div>
          </div>
        </div>
      </div>
      <div class="search-result" v-show="showSearchResult" >
        <!--搜索结果展示的组件-->
        <SearchResult :showSearchResult="showSearchResult" :catZhida="catZhida"
                      @myBeforeScrollStart="myBeforeScrollStart"
                      @saveSearchHistory="saveSearchHistory" ref="SearchResult"/>
      </div>
      <!--<top-tip>-->
        <!--<div class="tip-title">-->
          <!--<i class="icon-ok"></i>-->
          <!--<span class="text">1首歌曲已经添加到播放列表</span>-->
        <!--</div>-->
      <!--</top-tip>-->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapActions, mapState} from 'vuex'
import SearchKuang from '../search-kuang/search-kuang'
import SearchResult from '../search-result/search-result'
import Switches from '../switches/switches'
import SearchHistoryList from '../search-history-list/search-history-list'
import SongList from '../song-list/song-list'

export default {
  components: {
    SearchKuang,
    SearchResult,
    SearchHistoryList,
    Switches,
    SongList
  },
  data() {
    return {
      showComponent: false, // 是否显示当前组件
      showSearchResult: '', // 输入框输入的数据
      catZhida: false, // 搜索的时候是否显示歌手
      currentIndex: 0,
      switches: [{name: '最近播放'}, {name: '搜索历史'}]
    }
  },
  computed: {
    ...mapState(['searchHistoryJiLu', 'savePlaySongsRecently'])
  },
  methods: {
    ...mapActions(['saveSearchHistoryJiLU', 'deleteOneSearchHistoryJiLU']),
    // 点击显示当前组件，父组件mini-playlist调用
    show() {
      this.showComponent = true
    },
    // 点击隐藏当前组件
    hide() {
      this.showComponent = false
    },
    // 点击某一个搜索记录
    clickOneSearchHistory(item) {
      // 把点击的历史记录的一条赋值给showSearchResult，让seract-result组件去搜索数据
      this.showSearchResult = item
      // 把点击的历史记录的一条赋值给input框
      this.$refs.searchkuang.andSearchToInput(item)
    },
    // 删除某一个搜索记录
    deleteOneSearchHistory({delateItem, index}) {
      // 调用vuex中的actions.js文件中的方法，删除点击的历史记录
      console.log('点击了')
      this.deleteOneSearchHistoryJiLU({delateItem, index})
    },
    // search-kuang组件传递过来的函数，保存输入框输入的值
    queryValue(newQuery) {
      this.showSearchResult = newQuery
    },
    // 搜索页面加载出来数据后，是否需要滚动，如果滚动，在滚动之前隐藏手机键盘
    myBeforeScrollStart() {
      this.$refs.searchkuang.blurInput()
    },
    // 把搜框输入的值，保存在vuex中的searchHistoryJiLu中，然后在历史组件中显示出来搜索记录
    saveSearchHistory() {
      this.saveSearchHistoryJiLU(this.showSearchResult)
    },
    // 中间的2个大按钮的切换
    switchItem (index) {
      this.currentIndex = index
    }
  },
  watch: {
    // 监视input输入框值的改变,一旦改变并且有值,搜索历史记录组件就隐藏
    showSearchResult () {
      if (this.showSearchResult === '') {
        this.$refs.SearchHistoryList.style.display = 'block'
      } else {
        this.$refs.SearchHistoryList.style.display = 'none'
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>

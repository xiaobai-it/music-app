<template>
  <div class="search">
    <!--搜索页面-->
    <div class="search-box-wrapper">
      <!--搜索框组件-->
      <Searchkuang ref="searchkuang" @queryValue="queryValue"/>
    </div>
    <div class="shortcut-wrapper" v-if="!showSearchResult">
      <div class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul v-show="hotKey">
              <li class="item" v-for="(item, index) in hotKey" :key="index" @click="andSearchToInput(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history">
            <h1 class="title">
          <span class="text">
            搜索历史 10 / {{searchHistoryJiLu.length > 0 ?searchHistoryJiLu.length : ''}}
          </span>
              <span class="clear">
            <i class="icon-clear"></i>
          </span>
            </h1>
            <!--显示搜索历史的组件-->
            <SearchHistoryList :searchHistoryJiLu="searchHistoryJiLu"/>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="search-result" v-if="showSearchResult">-->
    <div class="search-result">
      <!--显示搜索结果的组件-->
      <SearchResult :showSearchResult="showSearchResult"
                    @myBeforeScrollStart="myBeforeScrollStart"
                    @saveSearchHistory="saveSearchHistory"/>
    </div>
    <!--<confirm text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Searchkuang from '../../components/search-kuang/search-kuang'
import SearchResult from '../../components/search-result/search-result'
import SearchHistoryList from '../../components/search-history-list/search-history-list'
import {getHotKey} from '../../api/allAPI'
import {mapActions, mapState} from 'vuex'
// import Scroll from '../../components/scroll/scroll'

export default {
  components: {
    Searchkuang,
    SearchResult,
    SearchHistoryList
    // Scroll
  },
  data() {
    return {
      hotKey: [], // 热门搜索数据
      showSearchResult: '' // 输入框输入的数据
    }
  },
  mounted() {
    // 获取搜索首页下的热门搜索内的的后台数据的函数
    getHotKey().then((response) => {
      if (response.code === 0) {
        this.hotKey = response.data.hotkey.slice(0, 10)
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  computed: {
    ...mapState(['searchHistoryJiLu', 'searchHistoryJiLu'])
  },
  methods: {
    ...mapActions(['saveSearchHistoryJiLU']),
    // 点击热门搜索，把值添加到搜索框内
    andSearchToInput(value) {
      this.$refs.searchkuang.andSearchToInput(value)
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
    }
  },
  watch: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      z-index: 10
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          z-index: 9
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>

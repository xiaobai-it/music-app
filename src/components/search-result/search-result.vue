<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result"  :key="index">
        <div class="icon">
          <i :class="showIconCls(item)" ></i>
        </div>
        <div class="name">
          <p class="text">{{showSongAndSinger(item)}}</p>
        </div>
      </li>
      <Loading title="玩命加载中..." v-if="!result"></Loading>
    </ul>
    <div class="no-result-wrapper">
      <!--<no-result title="抱歉，暂无搜索结果"></no-result>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from '../loading/loading'
import {getSearchResult} from '../../api/allAPI'

export default {
  components: {
    Loading
  },
  props: {
    catZhida: { // 搜索的时候是否显示歌手
      type: Boolean,
      default: true
    },
    showSearchResult: { // 搜索输入框输入的数据
      type: String,
      default: ''
    }
  },
  data() {
    return {
      page: 1, // 查询第几页的数据
      result: [] // 保存搜索结果
    }
  },
  mounted () {
  },
  methods: {
    // 显示不同的图标
    showIconCls (item) {
      if (item.type === 'singer') {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    showSongAndSinger (item) {
      if (item.type === 'singer') {
        return item.singername
      } else {
        return `${item.songname} - ${this.dealSinger(item.singer)}`
      }
    },
    // 把后台得到的数据中歌手名字进行处理，返回字符串
    dealSinger(singers) {
      let singerStr = []
      singers.forEach((singer) => {
        singerStr.push(singer.name)
      })
      return singerStr.join('/')
    },
    // 接收到搜索框内的数据后，发起请求，获取对应的后台数据
    getSearch () {
      // 接收到搜索框内的数据后，发起请求，获取对应的后台数据
      getSearchResult(this.showSearchResult, this.catZhida, this.page).then((response) => {
        const songObj = response.data.data.song.list
        const singerObj = response.data.data.zhida
        let finalArr = []
        if (response.data.code === 0) {
          if (singerObj && singerObj.singerid) {
            finalArr.push({...singerObj, ...{type: 'singer'}})
          }
          if (songObj && songObj.length > 0) {
            finalArr = finalArr.concat(songObj)
          }
        }
        this.result = finalArr
        console.log(this.result)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  watch: {
    // 搜索内容改变的时候，去获取数据，输入框数据的传递顺序：
    // search-kuang组件分发一个事件queryValue 到search组件
    // search组件设置一个变量showSearchResult接收传递过来的搜索值，然后把变量showSearchResult当成属性传递给search0result组件
    // search0result接收showSearchResult属性并且监视这个属性值的改变，然后调用getSearchResult方法获取搜索数据
    // showSearchResult (newValue, oldValue) {
    //   if (newValue !== oldValue) {
    //     console.log('值改变了')
    //     this.getSearch()
    //   }
    // }
    showSearchResult () {
      console.log('值改变了')
      this.getSearch()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        bottom :1px solid #ccc
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

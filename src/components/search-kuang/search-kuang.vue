<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <!--输入框-->
    <input class="box" v-model="query" :placeholder="placeholder" ref="input"/>
    <!--删除按钮-->
    <i class="icon-dismiss" v-if="query" @click="clearInputValue"></i>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    placeholder: {
      type: String,
      default: '点击搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  // created () {
  //   console.log(this.query)
  //   this.$watch('query', (newQuery) => {
  //     console.log(newQuery)
  //     // 输入框的数据改变的时候，发送输入的数据query 给search-result组件
  //     this.$emit('queryValue', newQuery)
  //   })
  // },
  methods: {
    // 清除搜索内容
    clearInputValue () {
      this.query = ''
    },
    // 点击热门搜索，把值添加到搜索框内
    andSearchToInput (value) {
      this.query = value
    }
  },
  watch: {
    query () {
      // 输入框的数据改变的时候，发送输入的数据query 给search-result组件
      this.$emit('queryValue', this.query)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>

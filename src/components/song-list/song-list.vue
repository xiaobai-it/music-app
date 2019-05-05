<template>
  <!--通用的歌曲列表组件-->
  <div class="song-list">
    <ul>
      <li class="item" v-for="(item, index) in musicData" :key="index" @click="clickOneSong(item,index)">
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">歌手:{{item.singer}} / 所属专辑:{{item.album}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    musicData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    console.log(this.musicData)
  },
  methods: {
    clickOneSong(item, index) {
      this.$emit('clickOneSong', item, index)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height:60px
      font-size:$font-size-medium
      border-bottom :1px solid #000
      .content
        flex:1
        align-items: center
        .name
          padding :0 0 10px 0
          font-size :$font-size-small
        .desc
          font-size :$font-size-small
          color :$color-dialog-background
</style>

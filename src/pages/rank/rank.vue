<template>
  <div class="rank" ref="rank">
    <!--排行页面-->
    排行页面
    <!--<scroll :data="topList" class="toplist" ref="toplist">-->
      <!--<ul>-->
        <!--<li @click="selectItem(item)" class="item" v-for="item in topList">-->
          <!--<div class="icon">-->
            <!--<img width="100" height="100" v-lazy="item.picUrl"/>-->
          <!--</div>-->
          <!--<ul class="songlist">-->
            <!--<li class="song" v-for="(song,index) in item.songList">-->
              <!--<span>{{index + 1}}</span>-->
              <!--<span>{{song.songname}}-{{song.singername}}</span>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</li>-->
      <!--</ul>-->
      <!--<div class="loading-container" v-show="!topList.length">-->
        <!--<loading></loading>-->
      <!--</div>-->
    <!--</scroll>-->
    <!--<router-view></router-view>-->
  </div>
</template>

<script type="text/ecmascript-6">

export default {
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

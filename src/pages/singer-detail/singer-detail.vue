<template>
  <transition name="qwd">
    <!--歌手详情页面-->
    <div>
      <musicList :musicData="musicData" :bgImg="bgImg" :singer-name="singerName" ref="musicList"/>
    </div>
  </transition>
</template>

<script>
import {mapState} from 'vuex'

import {getSingerDetail} from '../../api/allAPI'
import musicList from '../../components/music-list/music-list'

export default {
  components: {
    musicList
  },
  data() {
    return {
      musicData: [] // 把后台得到的数据进行处理，得到我自己想要的歌手详情
    }
  },
  mounted() {
    // 获取歌手对应的详情数据
    if (!this.singer.id) {
      this.$router.push('/singer')
    } else {
      getSingerDetail(this.singer.id)
        .then((respose) => {
          if (respose.code === 0) {
            const list = respose.data.list
            console.log(list)
            // console.log(list[0]['musicData'].strMediaMid)
            // 把后台得到的数据进行处理，得到我自己想要的数据
            list.forEach((item) => {
              let obj = {} // 创建一个对象保存需要的数据
              obj.id = item.musicData.songid
              obj.mid = item.musicData.songmid
              obj.singer = this.dealSinger(item.musicData.singer)
              obj.name = item.musicData.songname
              obj.album = item.musicData.albumname
              obj.duration = item.musicData.interval
              obj.image = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.musicData.albummid}.jpg?max_age=2592000`
              // obj.url = `http://ws.stream.qqmusic.qq.com/${item.musicData.songid}.m4a?fromtag=46`
              // obj.url = `http://dl.stream.qqmusic.qq.com/C400${item.musicData.songmid}.m4a?vkey=${songVkey}&guid=7981028948&uin=0&fromtag=66`
              // 上面2个歌曲播放地址不可用了，下面的可用，参考网址：https://blog.csdn.net/xiayiye5/article/details/79487560
              obj.url = `https://api.bzqll.com/music/tencent/url?key=579621905&id=${item.musicData.songmid}&br=320`
              // obj.url = `https://api.bzqll.com/music/tencent/url?key=579621905&id=${item.musicData.songmid}&br=320`
              this.musicData.push(obj)
            })
            // console.log(this.singer)
            console.log(this.musicData)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  computed: {
    ...mapState(['singer']), // 从vuex中获取点击的某一个歌手的信
    // 传递给music-list的属性
    bgImg() {
      return this.singer.avatar
    },
    // 传递给music-list的属性
    singerName() {
      return this.singer.name
    }
  },
  methods: {
    // 把后台得到的数据中歌手名字进行处理，返回字符串
    dealSinger(singers) {
      let singerStr = []
      singers.forEach((singer) => {
        singerStr.push(singer.name)
      })
      return singerStr.join('/')
    }
  },
  watch: {
    musicData () {
      const bottom = this.musicData.length > 0 ? '60px' : ''
      // 找到musicList组件的子元素需要滚动的div，设置bottom为60px
      // this.$refs.musicList.$el.style.bottom = bottom
      this.$refs.musicList.$children[0].$el.style.bottom = bottom
      this.$refs.musicList.singerDetailDiaoYong()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
  .qwd-enter-active, .qwd-leave-active
    transition: all 0.5s ease

  .qwd-enter, .qwd-leave-to
    transform: translate(100%, 0)
</style>

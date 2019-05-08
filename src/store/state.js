import {playMode} from '../common/js/playModeConfig' // 播放器的播放模式配置

const state = {
  singer: {}, // 歌手数据
  playing: false, // 歌曲是否在播放
  fullScreen: false, // 是否全屏播放
  playList: [], // 播放歌曲的数组，有三种:顺序、随机、单曲循环
  sequenceList: [], // 顺序播放歌曲的数组
  mode: playMode.sequence, // 默认顺序播放
  currentIndex: -1, // 当前歌曲播的索引,当前播放的歌曲（currentSong），通过vuex的计算属性getters获取
  oneHotGeDanTuiJianData: {}, // 推荐首页界面中,某一个热门歌单推荐的数据
  oneTopList: {} // 排行首页界面中,某一个排行的数据
}
export default state

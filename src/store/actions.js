import {SET_SINNER, SET_PLAYING, SET_FULLSCREEN,
  SET_PLAYLIST, SET_SEQUENCELIST, SET_CURRENTINDEX, SET_MODE,
  SET_HOTGEDANTUIJIANDATAACTIONS, SET_ONETOPLIST,
  SET_SAVESEARCHHISTORYJILU} from './actions-types'
import {playMode} from '../common/js/playModeConfig'
import {songsRandomPaiXu} from '../common/js/songsRandomPaiXu'
import {saveSearchHistory} from '../common/js/all-search-history'

const actions = {
  setSinger ({commit, state}, singerData) {
    commit(SET_SINNER, {singerData})
  },
  // 点击歌曲，显示播放器界面
  clickOneSongShowPlay ({commit, state}, {musicData, index}) {
    if (state.mode === playMode.random) {
      let arrRandomPaiXu = songsRandomPaiXu(musicData)
      commit(SET_PLAYLIST, {musicData: arrRandomPaiXu})
      index = arrRandomPaiXu.findIndex((oneSong) => {
        return oneSong.id === musicData[index].id
      })
    } else {
      commit(SET_PLAYLIST, {musicData})
    }
    commit(SET_PLAYING, true)
    commit(SET_FULLSCREEN, true)
    commit(SET_SEQUENCELIST, {musicData})
    commit(SET_CURRENTINDEX, {index})
  },
  clickRandomPlaySongs ({commit, state}, {musicData}) {
    let arrRandomPaiXu = songsRandomPaiXu(musicData)
    commit(SET_PLAYLIST, {musicData: arrRandomPaiXu})
    commit(SET_MODE, {mode: playMode.random})
    commit(SET_CURRENTINDEX, {index: 0})
    commit(SET_SEQUENCELIST, {musicData})
    commit(SET_PLAYING, true)
    commit(SET_FULLSCREEN, true)
  },
  setPlaying ({commit, state}, isPlaying) {
    commit(SET_PLAYING, isPlaying)
  },
  setFullscreen ({commit, state}, isFullScreen) {
    commit(SET_FULLSCREEN, isFullScreen)
  },
  setPlaylist ({commit, state}, musicData) {
    commit(SET_PLAYLIST, {musicData})
  },
  // setSequencelist ({commit, state}, sequenceList) {
  //   commit(SET_SEQUENCELIST, {sequenceList})
  // },
  setMode ({commit, state}, mode) {
    commit(SET_MODE, {mode})
  },
  setCurrentindex ({commit, state}, index) {
    commit(SET_CURRENTINDEX, {index})
  },
  // 推荐界面中,某一个热门歌单推荐的数据
  hotGeDanTuiJianDataActions ({commit, state}, hotGeDanTuiJianDataActions) {
    commit(SET_HOTGEDANTUIJIANDATAACTIONS, hotGeDanTuiJianDataActions)
  },
  // 排行首页界面中,某一个排行的数据
  oneTopList ({commit, state}, oneTopList) {
    commit(SET_ONETOPLIST, oneTopList)
  },
  // 搜索页面搜索到数据后，点击某一个歌曲，跳转到播放页面，播放点击的歌曲
  searchResultClickOneSongInsertAndToPlayPage({commit, state}, searchOneSong) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 得到当前播放的歌曲
    let currentSong = playList[currentIndex]
    // 得到点击搜索界面的歌曲的id，判断是否在playlist数组里面,在返回playlist数组对应的索引，不在返回-1
    let yuanLaiIndex = playList.findIndex((oneSong) => {
      return oneSong.id === searchOneSong.id
    })
    // 把搜索界面点击的歌曲添加到playlist数组里面
    currentIndex++
    playList.splice(currentIndex, 0, searchOneSong)
    // 判断搜索界面点击的歌曲是否在playlist数组里面
    if (yuanLaiIndex !== -1) {
      // 说明在playlist数组里面
      if (currentIndex > yuanLaiIndex) {
        // 如果插入的歌曲的索引，大于playlist数组里面之前就存在的对应的歌曲的索引
        playList.splice(yuanLaiIndex, 1)
        currentIndex--
      } else {
        playList.splice(yuanLaiIndex + 1, 1)
      }
    }
    // 把搜索界面点击的歌曲添加到sequenceList数组里面
    // 得到需要插入到sequenceList数组里面的位置（当前播放歌曲的索引+1）
    let chaRuSequenceListIndex = sequenceList.findIndex((oneSong) => {
      return oneSong.id === currentSong.id
    }) + 1
    // 得到点击搜索界面的歌曲的id，判断是否在sequenceList数组里面,在返回sequenceList数组对应的索引，不在返回-1
    let yuanLaiSequenceListIndex = sequenceList.findIndex((oneSong) => {
      return oneSong.id === searchOneSong.id
    })
    // 把搜索界面点击的歌曲添加到sequenceList数组里面当前播放歌曲的下一个位置
    sequenceList.splice(chaRuSequenceListIndex, 0, searchOneSong)
    // 判断搜索界面点击的歌曲是否在sequenceList数组里面
    if (yuanLaiSequenceListIndex !== -1) {
      // 说明在sequenceList数组里面
      if (chaRuSequenceListIndex > yuanLaiSequenceListIndex) {
        // 如果插入的歌曲的索引，大于sequenceList数组里面之前就存在的对应的歌曲的索引
        sequenceList.splice(yuanLaiSequenceListIndex, 1)
        yuanLaiSequenceListIndex--
      } else {
        sequenceList.splice(yuanLaiSequenceListIndex + 1, 1)
      }
    }
    commit(SET_PLAYING, true)
    commit(SET_FULLSCREEN, true)
    commit(SET_PLAYLIST, {musicData: playList})
    commit(SET_SEQUENCELIST, {musicData: sequenceList})
    commit(SET_CURRENTINDEX, {index: currentIndex})
  },
  // 保存搜索记录到vuex中的searchHistoryJiLu和本地缓存localstorage中
  saveSearchHistoryJiLU ({commit, sate}, searchValue) {
    // 获取、设置本地缓存的值、对搜索记录的总数和顺序进行规定
    const searchHistoryArr = saveSearchHistory(searchValue)
    // 提交搜索记录
    commit(SET_SAVESEARCHHISTORYJILU, searchHistoryArr)
  }
}
export default actions

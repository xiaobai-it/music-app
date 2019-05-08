import {SET_SINNER, SET_PLAYING, SET_FULLSCREEN,
  SET_PLAYLIST, SET_SEQUENCELIST, SET_CURRENTINDEX, SET_MODE,
  SET_HOTGEDANTUIJIANDATAACTIONS, SET_ONETOPLIST} from './actions-types'
import {playMode} from '../common/js/playModeConfig'
import {songsRandomPaiXu} from '../common/js/songsRandomPaiXu'

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
  }
}
export default actions

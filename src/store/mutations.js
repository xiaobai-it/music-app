import {SET_SINNER, SET_PLAYING, SET_FULLSCREEN,
  SET_PLAYLIST, SET_SEQUENCELIST, SET_MODE, SET_CURRENTINDEX,
  SET_HOTGEDANTUIJIANDATAACTIONS} from './actions-types'

const mutations = {
  [SET_SINNER] (state, {singerData}) {
    state.singer = singerData
  },
  [SET_PLAYING] (state, isPlaying) { // true or false
    state.playing = isPlaying
  },
  [SET_FULLSCREEN] (state, isFullScreen) { // true or false
    state.fullScreen = isFullScreen
  },
  [SET_PLAYLIST] (state, {musicData}) {
    state.playList = musicData
  },
  [SET_SEQUENCELIST] (state, {musicData}) {
    state.sequenceList = musicData
  },
  [SET_MODE] (state, {mode}) {
    state.mode = mode
  },
  [SET_CURRENTINDEX] (state, {index}) {
    state.currentIndex = index
  },
  [SET_HOTGEDANTUIJIANDATAACTIONS] (state, hotGeDanTuiJianDataActions) {
    state.oneHotGeDanTuiJianData = hotGeDanTuiJianDataActions
  }
}
export default mutations

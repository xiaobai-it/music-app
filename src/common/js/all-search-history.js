import goodStoroge from 'good-storage'

export function saveSearchHistory(searchValue) {
  // 获取本地缓存的值
  let finalSearch = goodStoroge.get('mySearchHistory', [])
  // 对搜索记录的总数和顺序进行规定
  // 找到新的搜索值，在本地缓存中的数组中，对应的索引
  let index = finalSearch.findIndex((item) => {
    return item === searchValue
  })
  if (index === 0) { // 本地缓存中的数组中的第一条数据
    return
  }
  if (index > 0) { // 存在的索引不是第一个，把它删除
    finalSearch.splice(index, 1)
  }
  // 向数组的第一个位置，插入最新的搜索记录
  finalSearch.unshift(searchValue)
  // 数组中的搜搜距离大于10条，全部去掉，只留10条
  if (finalSearch.length > 10) {
    finalSearch.pop()
  }
  // 把最新的搜索记录保存到本地缓存的mySearchHistory数组中
  goodStoroge.set('mySearchHistory', finalSearch)

  return finalSearch // 返回是搜索记录的数组
}
// vuex初始化的时候，获取之前本地已经存储的搜索记录
export function getSearchHistoryFromLocalStroage() {
  return goodStoroge.get('mySearchHistory', [])
}
// 在vuex中的searchHistoryJiLu和本地缓存localstorage中，删除一条搜索记录
export function deleteOneSearchHistoryJiLU({delateItem, index}) {
  // 读取本地缓存的值
  let finalSearch = goodStoroge.get('mySearchHistory', [])
  // 删除一条记录
  finalSearch.splice(index, 1)
  // 把删除后的搜索记录保存到本地缓存的mySearchHistory数组中
  goodStoroge.set('mySearchHistory', finalSearch)

  return finalSearch // 返回是搜索记录的数组
}
// 在vuex中的searchHistoryJiLu和本地缓存localstorage中，删除所有搜索记录
export function deleteAllSearchHistoryJiLU() {
  // 删除所有本地缓存的值
  goodStoroge.remove('mySearchHistory')

  return [] // 返回vuex一个空数组
}

export function savePlaySongsRecently(currentPlaySong) {
  // 获取本地缓存的值
  let finalSearch = goodStoroge.get('savePlaySongsRecently', [])
  // 对搜索记录的总数和顺序进行规定
  // 找到新的搜索值，在本地缓存中的数组中，对应的索引
  let index = finalSearch.findIndex((item) => {
    return item.id === currentPlaySong.id
  })
  if (index === 0) { // 本地缓存中的数组中的第一条数据
    return
  }
  if (index > 0) { // 存在的索引不是第一个，把它删除
    finalSearch.splice(index, 1)
  }
  // 向数组的第一个位置，插入最新的搜索记录
  finalSearch.unshift(currentPlaySong)
  // 数组中的搜搜距离大于50条，全部去掉，只留50条
  if (finalSearch.length > 50) {
    finalSearch.pop()
  }
  // 把最新的搜索记录保存到本地缓存的savePlaySongsRecently数组中
  goodStoroge.set('savePlaySongsRecently', finalSearch)

  return finalSearch // 返回是最近播放歌曲的数组
}
// vuex初始化的时候，获取之前本地已经存储的搜索记录
export function getSavePlaySongsRecently() {
  return goodStoroge.get('savePlaySongsRecently', [])
}

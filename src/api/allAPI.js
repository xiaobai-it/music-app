import jsonp from '../common/js/jsonp'
import axios from 'axios'

// 获取推荐页面,轮播图对应的后台数据的函数
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const queryParams = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  // 是jsonp请求的时候，传递的参数
  const options = {
    param: 'jsonpCallback'
  }
  // 调用封装之后的jsonp
  return jsonp(url, queryParams, options)
}
// 获取推荐页面,热门歌单对应的后台数据的函数
export function getHotGeDan() {
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  // 正常访问QQAPI失败，因此用的webpack的代理解决的，在build/webpack.dev.conf.js里配置
  const url = '/api/getHotGeDan'
  const queryParams = {
    g_tk: 5381,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sin: 0,
    ein: 19
  }
  return axios.get(url, {params: queryParams})
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

// 获取歌手页面对应的后台数据的函数
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const queryParams = {
    g_tk: 5381,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0
  }
  // 是jsonp请求的时候，传递的参数
  const options = {
    param: 'jsonpCallback'
  }
  // 调用封装之后的jsonp
  return jsonp(url, queryParams, options)
}
// 获取歌手详情对应的后台数据的函数
export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const queryParams = {
    g_tk: 5381,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    ct: 24,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 100
  }
  // 是jsonp请求的时候，传递的参数
  const options = {
    param: 'jsonpCallback'
  }
  // 调用封装之后的jsonp
  return jsonp(url, queryParams, options)
}
// 获取歌曲的歌词对应的后台数据的函数
export function getLyric(mid) {
  // 正常访问QQ音乐歌词API失败，因此用的webpack的代理解决的，在build/webpack.dev.conf.js里配置
  const url = '/api/lyric'
  const queryParams = {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  }
  return axios.get(url, {params: queryParams})
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

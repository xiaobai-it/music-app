# 项目名称:music-app

> 简介:移动端音乐播放器

### 目前还存在的Bug：

1. 搜索到数据后，随意点击一个进入播放或歌手页面，然后回退回来之后，在次随意点击一个搜索到的数据报错
   提示【"TypeError: Cannot read property 'length' of undefined"】，导致清空input框失效
   点击已经存在的搜索历史记录，然后在点击某一首歌，也会报上述的错误?
---
2. 每次重新切换到推荐页面，推荐页面的轮播图都会卡住，不轮播，自己手动拖动一下才可以?
> 解决办法：https://blog.csdn.net/qq_35893561/article/details/87920797
---
3. mini播放器的列表界面，滚动到正在播放的歌曲的时候，每次点击总是会多滚动14个，很奇怪，所以我一个方法用了2次一个方法里面把索引减去了14，但是代码冗余了，是有问题的？
---
4. 歌手的首页界面中，右侧的26的字母，从下向上滚动有问题?
---
5. 多次从搜索结果中点击歌曲播放，会出现歌词回滚的问题?
---

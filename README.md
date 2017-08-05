# Neighborhood Map 
## 项目介绍
    本项目为Udacity前端进阶课程中的项目三，使用knockout框架，采用MVVM的设计模式和google地图实现搜素地图，可以检索关注的地点，并在地图中同步显示。
## 使用说明
1. 使用浏览器打开index.html文件（记得要翻墙哟），浏览器回出现以下画面；
![image](https://github.com/ShoutangYang/UdacityP3/raw/master/resouce/1.JPG)
2. 在搜索地址栏中输入想要搜索的城市，例如，在这里搜索 ' 大理'；
![image](https://github.com/ShoutangYang/UdacityP3/blob/master/resouce/2.JPG)
3. 输入'大理'后，点击搜索按钮，在地图上会标记出本城市的景点的坐标，点击相应的坐标，坐标后运动哪个，并提示相应的介绍信息；
![image](https://github.com/ShoutangYang/UdacityP3/raw/master/resouce/3.JPG)
4. 点击‘Toggle List’按钮，在下方会显示相应的列表以及文字信息；
![image](https://github.com/ShoutangYang/UdacityP3/blob/master/resouce/4.JPG)
5. 在已经标记的景点中搜素感兴趣的景点，在过滤栏中输入'剑川'，地图中只会显示相关的景点，不相关的景点将隐藏；
![image](https://github.com/ShoutangYang/UdacityP3/blob/master/resouce/5.JPG)
6. 当然，我们可以搜索国内的各个城市，不只局限与Neighborhood；
![image](https://github.com/ShoutangYang/UdacityP3/blob/master/resouce/7.JPG)

## 采用的第三方组件
1. google map ->坐标景点标记和坐标动作
2. knockout -> MVVM，View和Data双向绑定
3. jQuery. ->通过ajax返回检索城市的景点信息





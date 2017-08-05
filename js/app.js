/**
 * Created by shoutang.yang on 2017/7/24.
 */
//global
var map;
//TODO:1.初始化地图中心区域为大理 ;2.执行 ko.applyBindings，view和data 开始双向绑定；
function initMap() {
    //location dali  lat；26.54116187 lng:99.88626619
     var uluru ={lat:25.6935,lng:100.17};
      map = new google.maps.Map(document.getElementById('map'),{
      zoom:8,
      center:uluru
  });
    ko.applyBindings( new ViewModel());
};

/*1.使用knockout 库，整个app采用MV-VM设计思想，将数据和视图分开;
  2.listView同ilterrEsult绑定，数据有变化，将在filter视图中有同步变化；
  3.isVisible同listView是否可见绑定，实现togleVisibility控制隐藏和显示；
 */
var ViewModel =function () {
    var self = this;
    self.stations = ko.observableArray([]);
    self.filter = ko.observable('');
    self.loadingMsg = ko.observable('loading result...');
    self.isVisible = ko.observable(true);

    self.isVisible(false);
    self.loadingMsg("Place input search position.");

    self.filterResult =ko.computed(function () {
        var matches=[];
        var re = new RegExp(self.filter(),'i');
        self.stations().forEach(function (station) {

            if(station.name.search(re)!==-1){
                matches.push(station);
                station.mapMarker.setVisible(true);
            }else {
                station.mapMarker.setVisible(false);
                if(AddMarkerToMap.prototype.activate===station){
                    station.deactive();
                }
            }
        });
        console.log(matches);
        return matches;
    });

    self.toggleVisibility = function() {
        self.isVisible(!self.isVisible());
    };
    self.clickHandle = function () {

    };
    /*
    * 使用第三方接口获取检索城市的景点信息，并将景点标记在地图上
    * */
    GetLocation=function (location) {
        //var ulr='http://route.showapi.com/268-1?showapi_appid=35746&showapi_sign=2dff955bc86547acbba133deba178401&keyword=%E5%89%91%E5%B7%9D&proId=&cityId=&areaId=&';
        var ulr ='http://route.showapi.com/268-1?showapi_appid=35746&showapi_sign=2dff955bc86547acbba133deba178401&keyword='+encodeURIComponent(location)+'&proId=&cityId=&areaId=&'
           $.getJSON(ulr,function (data) {
               var stations =[];
               var station;
               var bounds = new google.maps.LatLngBounds();
                console.log(data);

               // console.log(data.showapi_res_body.pagebean.contentlist.length);
               data.showapi_res_body.pagebean.contentlist.forEach(function ( dataObj) {
                   station = new AddMarkerToMap(dataObj);
                   stations.push(station);
                    bounds.extend(station.mapMarker.position);
               })

               console.log(stations);
               console.log(location);
               self.stations(stations);
               map.fitBounds(bounds);
            }).fail(function() {
               self.loadingMsg('Unable to load data... try refreshing');
               console.log('ERROR: Could not acquire subway station data');
           });
    };
   // GetLocation('大理');
    document.getElementById('search').addEventListener('click', function () {
        console.log('in here');
        console.log("the search->"+document.getElementById('position').value);
        console.log(map);
        var uluru ={lat:25.6935,lng:100.17};
        map = new google.maps.Map(document.getElementById('map'),{
            zoom:8,
            center:uluru
        });

        GetLocation(document.getElementById('position').value);
        self.loadingMsg('');
    });
};
/*
* 将坐标增加到地图中
* */
function AddMarkerToMap(marker) {
    var self =this;
    self.name= marker.name;
    //注意要将 AJAX获取地理位置信息字符串格式转换成 数值；
    self.lat = parseFloat( marker.location.lat);
    self.lng = parseFloat( marker.location.lon);
    self.msg=marker.summary;
    console.log("value->"+Convert_BD09_To_GCJ02(self.lat,self.lng));

console.log('lat；'+self.lat+' lng:'+self.lng);
   //增加坐标
   self.mapMarker = new google.maps.Marker({
        position:Convert_BD09_To_GCJ02(self.lat,self.lng),//{lat:self.lat,lng:self.lng},//
        map:map,
        draggable:true,
        animation:google.maps.Animation.DROP,
        title:self.name
    });
    //增加提示信息
    self.infoWindow = new google.maps.InfoWindow();
    self.showInfoWindow=function(){
    if(!self.infoWindow.getContent()){
        self.infoWindow.setContent('Loading content...');
        var content = '<h3 class= "firstHeading" >'+self.name+'</h3>';
        content+='<p>'+self.msg+'</p>';
        self.infoWindow.setContent(content);
    }
    self.infoWindow.open(map,self.mapMarker);
    };
    //添加方法，采用原型链
    self.activate = function () {
        if(AddMarkerToMap.prototype.activate){
            if(AddMarkerToMap.prototype.activate!==self){
                AddMarkerToMap.prototype.activate.deactive();
            }
        }
        self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        self.showInfoWindow();
        AddMarkerToMap.prototype.activate=self;
    };
    //设置坐标动作
    self.deactive=function () {
      self.mapMarker.setAnimation(null);
      self.infoWindow.close();

      AddMarkerToMap.prototype.activate=null;
    };

    self.mapMarkerClickHandle=function () {

        if(AddMarkerToMap.prototype.activate===self){
            self.deactive();
        }else  {
            self.activate();
        }
    };
    self.infoWindowCloseHandle=function () {
        self.deactive();
    };
    //设置监听事件
    self.mapMarker.addListener('click',self.mapMarkerClickHandle);
    //设置监听关闭窗口的事件
    self.infoWindow.addListener('closeClick',self.infoWindowCloseHandle);
}

AddMarkerToMap.prototype.activate=null;
/*
* 将坐标转换为Google兼容的坐标
* */
function Convert_BD09_To_GCJ02(lat, lng)
{
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng - 0.0065;
    var y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    lng = z * Math.cos(theta);
    lat = z * Math.sin(theta);
    var location={lat:0,lng:0};
    location.lat=lat;
    location.lng=lng;
    console.log(lng.toString() +"   " +lat.toString());
    return location;
}
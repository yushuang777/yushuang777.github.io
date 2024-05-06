import React, { Component } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import './MapContainer.css';
import getGeoJson from "../../utils/amap";

class  MapComponent extends Component{
    constructor(){
        super();
        this.state={}
    }

    componentDidMount() {
        AMapLoader.load({
            key: '5eb2e0cf7266f69fffd5d49f76ba717c', // 替换为您的高德地图 API 密钥
            version: '2.0',
            plugins: [],
            Loca: {
                version: '2.0.0',
            },
        }).then((AMap) => {
            var map = new AMap.Map("mapcontainer", {
                viewMode: "3D",
                zoom: 11,
                pitch: 30,
                center: [120.153576, 30.287459], // 将中心点设置为杭州市的经纬度坐标
                mapStyle: 'amap://styles/dark', // 设置地图样式为暗黑模式
            });
            // eslint-disable-next-line no-undef
            var loca = new Loca.Container({
                map,
            });

            // eslint-disable-next-line no-undef
            var pl = new Loca.PrismLayer({
                zIndex: 10,
                opacity: 1,
                visible: false,
                hasSide: true,
            });
            //获取geoJson
            let data=  getGeoJson(this.props.chainInfoList,this.props.class,this.props.risk)
            // eslint-disable-next-line no-undef
            var geo = new Loca.GeoJSONSource({
                data: data,
            });

            pl.setSource(geo);
            pl.setStyle({
                unit: 'meter',
                sideNumber: 4,
                topColor: (index, f) => {
                    var n = f.properties['GDP'];
                    return n > 7000 ? '#E97091' : '#2852F1';
                },
                sideTopColor: (index, f) => {
                    var n = f.properties['GDP'];
                    return n > 7000 ? '#E97091' : '#2852F1';
                },
                sideBottomColor: '#002bb9',
                radius: 100,
                height: (index, f) => {
                    var props = f.properties;
                    var height = Math.max(100, Math.sqrt(props['GDP']) * 60 - 500);
                    var conf = [props['名称']];
                    // top3 的数据，增加文字表达
                    if (conf) {
                        map.add(
                            new AMap.Marker({
                                anchor: 'bottom-center',
                                position: [f.coordinates[0], f.coordinates[1], height],
                                content: '<div style="margin-bottom: 10px; float: left; font-size: 12px; height: auto; width: 180px; color:#fff; background-size: 100%;"><p style="margin: 7px 0 0 35px; height: 20px; line-height:20px;color:orange;">' +
                                    props['名称'] + '</p>' +
                                    '<span>' + (props['className'] ? '<span>当前产业：' + props['className'] + '</span>' : '') + '</span>' +
                                    '<p>' + (props['risk'] ? '<span>风险占比：' + props['risk'] + '%</span>' : '') + '</p>' +
                                    '<div style="margin: 4px 0 0 35px;">' +
                                    (props['industry'] ? props['industry'].map(industry => '<p style="margin: 0; font-size: 8px;">' + industry.name + '<span style="color: #00a9ff;margin-left: 3px">' + industry.value + '亿元 ' + '</span></p>').join('') : '') +
                                    '</div>' +
                                    '</div>'

                            })
                        );
                    }
                    return height;
                },
                rotation: 360,
                altitude: 0,
            });
            loca.add(pl);
            map.on('complete', function () {
                setTimeout(function () {
                    pl.show(500);
                    pl.addAnimate({
                        key: 'height',
                        value: [0, 1],
                        duration: 500,
                        easing: 'Linear',
                        transform: 2000,
                        random: true,
                        delay: 500,
                    });
                    pl.addAnimate({
                        key: 'rotation',
                        value: [0, 1],
                        duration: 500,
                        easing: 'Linear',
                        transform: 2000,
                        random: true,
                        delay: 500,
                    });
                }, 800);
            });
            loca.animate.start();

        }).catch((error) => {
            console.log(error);
        });
    }


    render(){
        // 1.创建地图容器
        return (
            <div className="home_div">
                <div id="mapcontainer" className="map" style={{ height: '100%' }} />
            </div>
        );
    }

}
export default MapComponent;



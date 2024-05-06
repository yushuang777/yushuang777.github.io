const areaIdList = [
    { coordinates: [120.130663, 30.259498], name: "西湖区" ,industry:[{name:"高技术船舶产业", "value": 85.43}]},
    { coordinates: [120.171465, 30.250236], name: "上城区" ,industry:[{name:"食品产业", "value": 432.34},{name:"新金融产业","value": 65.12}]},
    { coordinates: [120.212557, 30.266603], name: "江干区" ,industry:[{name:"节能环保产业", "value": 168.74}]},
    { coordinates: [120.211726, 30.208407], name: "滨江区" ,industry:[{name:"智能安防产业", "value": 212.12},{name:"智能制造产业", "value": 55.33},{name:"5g产业", "value": 985.56},{name:"工业互联网产业", "value": 765.41},{name:"大数据产业", "value": 132.23},{name:"光通信产业", "value": 191.21}]},
    { coordinates: [120.264429, 30.162932], name: "萧山区" ,industry:[{name:"集成电路产业", "value": 41},{name:"新能源汽车产业", "value": 824},{name:"纺织服装产业", "value": 336},{name:"现代化工业产业", "value": 112.1},{name:"航空航天产业", "value": 272.22},{name:"新材料产业", "value": 522.21}]},
    { coordinates: [120.006202, 30.419769], name: "余杭区" ,industry:[{name:"生物医药产业", "value": 612}]},
];

export default function getGeoJson(data,className,risk) {
    if (data && data.length > 0) {
        const address = data[0].address;
        const area = areaIdList.find(item => item.name === address);
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": area.coordinates
                    },
                    "properties": {
                        "id": 1,
                        "名称": area.name,
                        "地址": area.name,
                        "人口": 2884.62,
                        "GDP": 7894.24,
                        "人均GDP": 27367,
                        "className":className,
                        "risk":risk,
                    }
                }
            ]
        };
    } else {
        console.log(2)
        return {
            "type": "FeatureCollection",
            "features": areaIdList.map((area, index) => ({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": area.coordinates
                },
                "properties": {
                    "id": index + 1,
                    "名称": area.name,
                    "地址": area.name,
                    "人口": 2884.62,
                    "GDP": 7894.24,
                    "人均GDP": 27367,
                    "industry":area.industry
                }
            }))
        };
    }
}

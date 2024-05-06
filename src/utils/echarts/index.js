import * as echarts from 'echarts';

export const createBarChart = (id, data) => {
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id),'dark');
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        title: { text: '企业历年产值（仅供参考，无实际意义）' },
        tooltip: {},
        xAxis: {
            data: data[0].year
        },
        yAxis:{
            type: 'value',
            name: '万元'
        },
        series: [{
            name: '产值',
            type: 'bar',
            data: data[0].gdp,
            label: {
                show: true,
                position: 'top'
            }
        }],
        backgroundColor: 'rgba(0, 0, 0, 0)'
    });
};




export const createLineChart = (id,data) => {
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id),'dark');
    // 监听窗口大小变化事件
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        title: { text: 'GDP年增长情况（仅供参考，无实际意义）' },
        tooltip: {},
        xAxis: {
            data:data[0].year.slice(1)
        },
        yAxis:{
            type: 'value',
            name: '百分比'
        },
        series: [{
            name: '产值',
            type: 'line', // 修改为折线图
            data: data.growthRate,
            label: {
                show: true,
                position: 'top'
            }
        }],
        backgroundColor: 'rgba(0, 0, 0, 0)'
    });
};


export const createPieChart = (id,data) => {
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id),'dark');
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        title: { text: 'GDP年占总行业比例（仅供参考，无实际意义）' },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        tooltip: {},
        series: [
            {
                type: 'pie',
                radius: [25, 80],
                center: ['50%', '60%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                data: data.pieRate
            }
        ],
        backgroundColor: 'rgba(0, 0, 0, 0)'
    });
};


export const createAreaChart = (id,data) => {
    const gdpData=[]
    const healthyData=[]
    data.forEach(item=>{
        healthyData.push(item.value)
        gdpData.push(item.rank)
    })
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id),'dark');
    // 监听窗口大小变化事件
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        title:{text:"不同年份健康值对GDP影响程度（仅供参考）"},
        tooltip: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [2018,2019,2020,2021,2022,2023]
            }
        ],
        yAxis:{
            type: 'value',
            name: '百分比'
        },
        series: [    {
            name: 'Gdp影响程度',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: healthyData,
            label: {
                show: true,
                position: 'top'
            }
        },
            {
                name: '健康度对Gdp影响程度',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: gdpData,
                label: {
                    show: true,
                    position: 'top'
                }
            }],
        backgroundColor: 'rgba(0, 0, 0, 0)'
    });
};



export const createRunChart = (id,data) => {
    const dataRate = [""];
    for (let i = 1; i < data.length; i++) {
        const num = ((data[i] - data[i - 1])/data[i - 1]*100).toFixed(2);
        dataRate.push(num);
    }
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id),'dark');
    // 监听窗口大小变化事件
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            right: '20%'
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['百分比',  '数值']
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '百分比',
                position: 'right',
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#5470C6'
                    }
                },
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            {
                type: 'value',
                name: '数值',
                position: 'left',
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#91CC75'
                    }
                },
                axisLabel: {
                    formatter: '{value} 万元'
                }
            }
        ],
        series: [
            {
                name: '数值',
                type: 'bar',
                data: data,
                label: {
                    show: true,
                    position: 'top'
                }
            },
            {
                name: '百分比',
                type: 'line',
                yAxisIndex: 1,
                data: dataRate
            }
        ],
        backgroundColor: 'rgba(0, 0, 0, 0)'
    });
};



export const tzfxBarChart = (id, data) => {
    const company=[]
    const number=[]
    data.forEach(item=>{
        company.push(item.name)
        number.push(item.value)
    })
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id),'dark');
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        tooltip: {},
        xAxis: {
            data: company
        },
        yAxis:{
            type: 'value',
            name: '家'
        },
        series: [{
            name: '产业',
            type: 'bar',
            barWidth: 20, // 你可以调整这个值来改变柱形的宽度
            data: number,
            label: {
                show: true,
                position: 'top'
            }
        }],
        backgroundColor: 'rgba(0, 0, 0, 0)'
    });
};


export const tzfxLineChart = (id,data) => {
    const company=[]
    const number=[]
    const datavalue=[]
    data.forEach(item=>{
        company.push(item.name)
        datavalue.push(item.value)
        number.push(item.number)
    })
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id),'dark');
    // 监听窗口大小变化事件
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            right: '20%'
        },
        legend: {
            data: ['金额', '数量']
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            data: company
        }],
        yAxis: [
            {
                type: 'value',
                name: '数量', // 修改为投资数量
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#91CC75'
                    }
                },
                axisLabel: {
                    formatter: '{value} 万'
                }
            },
            {
                type: 'value',
                name: '金额', // 修改为投资金额
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#5470C6'
                    }
                },
                axisLabel: {
                    formatter: '{value} 家'
                }
            }
        ],
        series: [{
            name: '金额',
            type: 'bar',
            barWidth: 20, // 你可以调整这个值来改变柱形的宽度
            data: datavalue,
            label: {
                show: true,
                position: 'top'
            }
        },{
            name: '数量',
            type: 'line',
            yAxisIndex: 1,
            data: number,
            label: {
                show: true,
                position: 'top'
            }
        }],
        backgroundColor: 'rgba(0, 0, 0, 0)' // 设置背景颜色透明
    });
};


export const tzfxPieChart = (id, data, money,text) => {
    const totalValue = data.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
    const numStr = money.replace('万元', '');
    const dataValue =[{ name: text, value: (totalValue/numStr).toFixed(2) }];
    const dataValue2=[];
    data.forEach(item=>{
        dataValue2.push({name:item.name,value:(item.value/totalValue).toFixed(2)})
    })
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id), 'dark');
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: id==='tzfxPieChart1',
                position: 'center',
                fontSize: 10
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 10,
                    formatter: '{b}\n{c}%' // 鼠标悬浮时的标签内容格式
                }
            },
            labelLine: {
                show: false
            },
            data: id==='tzfxPieChart1'?dataValue:dataValue2
        }],
        backgroundColor: 'rgba(0, 0, 0, 0)'
    });
};



export const zsclLineEcharts = (id, data) => {
    const existingChart = echarts.getInstanceByDom(document.getElementById(id));
    const yData = id === "zsclLineEcharts1" || id === "zsclLineEcharts2" ?
        ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"] :
        ["2017", "2018", "2019", "2020", "2021", "2022", "2023"];

    // const title=id === "zsclLineEcharts1" || id === "zsclLineEcharts2" ?"万元":""
    if (existingChart) {
        existingChart.dispose();
    }
    var myChart = echarts.init(document.getElementById(id), 'dark');
    window.addEventListener('resize', () => myChart.resize());
    myChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: yData
        },
        series: [
            {
                name: "万元",
                type: 'bar',
                data: data
            }
        ],
        backgroundColor: 'rgba(0, 0, 0, 0)'
    });
};
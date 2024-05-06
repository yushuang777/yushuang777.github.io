import React, {Component} from 'react';
import './evelopment.css';
import rank from '../../../static/evelopment-icon.png'
import statusImg from "../../../static/image/status-healthy.png";

class IndustryEvelopment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightBox: [
                {name: "产业经济指数", value: 0, circle: "较上一年"},
                {name: "链条完整指数", value: 0, circle: "较上一年"},
                {name: "产业健康指数", value: 0, circle: "较上一年"}
            ]
        }
    }

    render() {
        const cities = [];
        const structuredData = [];
        this.props.companyList.forEach(item => {
            const List = {
                company: '',
                point: [
                    { name: '产业经济指数', data: []},
                    { name: '链条完整指数', data: []},
                    { name: '产业健康指数', data: []},
                    { name: '综合指数', data: []},
                ]
            };
            List.company = item.name;
            let totalMaterial = 0; // 初始化材料总数为 0
            let totalRisk = 0;
            // 计算产业经济指数
            for (let node of item.companyGdpData) {
                for (let i = 0; i <= 6; i++) {
                    List.point[0].data.push((node.gdp[i] / node.totalGdp[i] * 100).toFixed(2));
                }
            }
            // 计算链条完整指数和产业健康指数
            for (let node of item.chainStatusInfoList) {
                totalMaterial += node.material.length; // 累加每个公司的材料数量
                for (let nodes of node.material) {
                    if (nodes.value <= 3) {
                        totalRisk += 1;
                    }
                }
            }
            for (let i = 0; i <= 6; i++) {
                List.point[1].data.push((totalMaterial * 100 / 64).toFixed(2)); // 计算平均每家公司的材料数量
                List.point[2].data.push((totalRisk * 100 / totalMaterial).toFixed(2));
            }
            cities.push(List);
        });
        const cityList = cities.find(item => this.props.defaultCompany === item.company);
        if (cityList) {
            // 计算综合指数
            const sumList = Array.from({ length: cityList.point[0].data.length }, () => 0);
            cityList.point.forEach(item => {
                item.data.forEach((value, index) => {
                    sumList[index] += Number(value);
                });
            });
            const roundedSumList = sumList.map(sum => parseFloat(sum.toFixed(2)));
            cityList.point[3].data.push(...roundedSumList);

            const newData = {};
            cityList.point.forEach((item, index) => {
                item.data.forEach((value, i) => {
                    const year = 2017 + i; // 计算年份
                    if (!newData[year]) {
                        newData[year] = {
                            year: year,
                            "产业经济指数": undefined, // 设置为 undefined
                            "链条完整指数": undefined, // 设置为 undefined
                            "产业健康指数": undefined, // 设置为 undefined
                            "综合指数": undefined // 设置为 undefined
                        };
                    }
                    newData[year][item.name] = parseFloat(value); // 将值添加到对应年份和指数的位置
                    if (i > 0) {
                        const currentValue = parseFloat(value);
                        const previousValue = parseFloat(cityList.point[index].data[i - 1]);
                        const growthRate = calculateGrowthRate(currentValue, previousValue); // 计算增长率
                        newData[year][item.name + "增长率"] = growthRate;
                    }
                });
            });

            structuredData.push(newData);
            console.log(structuredData[0]);
        }
// 计算增长率的函数
        function calculateGrowthRate(currentValue, previousValue) {
            const rate = ((currentValue - previousValue) / previousValue * 100).toFixed(2);
            return rate + "%";
        }

        const cardData =structuredData.length && structuredData[0][this.props.defaultYear];
        if (cardData) {
            this.state.rightBox.forEach(item => {
                switch (item.name) {
                    case "产业经济指数":
                        item.value = cardData["产业经济指数"];
                        item.rate = cardData["产业经济指数增长率"];
                        break;
                    case "链条完整指数":
                        item.value = cardData["链条完整指数"];
                        item.rate = cardData["链条完整指数增长率"];
                        break;
                    case "产业健康指数":
                        item.value = cardData["产业健康指数"];
                        item.rate = cardData["产业健康指数增长率"];
                        break;
                    default:
                        break;
                }
            });
        }

        return (
            <div className={'evelopment-content'}>
                <div className={'evelopment-title'}>
                    产业发展指数情况
                </div>
                <div className={'evelopment-title-introduce'}>
                    当前企业&{this.props.defaultCompany}&，指数情况如下
                </div>
                <div className={'evelopment-card-box'}>
                    <div className={'evelopment-card-box-left'}>
                        <div className={'evelopment-card-box-wrap'}>
                            <img className={'rank-img'} src={rank} alt={''}/>
                            <div className={'evelopment-card-box-content'}>
                                <div>综合指数：</div>
                                <div className={'evelopment-card-box-number'}>
                                    {cardData['综合指数']}
                                </div>
                                <div className={'evelopment-card-box-bottom'}>
                                    <span>较上一年</span>
                                    <div>{cardData["综合指数增长率"]}</div>
                                </div>
                            </div>
                            <div style={{color: "#87CEFA"}}>企业排名:第8名（在当前行业）</div>
                        </div>

                        <img className={'evelopment-img'} src={statusImg} alt={''}/>
                    </div>
                    <div className={'evelopment-card-box-right'}>
                        {
                            this.state.rightBox.map((item, index) => {
                                return <div className={'evelopment-card-box-right-item'} key={index}>
                                    <div className={'right-item-box'}>
                                        <div className={'right-item-name'}>
                                            {item.name}
                                        </div>
                                        <div className={'right-item-value'}>
                                            {item.value}
                                        </div>
                                    </div>
                                    <div className={'evelopment-card-box-bottom'}>
                                        <span>{item.circle}</span>
                                        <div>{item.rate}</div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className={'evelopment-table'}>
                    <table>
                        <thead>
                        <tr>
                            <th>企业\日期</th>
                            <th>2017</th>
                            <th>2018</th>
                            <th>2019</th>
                            <th>2020</th>
                            <th>2021</th>
                            <th>2022</th>
                            <th>2023</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cityList&&
                            cityList.point.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        { item.data.map((node,i)=>{
                                            return <td key={i}>{node}</td>
                                            })
                                        }
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>

                </div>
            </div>
        );
    }
}

export default IndustryEvelopment;
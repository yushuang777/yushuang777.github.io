import React, {Component} from 'react';
import Map from '../../amap/MapContainer'
import './zscl.css'
import { zsclLineEcharts} from "../../../utils/echarts";
import statusImg from "../../../static/image/status-healthy.png";

class zscl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            industryList:[
                {"name": "5G产业链", "value": 985.56},
                {"name": "新能源汽车产业链", "value": 824},
                {"name": "工业互联网产业链", "value": 765.41},
                {"name": "生物医药产业链", "value": 612},
                {"name": "新材料产业链", "value": 522.21},
                {"name": "食品产业链", "value": 432.34},
                {"name": "纺织服装产业链", "value": 336},
                {"name": "航空航天及北斗导航产业链", "value": 272.22},
                {"name": "智能安防产业链", "value": 212.12},
                {"name": "光通信产业链", "value": 191.21},
                {"name": "节能环保产业链", "value": 168.74},
                {"name": "大数据产业链", "value": 132.23},
                {"name": "现代化工产业链", "value": 112.1},
                {"name": "高技术船舶和海洋工程装备产业链", "value": 85.43},
                {"name": "新金融产业链", "value": 65.12},
                {"name": "智能制造产业链", "value": 55.33},
                {"name": "集成电路产业链", "value": 41}
            ],
            getRunCompany:[],
            incomeUp:[],
            profitUp:[],
            incomeDown:[],
            profitDown:[],
            income2023:[],
            profitAllList:[],
            newFieldsName:[],
            topFiveName:[]
        }
    }



    componentDidUpdate(prevProps, prevState) {
        if (this.props.getRunCompany !== prevProps.getRunCompany) {
            //给出建议
            const newFields = this.props.investList[0].newFields
            const topFive = this.props.investList[0].topFive
            const newFieldsName = []
            JSON.parse(newFields).forEach(item => {
                newFieldsName.push(item.name)
            })
            const topFiveName = []
            JSON.parse(topFive).forEach(item => {
                topFiveName.push(item.name)
            })
            this.setState({})
            this.setState({getRunCompany:this.props.getRunCompany,newFieldsName,topFiveName},()=>{
            this.createEcharts()})
        }
    }



    createEcharts=()=>{
        const income2023Data = this.state.getRunCompany.incomeAllList.find(item => "2023" in item);
        const income2023 = income2023Data["2023"];
        const profit2023Data = this.state.getRunCompany.profitAllList.find(item => "2023" in item);
        const profit2023 = profit2023Data["2023"];
        const incomeAllList = this.state.getRunCompany.incomeAllList.map(item => {
            return item[Object.keys(item)[0]].reduce((acc, curr) => acc + curr, 0);
        });
        const profitAllList = this.state.getRunCompany.profitAllList.map(item => {
            return item[Object.keys(item)[0]].reduce((acc, curr) => acc + curr, 0);
        });
        const incomeUp = this.findIncreasingRanges(income2023);
        const profitUp = this.findIncreasingRanges(profit2023);
        this.setState({ incomeUp, profitUp,income2023,profitAllList});

        //echarts图
        zsclLineEcharts('zsclLineEcharts1',income2023);
        zsclLineEcharts('zsclLineEcharts2',profit2023);
        zsclLineEcharts('zsclLineEcharts3',incomeAllList);
        zsclLineEcharts('zsclLineEcharts4',profitAllList);

    }


    findIncreasingRanges(data) {
        let start = 1; // 假设月份从 1 开始
        const ranges = [];
        for (let i = 2; i <= data.length; i++) {
            if (data[i - 1] >= data[i - 2]) {
                continue;
            }
            ranges.push([start, i - 1]);
            start = i;
        }
        ranges.push([start, data.length]);
        return ranges;
    }

    renderRanges(ranges) {
        return ranges.map(([start, end], index) => (
            <span key={index}>自 {start}月 至 {end}月上升。</span>
        ));
    }
    render() {
        const getChainInfo=this.props.getChainInfo
        const rank=this.state.industryList.findIndex((item=>item.name===getChainInfo.className))
        const total=this.state.industryList.find((item=>item.name===getChainInfo.className))
        const proportion=this.state.income2023&&(this.state.income2023.reduce((acc, curr) => acc + curr, 0)/(parseFloat(total.value)*1000000)).toFixed(2)
        const comprehensive=((((this.state.profitAllList[this.state.profitAllList.length-1]-this.state.profitAllList[this.state.profitAllList.length-2])/this.state.profitAllList[this.state.profitAllList.length-2]) + proportion*10 + ((1-rank+1)/(16-1)))/3).toFixed(2)
        return (
            <div className={'zscl-content'}>
                <div className={'zscl-title-wrap'}>
                    <div className={'zscl-title'}>
                        杭州市产业产值情况
                    </div>
                </div>
                <div className={'zscl-warn-content'}>
                    <div className={'zscl-warn-text'}>
                        当前所属产业：
                        <span className={'zscl-warn-span'}>
                            {getChainInfo.className}，
                        </span>
                        占杭州产业产值排名：
                        <span className={'zscl-warn-span'}>
                            第{rank+1}位，
                        </span>
                        生产总值：
                        <span className={'zscl-warn-span'}>
                            {total.value}亿人民币
                        </span>
                    </div>
                </div>
                <div className={'zscl-map'}>
                    <div className={'zscl-left-content'}>
                        <div className={'zscl-title-orange'}>
                            杭州市产业产值
                        </div>
                        <div className="industry-list-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>产业名称</th>
                                    <th>2023年产值</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.industryList.map((item,index)=>{
                                        return  <tr key={index}>
                                            <td style={{whiteSpace:"nowrap"}}>{index + 1}位</td>
                                            <td>{item.name}</td>
                                            <td>{item.value} 亿人民币</td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={'map'} >
                        <Map />
                    </div>
                </div>

                <div className={'zscl-title-wrap'}>
                    <div className={'zscl-title'}>
                        趋势分析
                    </div>
                </div>
                <div className={'zscl-echarts-box'}>
                    <div className={'zscl-echarts-item'}>
                        <div className={'zscl-title-orange'}>
                            2023年总产额
                        </div>
                        <div id="zsclLineEcharts1" style={{ height: 200}}></div>
                    </div>
                    <div className={'zscl-echarts-item'}>
                        <div className={'zscl-title-orange'}>
                            2023年利润额
                        </div>
                        <div id="zsclLineEcharts2" style={{ height: 200}}></div>
                    </div>
                    <div className={'zscl-echarts-item'}>
                        <div className={'zscl-title-orange'}>
                            历年总产额
                        </div>
                        <div id="zsclLineEcharts3" style={{ height: 200}}></div>
                    </div>
                    <div className={'zscl-echarts-item'}>
                        <div className={'zscl-title-orange'}>
                            历年利润额
                        </div>
                        <div id="zsclLineEcharts4" style={{height: 200}}></div>
                    </div>
                </div>
                <div className={'zscl-info-content'}>
                    <div className={'zscl-info-text'}>
                        由图得知：2023年产额上升区间为（其余为降低区间）：
                        <span className={'zscl-info-span'}>
                            {this.renderRanges(this.state.incomeUp)}
                        </span>
                        <span className={'zscl-info-span'}>
                            {this.renderRanges(this.state.incomeDown)}
                        </span>
                        占2023年产业总值比例：
                        <span className={'zscl-info-span'}>
                            {proportion}%
                        </span>
                    </div>
                </div>

                <div className={'zscl-title-wrap'}>
                    <div className={'zscl-title'}>
                        综合结论
                    </div>
                </div>
                <div className={'zscl-healthy'}>
                    <img className={'zscl-img'} src={statusImg} alt={''}/>
                    <div className={'zscl-healthy-box'}>
                        <div className={'zscl-healthy-item'}>
                            <div className={'zscl-healthy-title'}>产业排名得分</div>
                            <div className={'zscl-healthy-box-number'}>
                                {((1-rank+1)/(16-1)).toFixed(2)}
                            </div>
                        </div>
                        <div className={'zscl-healthy-item'}>
                            <div className={'zscl-healthy-title'}>产值占比得分</div>
                            <div className={'zscl-healthy-box-number'}>
                                {proportion*10}
                            </div>
                        </div>
                        <div className={'zscl-healthy-item'}>
                            <div className={'zscl-healthy-title'}>升降趋势得分</div>
                            <div className={'zscl-healthy-box-number'}>
                                {((this.state.profitAllList[this.state.profitAllList.length-1]-this.state.profitAllList[this.state.profitAllList.length-2])/this.state.profitAllList[this.state.profitAllList.length-2]).toFixed(2)}
                            </div>
                        </div>
                    </div>
                    <div className={'zscl-healthy-rules'}>
                        产业排名得分计算逻辑：<span>(1-(排名-1)/(产业总数-1))（最多保留两位小数）</span>
                    </div>
                    <div className={'zscl-healthy-rules'}>
                        产值占比得分计算逻辑：<span>企业总值/产业总值*10（最多保留两位小数）</span>
                    </div>
                    <div className={'zscl-healthy-rules'}>
                        升降趋势得分计算逻辑：<span>(利润总量)/上一年利润总量（最多保留两位小数）</span>
                    </div>
                    <div className={'zscl-healthy-item'} style={{marginTop:"10px"}}>
                        <div className={'zscl-healthy-title'}>综合评价<span>（推荐：综合评价大于等于0;不推荐：综合评价小于0）</span></div>
                        <div className={'zscl-healthy-box-number'}>
                            {comprehensive>0?"推荐":"不推荐"}
                              （{comprehensive}）
                        </div>
                    </div>
                    <div className={'zscl-healthy-rules'}>
                        综合评价计算逻辑：<span>(产业排名得分+产值占比得分+升降趋势得分)/3</span>
                    </div>
                </div>

                    {
                        comprehensive>=0?
                            <div className={'zscl-good-content'}>
                                <div className={'zscl-good-text'}>
                            相应建议：当前企业属于推荐企业，该企业综合指数达到相应要求。
                            可以继续研究以下科技：
                            <span className={'zscl-good-span'}>
                                {this.state.newFieldsName.map((item, index) => {
                                    return <span className={'zscl-good-text'} key={index}>
                                        {item}、
                                    </span>
                                })}
                            </span>
                            可以继续以投资以下产业：
                            <span className={'zscl-good-span'}>
                                {this.state.topFiveName.map((item, index) => {
                                    return <span className={'zscl-good-text'} key={index}>
                                        {item}、
                                    </span>
                                })}
                            </span>
                            。以达到：进一步推进供应链升级和产业协同发展，以提高产业附加值和整体竞争力，促进经济可持续增长。
                        </div>
                            </div>:
                            <div className={'zscl-warn-content'}>
                                <div className={'zscl-warn-text'}>
                                    相应建议：当前企业属于不推荐企业，该企业综合指数未达到相应要求。
                                    可以尝试研究以下科技：
                                    <span className={'zscl-warn-span'}>
                                {this.state.newFieldsName.map((item, index) => {
                                    return <span className={'zscl-warn-text'} key={index}>
                                        {item}、
                                    </span>
                                })}
                            </span>
                                    可以尝试以投资以下产业：
                                    <span className={'zscl-warn-span'}>
                                {this.state.topFiveName.map((item, index) => {
                                    return <span className={'zscl-warn-text'} key={index}>
                                        {item}、
                                    </span>
                                })}
                            </span>
                                    可以进行产业转型，寻找当前市高发展产业如：
                                    <span className={'zscl-warn-span'}>
                                5G产业、新能源汽车产业、互联网产业等
                            </span>
                                    。另外：加强监管力度、提升技术水平、培训人才，以提高产业附加值和整体竞争力，促进经济可持续增长。
                                    同时，鼓励创新，拓展新兴市场，促进产业与科技、文化等领域融合发展，提升产业附加值和国际竞争力，实现负产值产业向正向发展的转变。
                                </div>
                            </div>
                    }

            </div>

        );
    }
}

export default zscl;
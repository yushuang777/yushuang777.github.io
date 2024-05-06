import React, {Component} from 'react';
import Map from '../../amap/MapContainer'
import './risk.css'

class IndustryRisk extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        const chainInfoList = this.props.chainInfoList;
        const showListObj = {};
        const chainTotal= {riskTotal:0,Total:0}
        chainInfoList.forEach(node => {
            node.chainStatusInfoList.forEach(item => {
                item.material.forEach(i => {
                    chainTotal.Total+=1
                    if (i.value < 3) {
                        chainTotal.riskTotal+=1
                        if (!showListObj[node.name]) {
                            showListObj[node.name] = {name: node.name, tools: []};
                        }
                        showListObj[node.name].tools.push({tool: i.name, value: i.value.toFixed(1)});
                    }
                });
            });
        });
        const showList = Object.values(showListObj);
        const risk=(chainTotal.riskTotal/chainTotal.Total).toFixed(2)*100
        return (
            <div className={'risk-content'}>
                <div className={'risk-left-content'}>
                    <div className={'risk-title'}>
                        {this.props.className}-产业风险情况
                    </div>
                    <div className={'area-box'}>
                        <div className={'area-item'}>
                            <div className={'area-item-title'}>
                                风险总数
                            </div>
                            <div className={'area-item-total'}>
                                {chainTotal.riskTotal}
                            </div>
                        </div>
                        <div className={'area-item'}>
                            <div className={'area-item-title'}>
                                风险占比(风险链点占总链点数)
                            </div>
                            <div className={'area-item-number'}>
                                {risk}%
                            </div>
                        </div>
                    </div>
                    <div className={'risk-title'}>
                        {this.props.className}-风险企业列表
                    </div>
                    <div className="city-list-container">
                        <table>
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>企业名称</th>
                                <th>风险链点(健康值小于3)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {showList.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        {item.tools.map((node, i) => (
                                            <span className={'showList-span'} key={i}>
                                                {node.tool}
                                                <span style={{marginLeft: '2px'}}>{node.value}</span>
                                            </span>
                                        ))}
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={'map'}>
                    <Map chainInfoList={this.props.chainInfoList} defaultAddress={this.props.defaultAddress} class={this.props.className} risk={risk}/>
                </div>
            </div>

        );
    }
}

export default IndustryRisk;
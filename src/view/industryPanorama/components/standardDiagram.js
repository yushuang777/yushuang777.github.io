import React, {Component} from 'react';
import './diagram.css'

class StandardDiagram extends Component {

    constructor(props) {
        super(props);
        this.state={
            info:[],
            frName:'',
            address:''
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //检查 props 是否发生变化
        if (this.props.info !== prevProps.info) {
            this.setState({info:this.props.info,frName:this.props.info[3].leftValue,address:this.props.info[1].leftValue})
        }
    }
    render() {
        return (
            <div className={'diagram-content'}>
                <div className={'diagram-topContent'}>
                    <div className={'diagram-company-frName'}>
                        <span>法人：</span>{this.state.frName}
                    </div>
                    <div className={'diagram-company-content'}>
                        <div className={'diagram-company-wrap'}>
                            <span>联系电话：</span>xxxx7892(暂无)
                        </div>
                        <div className={'diagram-company-wrap'}>
                            <span>注册地址：</span>{this.state.address}
                        </div>
                    </div>
                    <div className={'diagram-company-introduce'}>
                        <span>公司介绍：</span>若要了解详情，请访问相关官网
                    </div>
                </div>
                <div className={'diagram-bottomContent'}>
                    <div className={'diagram-company-title'}>
                        工商照面信息
                    </div>
                    <div className={'diagram-bottomContent-table'}>
                        <table>
                            <tbody>
                            {this.state.info.map((item, index) => (
                                <tr key={index}>
                                    <td  className={'td-bg'}>{item.left}</td>
                                    <td>{item.leftValue}</td>
                                    <td  className={'td-bg'}>{item.right}</td>
                                    <td>{item.rightValue}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default StandardDiagram;
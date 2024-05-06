import React, {Component} from 'react';
import './jcxx.css'
class Jcxx extends Component {
    constructor(props) {
        super(props);
        this.state={
        }
    }
    render() {
        const {chains,companyInfo} = this.props
        return (
            <div className={'jcxx-content'}>
                <div className={'jcxx-corporate'}>
                    <div className={'jcxx-title-wrap'}>
                        <div className={'jcxx-title'}>
                            企业画像
                        </div>
                    </div>
                    <div className={'jcxx-chains'}>
                        <span className={'jcxx-chains-title'}>
                            企业链点：
                        </span>
                        {
                            chains.map((item,index)=>{
                                return <div className={'jcxx-chains-item'} key={index}>
                                    {item.name}
                                </div>
                            })
                        }
                    </div>
                    <div className={'jcxx-title-wrap'}>
                        <div className={'jcxx-title'}>
                            工商照面信息
                        </div>
                    </div>
                    <div className={'jcxx-table'}>
                        <table>
                            <tbody>
                            {companyInfo.map((item, index) => (
                                <tr key={index}>
                                    <td  className={'jcxx-bg'}>{item.left}</td>
                                    <td>{item.leftValue}</td>
                                    <td  className={'jcxx-bg'}>{item.right}</td>
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

export default Jcxx;
import React, {Component} from 'react';
import down from '../../../static/image/arrow-down.png'
import right from '../../../static/image/arrow-right.png'
import './business.css'

class BusinessPortraits extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chain: {},
            material: [],//材料
            design: [],//设计
            manufacture: [],//制造
            test: [],//测试
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //检查 props 是否发生变化
        if (this.props.chain !== prevProps.chain) {
            this.setState({
                material: JSON.parse(this.props.chain[0].material),
                design: JSON.parse(this.props.chain[1].material),
                manufacture: JSON.parse(this.props.chain[2].material),
                test: JSON.parse(this.props.chain[3].material)
            })
        }
    }

    render() {
        const {material, design, manufacture, test} = this.state
        return (
                <div className={'drawer-content'}>
                    <div className={'step1-2-box'}>
                        <div className={'chain-box'}>
                            <div className={'chain-title'}>材料</div>
                            <div className={'chain-wrap'}>
                                {
                                    material.map((item, index) => {
                                        return <div className={'chain-item'} key={index}>
                                            {item.name}材料
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className={'step1-2-img'}>
                            <img src={down} alt={''} style={{height:"46px"}}/>
                        </div>
                        <div className={'chain-box'}>
                            <div className={'chain-title'}>设计</div>
                            <div className={'chain-wrap'}>
                                {
                                    design.map((item, index) => {
                                        return <div className={'chain-item'} key={index}>
                                            {item.name}
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className={'step1-2-img'}>
                            <img src={down} alt={''} style={{height:"46px"}}/>
                        </div>
                    </div>
                    <div className={'step3-4-box'}>
                        <div className={'manufacture-box'}>
                            <div className={'chain-title'}>制造</div>
                            <div className={'manufacture-wrap'}>
                                {
                                    manufacture.map((item, index) => {
                                        return <div className={'manufacture-item'} key={index}>
                                            {item.name}
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className={'step3-4-img'}>
                            <img src={right} alt={''} style={{height:"46px"}}/>
                        </div>
                        <div className={'test-box'}>
                            <div className={'chain-title'}>测试</div>
                            <div className={'test-wrap'}>
                                {
                                    test.map((item, index) => {
                                        return <div className={'test-item'} key={index}>
                                            {item.name}
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default BusinessPortraits;
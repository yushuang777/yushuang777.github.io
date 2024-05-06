import React, {Component} from 'react';
import './index.css'
import SelectList from "../../utils/selectList";
class Index extends Component {
    constructor() {
        super();
        this.state={
            areaList:[
                {
                    value: '',
                    label: '全部',
                },
                {
                    value: '上城区',
                    label: '上城区',
                },
                {
                    value: '下城区',
                    label: '下城区',
                },
                {
                    value: '江干区',
                    label: '江干区',
                },
                {
                    value: '拱墅区',
                    label: '拱墅区',
                },
                {
                    value: '西湖区',
                    label: '西湖区',
                },
                {
                    value: '滨江区',
                    label: '滨江区',
                },
                {
                    value: '萧山区',
                    label: '萧山区',
                },
                {
                    value: '余杭区',
                    label: '余杭区',
                },
                {
                    value: '富阳区',
                    label: '富阳区',
                },                {
                    value: '临安区',
                    label: '临安区',
                }
            ]
        }
    }

    componentDidMount() {

    }
    handleChange = (e) => {
        this.props.onSelect(e);
    };
    render() {
        return (
            <div className="top-content">
                <div className="top-content-select">
                    <SelectList changeCompany={this.handleChange} defaultCompany={"全部"} options={this.state.areaList}/>
                </div>
            </div>
        );
    }
}

export default Index;
import React, {Component} from 'react';
import './index.css'
import {getUrlParams} from "../../utils";
import axios from "axios";
import {Empty, Select} from "antd";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            companyList:[],
            companyOption:[],
            companyCopy:[]
        }
    }
    componentDidMount() {
        const urlParams = getUrlParams(window.location.href);
        this.setState({ className: urlParams.result.classname },()=>{
            this.getCompany();
        });
    }

    getCompany=()=>{
        const params={className: this.state.className}
        axios.get("/other/getCompany", {params}).then(res => {
            if (res.status === 200) {
                const companyOption=[]
                res.data[0].companyList.map((item,index)=>{
                    companyOption.push({value:item.name,label:item.name})
                })
                this.setState({companyList:res.data[0].companyList,companyOption:companyOption,companyCopy:res.data[0].companyList})
            }
        })
    }


    goToDetail=(item)=>{
       window.location.href=`/company-detail?companyName=${item.name}`
    }


    onChange = (value) => {
        const companyList=this.state.companyCopy
        if(value){
            const foundCompanies = companyList.filter(item => value === item.name);
            this.setState({ companyList: foundCompanies });
        }else{
            this.getCompany();
        }
    };

    filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    render() {
        return (
            <div className={'improve-content'}>
                <div className={'improve-search'}>
                    <Select
                        style={{width: 500}}
                        allowClear
                        showSearch
                        placeholder="在此输入企业名称"
                        optionFilterProp="children"
                        onChange={this.onChange}
                        filterOption={this.filterOption}
                        options={this.state.companyOption}
                    />
                </div>
                <div className={'improve-companyList'}>
                    {
                        this.state.companyList && this.state.companyList.map((item,index)=>{
                            return <div className={'improve-company-item'} key={index} onClick={()=>this.goToDetail(item)}>
                                <div className={'improve-company-title'}>
                                    {item.name}
                                </div>
                                <div className={'improve-company-tab'}>
                                    <div className={'improve-company-wrap'}>
                                        企业类型：<span className={'improve-company-type'}>{item.type===1?'小型企业':item.type===2?'中型企业':'大型企业'}</span>
                                    </div>
                                </div>
                                <div className={'improve-company-address'}>
                                    企业地址：{item.address}
                                </div>
                            </div>
                        })
                    }
                    {
                        !this.state.companyList.length&&
                        <div className={'improve-empty'}>
                            <Empty description={'暂无数据'}  imageStyle={{margin:"30px 0"}}/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Index;
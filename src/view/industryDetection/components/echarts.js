import React, { Component } from 'react';
import { createBarChart, createLineChart, createPieChart} from '../../../utils/echarts/index';

class Echarts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gdpEcharts:[]
        };
    }

    componentDidUpdate(prevProps, prevState) {
        //检查 props 是否发生变化
        if (this.props.gdpEcharts !== prevProps.gdpEcharts) {
            this.createCharts();
        }
    }

    createCharts = () => {
        createBarChart('createBarChart', this.props.gdpEcharts);
        createLineChart('createLineChart', this.props.gdpEcharts);
        createPieChart('createPieChart', this.props.gdpEcharts);
    }

    render() {
        return (
            <div className="echartsList">
                <div id="createBarChart" style={{ width: '100%', height: 230 }}></div>
                <div id="createLineChart" style={{ width: '100%', height: 230 }}></div>
                <div id="createPieChart" style={{ width: '100%', height: 230 }}></div>
            </div>
        );
    }
}

export default Echarts;

// 文件路径: src/TensorFlowModel.js

import React, {Component} from 'react';
import * as tf from '@tensorflow/tfjs';

class TensorFlowModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year:'',
            model: null,
            prediction: null,
            futureValuePrediction:null,
            modelTrained: false
        };
    }


    trainModel = async () => {
        const year = Number(this.state.year); // 获取年份数据
        console.log(year);
        if (!year) {
            alert('请先输入想要预测的年份');
            return;
        }

        // Step 1: 创建模型
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 16, inputShape: [1], activation: 'sigmoid', kernelRegularizer: tf.regularizers.l2({l2: 0.01}) })); // 使用 Sigmoid 激活函数和 L2 正则化
        model.add(tf.layers.dense({ units: 8, activation: 'sigmoid', kernelRegularizer: tf.regularizers.l2({l2: 0.01}) })); // 使用 Sigmoid 激活函数和 L2 正则化
        model.add(tf.layers.dense({ units: 1 }));

        // Step 2: 准备模型进行训练，指定损失函数和优化器
        const optimizer = tf.train.sgd(0.01); // 调整学习率
        model.compile({ loss: 'meanSquaredError', optimizer: optimizer });

        // Step 3: 生成示例数据
        const xs = tf.tensor2d([2017, 2018, 2019, 2020, 2021, 2022, 2023], [7, 1]); // 年份
        const ys = tf.tensor2d([111000, 121000, 141100, 161100, 181100, 231100, 241100], [7, 1]); // 对应年份的产值

        // Step 4: 训练模型
        await model.fit(xs, ys, {
            epochs: 500, // 增加训练周期
            callbacks: {
                onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
            }
        });

        // Step 5: 使用模型进行预测
        // 预测未来的年份
        const futureValueTensor = tf.tensor2d([year], [1, 1]);
        const futureValuePrediction = model.predict(futureValueTensor).dataSync()[0];

        // 更新状态
        this.setState({
            model: model,
            futureValuePrediction: futureValuePrediction,
            modelTrained: true
        });
    };

    change=(e)=>{
        this.setState({year:e.target.value})
    }

    render() {
        return (
            <div style={{marginTop:"20px",marginLeft:"20px"}}>
                <input onChange={(e)=>this.change(e)} value={this.state.year} placeholder={'输入需要预测的年份'}/>
                {this.state.modelTrained ? (
                    <p style={{color:"white"}}>模型训练完成，预测{this.state.year}年产值为: {this.state.futureValuePrediction}</p>
                ) : (
                    <p style={{color:"white"}}>模型正在训练中...</p>
                )}
                <button style={{borderRadius:"4px"}} onClick={()=>this.trainModel()}>预测</button>
            </div>
        );
    }
}

export default TensorFlowModel;

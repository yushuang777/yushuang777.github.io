import React, {Component} from 'react';

class Index extends Component {

    getAjax=(time)=>{
        return new Promise(resolve=>{
            setTimeout(()=>{
                resolve("time:"+time)
            },time*1000)
        })
    }

    click=()=>{
        Promise.all([this.getAjax(3),this.getAjax(1),this.getAjax(2)]).then(res=>{
            console.log(res)
        })
    }
    render() {
        return (
            <div>
                <button onClick={this.click}>实现promiseAll</button>
            </div>
        );
    }
}

export default Index;
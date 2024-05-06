import React, {Component} from 'react';

class Index extends Component {
    constructor() {
        super();
        this.state ={
            List:[{
                name:'小王',age:18
            },{
                name:'小王',age:19
            },{
                name:'小王',age:20
            },{
                name:'小王',age:21,index:1
            },{
                name:'小王',age:21,index:2
            }],
            findAge:'',
            filterAge:'',
        }
    }

    find=()=>{
        const findList=[{
            name:'小黑',age:9
        }]
        const find=this.state.List.find((item)=>{
            return item.age===21
        })
        findList.push(find)
        this.setState({findAge:findList,filterAge:''})
    }
    filter=()=>{
        const filter=this.state.List.filter((item)=>{
            return item.age===21
        })
        this.setState({filterAge:filter,findAge:''})
    }
    every=()=>{
        const a= [12, 54, 18, 130, 44].every(x => x >= 10); // true
        console.log(a)
    }
    entries=()=>{
        for (let [index,elem] of this.state.List.entries()) {
            console.log(index,elem);
        }
    }
    indexOf=()=>{
        const a=[1,2,2,2,2,3,8,8,5]
        const b=[]
        for(let i=0;i<=a.length;i++){
            if(b.indexOf(a[i])===-1){
                b.push(a[i])
            }
        }
    }
    includes=()=>{
        const a=[{name:'11',value:1},{name:'22',value:2},{name:'33',value:3}]
        console.log(a.includes({name:'11',value:1}))
    }
    render() {
        return (
            <div>
                {
                    this.state.findAge?
                        <div>
                            {
                                this.state.findAge.map((item,index)=>{
                                    return(
                                        <div key={index}>
                                            find:{item.name}
                                        </div>
                                    )
                                })
                            }
                        </div>:''
                }
                {
                    this.state.filterAge?
                        <div>
                            {
                                this.state.filterAge.map((item,index)=>{
                                    return(
                                        <div key={index}>
                                            filter:{item.name}
                                        </div>
                                    )
                                })
                            }
                        </div>:''
                }
                <button onClick={this.find}>find</button>
                <button onClick={this.filter}>filter</button>
                <button onClick={this.every}>检测方法every</button>
                <button onClick={this.values}>entries</button>
                <button onClick={this.indexOf}>indexOf</button>
                <button onClick={this.includes}>includes</button>
            </div>
        );
    }
}

export default Index;
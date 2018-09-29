class Observer {
    constructor(data) {
        this.observe(data);
    }
    observe(data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
            //  递归 调用，里面 没有数据，或者不是对象 会 return   
            this.observe(data[key])
        })
    }
    defineReactive(obj, key, value) {
        let that = this; 
        // 每个变化的数据都对应一个数组，这个数组 是存放所有更新的操作 
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true, // 可枚举
            configurable: true, // 可删除
            get() { // 当取值时候 调用的方法
                // 如果 有watcher 监控，就放在 Dep 数组里面。每个数据对象 对应一个数组。上面 get 
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set(newValue) {
                if (newValue != value) {
                    // obj[key] = newValue;
                    that.observe(newValue); // 如果是对象 继续劫持 
                    value = newValue
                    // 通知所有人 数据更新了。
                    dep.notify ();  
                }
            }
        })
    }
}

//  发布订阅 
class Dep{
    constructor(){
        this.subs=[]
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}



// ['a','b','c'].reduce((prev,next,index)=>{
//     console.log(prev,next,index)
//     return [prev]
// },{d:1})


// var data={
//     message:'hello',
//     person:{
//         name:'zhangsan',
//         family:{
//             name:'flow',
//             address:'shandong'
//         }
//     }
// }
// observe(data)

// function observe(data){
//     if (!data || typeof data !== 'object') {
//         return
//     }
//     Object.keys(data).forEach(key=>{
//         console.log(key)
//         defineReactive(data,key,data[key])
//         observe(data[key])
//     })
// }


function defineReactive(obj, key, value) {
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true, // 可删除
        get() { // 当取值时候 调用的方法
            console.log(value);
            return value;
        },
        set(newValue) {
            console.log(newValue,value)
            if (newValue != value) {
                value = newValue
            }
        }
    })
}



var  arr = [1, 2, 3, 4, 5];
sum = arr.reduce(function(prev, cur, index, arr) {

    // console.log(prev, cur, index);
    return prev + cur;
})
console.log(arr, sum);
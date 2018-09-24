// 观察者目的 给 需要变化的 元素 增加一个观察者 ，当数据变化后，执行对应的方法
class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.value = this.get();

    }
    getVal(vm, expr) {
        expr = expr.split('.');
        return expr.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    }
    get() {
        Dep.target = this;
        let value = this.getVal(this.vm, this.expr)
        Dep.target = null ;
        return value ;
    }
    //  对外暴露的方法 老值 和 新 值 不同时候 就 调用 update  
    update() {
        let newValue = this.getVal(this.vm, this.expr);
        let oldValue = this.value;
        if (oldValue != newValue) {
            this.cb(newValue);
        }
    }
}
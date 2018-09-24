class MVVM {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        if (this.$el) {
            // 数据劫持
            new Observer(this.$data);
            this.proxyData(this.$data);
            // 编译模板
            new Compile(this.$el, this)
        }
    }
    // 把 data 的数据 代理到 this  vm  实例  上 
    proxyData(data) {
        Object.keys(data).forEach((key) => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(newValue) {
                    data[key] = newValue
                }
            })
        })
    }
}
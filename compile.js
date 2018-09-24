class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? this.el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {
            // 1、 获取元素，移动到 framment 内存中
            let fragment = this.node2fragment(this.el);
            // 2、取出元素  的 v-model  和 文本的 大括号 

            this.compile(fragment);
            //  放回到 el 中

            this.el.appendChild(fragment)

        }
    }
    /* 辅助方法 */
    isElementNode(node) {
        return node.nodeType === 1
    }
    // 是否是指令 
    isDirectice(name) {
        return name.includes('v-');
    }

    /* 核心方法 */
    compileElement(node) {
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            let attrName = attr.name;
            let expr = attr.value;
            if (this.isDirectice(attrName)) {
                //let type = attr.slice(2);// substring(2)
                let [, type] = attrName.split('-'); // v-model   数组解构 赋值  
                CompileUnit[type](node, this.vm, expr)

            } else {
                CompileUnit['text'](node, this.vm, expr)
            }
        })
    }
    compileText(node) {
        let expr = node.textContent;
        let reg = /\{\{([^}]+)\}\}/g;
        if (reg.test(expr)) {
            CompileUnit['text'](node, this.vm, expr)
        }
    }
    compile(fragment) {
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node => {

            if (this.isElementNode(node)) {
                // 这里需要编译 元素
                this.compileElement(node);
                // 继续找
                this.compile(node)

            } else {
                // 节点 文本
                // 这里需要编译文本
                this.compileText(node);
            }
        })
    }
    node2fragment(el) {
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild)
        }
        return fragment
    }
}

CompileUnit = {
    getVal(vm, expr) {
        expr = expr.split('.');
        return expr.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    },
    getTextVal(vm, expr) {
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1]);
        })
    },
    text(node, vm, expr) {
        console.log(expr)
        let updateFn = this.updater['textUpdater']
        let value = this.getTextVal(vm, expr);

        // 监控 {{a}}
        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1], (newValue) => {
                // 如果数据变化了，文本节点需要重新获取依赖 的属性 更新文本内容  
                updateFn && updateFn(node, this.getTextVal(vm, expr))
            })
        })

        //  vm.$data[expr]   message.a
        updateFn && updateFn(node, value)

    },
    setValue(vm, expr, value) {
        expr = expr.split('.')
        //  方法 
        return expr.reduce((prev, next, currentIndex) => {
            if (currentIndex === expr.length - 1) {
                return prev[next] = value; 
            }
            return prev[next]
        }, vm.$data)
    },
    model(node, vm, expr) {
        let updateFn = this.updater['modelUpdater']

        new Watcher(vm, expr, (newValue) => {
            // 当值变化后 会调用 cb   把新的值 传 过来 
            updateFn && updateFn(node, this.getVal(vm, expr))
        })

        node.addEventListener('input', (e) => {
            let newValue = e.target.value;
            this.setValue(vm, expr, newValue);
        })
        //  vm.$data[expr]   message.a
        updateFn && updateFn(node, this.getVal(vm, expr))
    },
    updater: {
        textUpdater(node, value) {
            node.textContent = value;
        },
        modelUpdater(node, value) {
            node.value = value
        }
    }
}
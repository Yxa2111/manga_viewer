
export default class One {
    constructor() {
        this.val
        this.notEmpty = null
    }
    set(val) {
        this.val = val
        if (this.notEmpty) {
            this.notEmpty()
        }
    }
    async get() {
        if (!this.val) {
            await new Promise(res => {
                this.notEmpty = res
            })    
        }
        let ret = this.val
        this.val = null
        return ret
    }
    isEmpty() {
        return this.val == null
    }
}
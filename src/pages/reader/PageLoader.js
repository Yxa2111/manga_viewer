import JSZip from 'jszip'
import One from '../../one'
import {downloadBin} from '../../util'

async function extractZip(file, onProgress = null) {
    let zip = await JSZip.loadAsync(file)
    let entries = zip.filter(filterImg)
    let blobList = []
    entries.sort((a, b) => {
        return ('' + a.name).localeCompare(b.name)
    })
    console.log(entries)
    let cnt = 0
    for (let e of entries) {
        console.log(`extract ${e.name}`)
        let blob = await e.async('blob')
        blobList.push(blob)
        ++cnt
        if (onProgress) {
            onProgress({loaded: cnt, total: entries.length, name: e.name})
        }
    }
    return blobList
}

function filterImg(path) {
    const img_ext = ['.png', '.webp', '.bmp', '.jpg', '.jpeg']
    for (let ext of img_ext) {
        if (path.endsWith(ext)) {
            return !path.endsWith('cover' + ext)
        }
    }
    return false
}


class context {
    constructor(reqVal, loadRes) {
        this.reqVal = reqVal
        this.loadRes = loadRes
    }
}

class PageLoader {
    constructor(reader, state) {
        this.reader = reader
        this.reqCtx = new One()
        this.trxCurrent = 0
        this.trxMax = 0
        this.state = state
    }

    handleResp(reqCtx, resp) {
        let res = reqCtx.loadRes
        if (res) {
            res(resp)
        }
    }

    genStreamURL(ext) {
        return `${this.state.base_url}/show/${this.state.cb_id}/${ext}`
    }

    async tryLoadPage(ctx) {
        let pageNum = ctx.reqVal
        if (!this.reader.stream) {
            return this.handleResp(ctx, new Resp(StatusFail))
        }
        console.log(`try load page ${pageNum}`)
        if (this.reader.pages.page_exist(pageNum)) {
            return this.handleResp(ctx, new Resp(StatusSucc))
        }
        let [start, end, ext] = this.reader.pages.get_chunk(pageNum)
        if (start == 0) {
            return this.handleResp(ctx, new Resp(StatusFail))
        }
        this.state.loadingDetail = {
            name: ext,
            loaded: 0,
            total: 0,
            status: 'Prepare'
        }
        let file = await downloadBin(this.genStreamURL(ext), (e) => {
            this.state.loadingDetail = {
                name: ext,
                loaded: e.loaded,
                total: e.total,
                status: 'Load',
            }
        })

        this.state.loadingDetail = null
        let blobList = await extractZip(file, (e) => {
            this.state.loadingDetail = {
                name: ext,
                loaded: e.loaded,
                total: e.total,
                status: 'Extract',
            }
        })
        this.state.loadingDetail = null
        file = null
        if (blobList.length + start - 1 != end) {
            console.log(`load page ${pageNum} error: urllist size not match, len(bloblist)=${blobList.length} start=${start} end=${end}`)
            blobList = null
            return this.handleResp(ctx, new Resp(StatusFail))
        }
        let urllist = this.reader.pages.add_chunk(start, blobList)
        console.log(urllist)
        this.reader.replacePages(start, urllist)
        return this.handleResp(ctx, new Resp(StatusSucc))
    }

    Start() {
        (async () => {
                for (;;) {
                let ctx = await this.reqCtx.get()
                await this.tryLoadPage(ctx)
            }
        }) ()
    }

    checkTrx(trxID) {
        return this.trxCurrent <= trxID
    }

    NewSession() {
        return new Session(this.trxMax++, this)
    }

}

class TimeoutError extends Error {}

const StatusSucc = "Succ"
//const StatusTimeout = "Timeout"
const StatusFail = 'Fail'

class Resp {
    constructor(status, val) {
        this.status = status
        this.val = val
    }
}

class Session {
    constructor(trxID, loader) {
        this.trxID = trxID
        this.loader = loader
    }

    Req(val) {
        return new Promise((res, rej) => {
            if (!this.loader.checkTrx(this.trxID)) {
                return rej(new TimeoutError())
            }
            let ctx = new context(val, res)
            this.loader.trxCurrent = this.trxID
            this.loader.reqCtx.set(ctx)
        })
    }
}

export {
    extractZip,
    PageLoader
}
import { LRUMap } from "lru_map_yxa2111"

class BlobEntry {
    constructor(blobs, id) {
        let size = 0
        this.url = []
        for (let b of blobs) {
            if (b instanceof Blob) {
                size += b.size
                b = window.URL.createObjectURL(b)
                this.url.push(b)
            }
        }
        blobs = null
        this.size = size
        this.id = id
    }

    destroy() {
        for (let u of this.url) {
            window.URL.revokeObjectURL(u)
        }
        let ret = this.id
        this.url = null
        this.size = 0
        this.id = null
        return ret
    }
}

class LruBlob extends LRUMap {
    constructor(limit, del_cb) {
        del_cb = del_cb || (() => {})
        super(limit, null, e => e.size, (entry) => {
            let start = entry.destroy()
            del_cb(start)
        })
    }
}

export class Pages {
    constructor(pages, limit, del_cb) {
        this.chunks = []
        for (let p of pages) {
            this.chunks.push(new chunk(p[0], p[1], p[2], false))
        }
        this.blobs = new LruBlob(limit, (pageNum) => {
            let p = this.set_not_exist(pageNum)
            console.log(`revoke ${p.start}-${p.end}`)
            if (!p) {
                return
            }
            del_cb(p.start, p.end)
        })
    }
    _find_chunk(num) {
        for (let p of this.chunks) {
            if (num >= p.start && num <= p.end) {
                return p
            }
        }
        return null
    }
    page_exist(num) {
        let p = this._find_chunk(num)
        console.log(p)
        if (!p) {
            return false
        }
        return p.exist
    }
    set_exist(num) {
        let p = this._find_chunk(num)
        if (!p) {
            return
        }
        p.exist = true
    }
    set_not_exist(num) {
        let p = this._find_chunk(num)
        if (!p) {
            return null
        }
        p.exist = false
        return p
    }
    add_chunk(start, chunk_blobs) {
        let ch = this._find_chunk(start)
        if (ch == null) {
            return []
        }
        ch.exist = true
        let e = new BlobEntry(chunk_blobs, start)
        this.blobs.set(start, e)
        return e.url
    }
    get_chunk(pageNum) {
        let p = this._find_chunk(pageNum)
        if (!p) {
            return [0, 0, '']
        }
        return [p.start, p.end, p.tag]
    }
    revoke_all() {
        this.blobs.clear()
        for (let p of this.chunks) {
            p.exist = false
        }
    }
}

class chunk {
    constructor(start, end, tag, exist) {
        this.start = start
        this.end = end
        this.tag = tag
        this.exist = exist
    }
}
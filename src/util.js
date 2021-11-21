import axios from "axios";

function downloadBin(url, loadingFunc = null) {
    return axios.get(url, {
        responseType: 'arraybuffer',
        onDownloadProgress: loadingFunc
    }).then(resp => {
        let f = new File([resp.data], '')
        console.log(`${url} dl fin, size ${f.size}`)
        return f
    })
}

export {
    downloadBin
}
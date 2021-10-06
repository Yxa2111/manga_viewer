<template>
    <div data-app>
        <fullscreen ref="fullscreen" @change="fullscreenChange">
            <header-component v-show="showController"></header-component>
            <div :blobList="blobList" :is="readerMode" @imageclick="imageClick" v-if="blobList.length"></div>
            <controller-component v-show="showController" @toggleFullScreen="toggleFullScreen" v-bind:showDialog="showDialog" v-on:changeShowDialog="changeShowDialog($event)"></controller-component>
            <dialog-silder v-model="showDialog"></dialog-silder>
        </fullscreen>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import JSZip from 'jszip'
    import fullscreen from 'vue-fullscreen'
    import Vue from 'vue'
    import con from '../../constant'
    //import { LRUMap } from 'lru_map_yxa2111'

    Vue.use(fullscreen);
    //modules
    import ColumnReaderComponent from "./components/ColumnReader";
    import RowReaderComponent from "./components/RowReader";
    import RowReaderReverseComponent from "./components/RowReaderReverse";
    import ControllerComponent from "./components/Controller";
    import HeaderComponent from "./components/Header";
    import axios from 'axios'
    import {Pages} from '../../pages'
    import DialogSilder from './components/DialogSilder'
    import {PageLoader} from './PageLoader'

    export default {
        name: "Reader",
        data(){
            return {
                fullscreen: false,
                showController: true,
                blobList: [],
                defaultImg: null,
                pages: null,
                stream: false,
                showDialog: false,
                loader: null
            };
        },
        components: {
            ColumnReaderComponent,
            RowReaderComponent,
            RowReaderReverseComponent,
            ControllerComponent,
            HeaderComponent,
            DialogSilder
        },
        computed: {
            ...mapState(['currentFile', 'readerMode', 'currentTitle', 'currentTotal', 'currentPage', 'base_url', 'cb_id'])
        },
        methods: {
            ...mapMutations(['changeCurrentFile', 'changeCurrent']),
            imageClick(){
                this.showController = !this.showController;
            },
            async readComicFile(){
                let file = this.currentFile;

                if(!(file instanceof File) && !(file instanceof FileList)){
                    this.$router.push('/');
                    return;
                }

                if (file instanceof FileList) {
                    file = file[0]
                }

                // if(files.length > 1){
                //     this.readComicFileDir(files);
                //     return;
                // }

                let fileName = file.name;
                let reg = new RegExp(/(.*)\.(.*?)$/);
                let matches = fileName.match(reg);
                console.log(matches);
                if(matches){
                    fileName = matches[1];
                }
                console.log(this.currentTitle);


                if(this.currentTitle !== fileName){
                    //与历史记录不同的漫画，重置頁碼。
                    this.changeCurrent({currentTitle: fileName, currentPage: 1});
                }else{
                    this.changeCurrent({currentTitle: fileName});
                }
                
                return await this.readComicFileByType(file);
            },
            isImg(name) {
                if (name == null) {
                    return false
                }
                const ext = ['.png', '.webp', '.bmp', '.jpg', '.jpeg', '.gif']
                for (let e of ext) {
                    if (name.endsWith(e)) {
                        return true
                    }
                }
                return false
            },
            readComicFileByType(file){
                console.log(this.$store.state.book_type)
                switch (this.$store.state.book_type) {
                    case 'stream':
                        return this.readComicFileStream(file)
                    default:
                        return this.readComicFileZip(file)
                        //alert('不支持文件格式'+file.type)
                }
            },
            numToStrPrefix(num) {
                let s = `${num}`
                while (s.length < 9) {
                    s = '0' + s
                }
                return s
            },
            async readComicFileStream(file) {
                this.stream = true
                let text = await file.text()
                console.log(text)
                let pages = JSON.parse(text)['pages']
                let total = 0
                let chunks = []
                for (let p of pages) {
                    chunks.push([p['range'][0], p['range'][1], p['ext']])
                    total = Math.max(total, p['range'][1])
                }
                console.log(`total page: ${total}`)
                this.blobList = []
                for (let i = 0; i < total; i++) {
                    this.blobList.push({
                        name: `${this.numToStrPrefix(i)}.jpg`,
                        blob: this.defaultImg
                    })
                }
                this.changeCurrent({
                    currentTotal: total
                });
                console.log(this.blobList)
                this.pages = new Pages(chunks, con.PAGE_CACHE_SIZE, (start, end) => this.replaceDefaultImg(start, end))
                this.loader = new PageLoader(this, this.$store.state)
                this.loader.Start()
            },
            async readComicFileZip(file){
                console.log(file)
                let vueObj = this;
                let blobList = [], fileNum = 0, fileFinishNum = 0;
                let isImg = this.isImg
                JSZip.loadAsync(file)                                   // 1) read the Blob
                    .then(function(zip) {
                        zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                            if (!isImg(zipEntry.name)) {
                                return
                            }
                            fileNum++;
                            if (!zipEntry.dir) {
                                zipEntry.async('blob').then(function (content) {
                                    blobList.push({
                                        name: zipEntry.name,
                                        blob: window.URL.createObjectURL(content)
                                    });
                                    fileFinishNum++;
                                    if(fileFinishNum === fileNum){
                                        vueObj.sortBlobList(blobList);
                                    }
                                });
                            }
                        });
                    }, function (e) {
                        alert('读取zip出错' + e)
                    });
            },
            readComicFileDir(files){
                let blobList = [];

                files.forEach((item)=>{
                    blobList.push({
                        name: item.name,
                        blob: window.URL.createObjectURL(new Blob([item])),
                    });
                });
                //this.sortBlobList(blobList);
            },
            sortBlobList(blobList){
                blobList.sort((x, y) => {
                    let xName = x.name
                    let yName = y.name;
                    if(xName < yName){
                        return -1;
                    }else if(xName === yName){
                        return 0;
                    }else{
                        return 1;
                    }
                });

                this.changeCurrent({
                    currentTotal: blobList.length
                });

                this.blobList = blobList;
                console.log(blobList);
            },
            toggleFullScreen () {
                this.$refs['fullscreen'].toggle() // recommended
                // this.fullscreen = !this.fullscreen // deprecated
            },
            fullscreenChange (fullscreen) {
                this.fullscreen = fullscreen
            },
            replacePageImg(pageNum, bloburl) {
                pageNum--
                if (pageNum < 0 || pageNum >= this.blobList.length) {
                    return
                }
                this.blobList[pageNum].blob = bloburl
            },
            replaceDefaultImg(start, end) {
                for (let i = start; i <= end; i++) {
                    this.replacePageImg(i, this.defaultImg)
                }
            },
            replacePages(start, bloburls) {
                for (let i = 0; i < bloburls.length; i++) {
                    console.log(`replace ${bloburls[i]} index ${i}`)
                    this.replacePageImg(start + i, bloburls[i])
                }
            },
            async pageLoadPlan(pageNum) {
                try {
                    let session = this.loader.NewSession()
                    if (!this.pages.page_exist(pageNum)) {
                        await session.Req(pageNum)
                    }
                    console.log(`page ${pageNum} load fin`)
                    let [start, end] = this.pages.get_chunk(pageNum)
                    console.log(`${start} ${end} ${pageNum}`)
                    if (start > 0 && pageNum >= start + parseInt((end - start + 1) / 2)) {
                        console.log(`preload next page ${end + 1}`)
                        await session.Req(end + 1)
                    }
                } catch {
                    // maybe timeout
                }
            },
            changeShowDialog(v) {
                this.showDialog = v
            }
        },
        mounted(){
            axios.get('./default.jpg', {
                responseType: 'arraybuffer',
            }).then(resp => {
                this.defaultImg = window.URL.createObjectURL(new File([resp.data], 'default.jpg'))
                this.readComicFile().then(() => {
                    this.pageLoadPlan(this.currentPage)
                })
            })
            setTimeout(()=>{
                this.showController = false;
            }, 2000);
        },
        watch: {
            currentPage: function(val) { if (this.stream) {this.pageLoadPlan(val)} }
        }
    }
</script>

<style lang="stylus" scoped>

</style>

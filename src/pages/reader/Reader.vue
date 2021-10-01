<template>
    <div>
        <fullscreen ref="fullscreen" @change="fullscreenChange">
            <header-component v-show="showController"></header-component>
            <div :blobList="blobList" :is="readerMode" @imageclick="imageClick" v-if="blobList.length"></div>
            <controller-component v-show="showController" @toggleFullScreen="toggleFullScreen"></controller-component>
        </fullscreen>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import JSZip from 'jszip'
    import fullscreen from 'vue-fullscreen'
    import Vue from 'vue'
    Vue.use(fullscreen);
    //modules
    import ColumnReaderComponent from "./components/ColumnReader";
    import RowReaderComponent from "./components/RowReader";
    import RowReaderReverseComponent from "./components/RowReaderReverse";
    import ControllerComponent from "./components/Controller";
    import HeaderComponent from "./components/Header";

    export default {
        name: "Reader",
        data(){
            return {
                fullscreen: false,
                showController: true,
                blobList: [],
            };
        },
        components: {
            ColumnReaderComponent,
            RowReaderComponent,
            RowReaderReverseComponent,
            ControllerComponent,
            HeaderComponent
        },
        computed: {
            ...mapState(['currentFile', 'readerMode', 'currentTitle', 'currentTotal', 'currentPage'])
        },
        methods: {
            ...mapMutations(['changeCurrentFile', 'changeCurrent']),
            imageClick(){
                this.showController = !this.showController;
            },
            readComicFile(){
                let file = this.currentFile;

                if(!(file instanceof File) && !(file instanceof FileList)){
                    this.$router.push('/');
                    return;
                }

                // if(files.length > 1){
                //     this.readComicFileDir(files);
                //     return;
                // }
                console.log(file)

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
                
                this.readComicFileZip(file);
                // switch (file.type) {
                //     case 'application/x-zip-compressed':
                //     case 'application/zip':
                //     case 'application/x-cbz':
                        
                //         break;
                //     default:
                //         alert('不支持文件格式'+file.type)
                // }
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
            readComicFileZip(file){
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
            }
        },
        mounted(){
            this.readComicFile();
            setTimeout(()=>{
                this.showController = false;
            }, 2000);
        }
    }
</script>

<style lang="stylus" scoped>

</style>

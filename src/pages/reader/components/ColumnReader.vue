<template>
    <div class="images-wrapper" @click="imageClick" ref="images-wrapper" key="images-wrapper">
        <div>
            <div class="image-wrapper" v-for="(item, index) of list" :key="item.item.name" :ref="'images-'+index">
                <img :src="item.item.blob" @load="fixImageScroll" />
            </div>
        </div>
        <div class="pagination"><span>{{currentPage}}/{{currentTotal}}</span></div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex'
    import BScroll from 'better-scroll'
    import constant from '../../../constant'
    export default {
        name: "ColumnReader",
        props: {
            blobList: {
                type: Array,
                default(){
                    return [];
                }
            }
        },
        data(){
            return {
                selfChangePage: 0,
                list: [],
                lastIndex: -1
            }
        },
        computed: {
            ...mapState(['currentTitle', 'currentTotal', 'currentPage']),
            ...mapGetters(['currentGetters']),
        },
        methods: {
            ...mapMutations(['changeCurrent']),
            imageClick(){
                this.$emit('imageclick');
            },
            imagesScroll(){
                let containerHalfHeight = this.$refs['images-wrapper'].offsetHeight / 2;
                //计算页数，图片底部位置不足半个页面，计算为下一页。
                let index = 0;
                for(; index < this.list.length; index++){
                    if(this.$refs['images-'+index][0].getBoundingClientRect().bottom > containerHalfHeight){
                        break;
                    }
                }
                console.log(this.$refs['images-'+index][0].getBoundingClientRect().bottom);
                console.log(`list index ${index}`)
                this.selfChangePage = index;
                index = this.list[index].page
                console.log('滾動：'+index);
                this.changeCurrent({currentPage: index});
                console.log(this.list)
            },
            fixImageScroll(){
                //dom结构变化，必须refresh()。这里必须refresh，不然会无法scroll还有返回scrollTop=0等等情况。
                this.scroll.refresh();
                let index = this.getPageIndex(this.currentPage);
                console.log(index)
                this.scroll.scrollToElement(this.$refs['images-'+index][0]);
            },
            initDom() {
                let index = (this.currentPage - 1)
                index = index - (index % constant.MAX_PAGE_SIZE)
                if (this.lastIndex >= 0 && parseInt(this.lastIndex / constant.MAX_PAGE_SIZE) == parseInt(index / constant.MAX_PAGE_SIZE)) {
                    return
                }
                this.lastIndex = index
                this.list = []
                for (let i = Math.max(index - 1, 0); i < Math.min(this.blobList.length, index + constant.MAX_PAGE_SIZE + 1); i++) {
                    console.log(`init img dom ${i}`)
                    this.list.push({item: this.blobList[i], page: i + 1})
                }
                console.log(this.list)
            },
            getPageIndex(pageNum) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].page == pageNum) {
                        return i
                    }
                }
                return 0
            }
        },
        watch: {
            currentPage(){
                this.initDom()
                let index = this.getPageIndex(this.currentPage)
                if(index !== this.selfChangePage){
                    this.scroll.scrollToElement(this.$refs['images-'+index][0]);
                }
            }
        },
        mounted() {
            console.log(constant.MAX_PAGE_SIZE)
            this.scroll = new BScroll(this.$refs['images-wrapper'], {
                click: true,
                mouseWheel: {
                    speed: 20,
                    invert: false,
                    easeTime: 1000
                },
                pullDownRefresh: {
                    threshold: 50,
                    stop: 20
                }
            });
            this.initDom()
            this.scroll.on('touchEnd', this.imagesScroll);
            //this.scroll.on('scrollEnd', this.imagesScroll)
        },
        destroyed() {
            delete this.scroll;
        }
    }
</script>

<style lang="stylus" scoped>
    .images-wrapper
        background #333
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        overflow hidden
        .image-wrapper
            width 100%;
            text-align center
            img
                width 100%;
        .pagination
            span
                color: white
                background rgba(0,0,0,0.4)
                font-size smaller
                padding: .06rem .12rem
                position fixed
                right 0
                bottom 0
</style>

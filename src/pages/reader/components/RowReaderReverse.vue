<template>
    <div class="swiper-container" @click="imageClick">
        <swiper class="swiper-wrapper" :options="swiperOptions" ref="mySwiper" @slideChange="swiperSlideChange" dir="rtl">
            <!-- slides -->
            <swiper-slide class="swiper-slide" v-for="item of list" :key="item.item.name">
                <div class="swiper-zoom-container">
                    <img :src="item.item.blob" />
                </div>
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex'
    import constant from '../../../constant'

    export default {
        name: "RowReaderReserve",
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
                swiperOptions: {
                    initialSlide: (this.$store.state.currentPage - 1),
                    // initialSlide: (this.$store.state.currentTotal - this.$store.state.currentPage),
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'custom',
                    //     clickable: true
                        renderCustom(swiper, total, current) {
                            // current = total - current + 1;
                            return '<span>'+current+' / '+total+'</span>';
                        }
                    },
                    keyboard: true,
                    mousewheel: true,
                    zoom: true
                },
                list: [],
                lastIndex: -1
            }
        },
        computed: {
            ...mapState(['currentTitle', 'currentTotal', 'currentPage',]),
            ...mapGetters(['currentGetters']),
            swiper() {
                return this.$refs.mySwiper.swiper
            }
        },
        methods: {
            ...mapMutations(['changeCurrent']),
            imageClick(){
                this.$emit('imageclick');
            },
            swiperSlideChange(){
                // this.changeCurrent({currentPage: (this.currentTotal - this.swiper.realIndex)});
                this.changeCurrent({currentPage: this.list[this.swiper.realIndex].page});
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
                return 1
            }
        },
        watch: {
            currentPage(){
                this.initDom()
                let swiper = this.swiper;
                let swiperIndex = swiper.realIndex;
                let currentPage = this.getPageIndex(this.currentPage)
                if(swiperIndex !== currentPage){
                    swiper.slideTo(currentPage, 100, false);
                }
            }
            // currentPage(){
            //     let swiper = this.swiper;
            //     let swiperIndex = swiper.realIndex;
            //     let currentPage = this.currentTotal - this.currentPage;
            //     if(swiperIndex !== currentPage){
            //         swiper.slideTo(currentPage, 100, false);
            //     }
            // }
        },
        mounted() {
            this.initDom()
        }
    }
</script>

<style lang="stylus" scoped>
    .swiper-container >>> .swiper-pagination
        span
            color: white
            background rgba(0,0,0,0.4)
            font-size smaller
            padding: .06rem .12rem
            position fixed
            right 0
            bottom 0
    .swiper-container
        background #333
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        .swiper-slide
            overflow hidden
            .swiper-zoom-container
                width 100%
                height 100%
                img
                    max-width 100%
                    max-height 100%
                    margin auto
</style>

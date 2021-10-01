<template>
    <div>
        <file-selector-component></file-selector-component>
    </div>
</template>

<script>
    import FileSelectorComponent from "./components/FileSelector";

    export default {
        name: "Index",
        components: {
            FileSelectorComponent
        },
        methods: {
            GetRequest() {
                let url = location.search; //获取url中"?"符后的字串
                let theRequest = new Object();
                let strs = [];
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    for(var i = 0; i < strs.length; i ++) {
                        theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
                    }
                }
                console.log(theRequest)
                return theRequest;
            }
        },
        
        mounted() {
            if (this.GetRequest()['url'] != null) {
                console.log(this.GetRequest()['url'])
                this.$store.state.url = this.GetRequest()['url']
                this.$router.push('/loading')
            }
        }

    }
</script>

<style scoped>

</style>

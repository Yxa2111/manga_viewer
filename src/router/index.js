import Vue from 'vue';
import VueRouter from 'vue-router';

//pages
import IndexComponent from '@/pages/index/Index'
import ReaderComponent from '@/pages/reader/Reader'
import NotFoundComponent from '@/pages/404'
import LoadingComponent from '@/pages/loading/Loading'

Vue.use(VueRouter);

let routes = [
    {path: '/', component: IndexComponent},
    {path: '/reader', component: ReaderComponent},
    {path: '/loading', component: LoadingComponent},
    {path: '*', component: NotFoundComponent}
];
let router = new VueRouter({
    routes
});
export default router;

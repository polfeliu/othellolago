import Vue from 'vue'
import VueRouter from "vue-router";
Vue.use(VueRouter)


// deprecated, lazy load loads the modules dynamically
//import Home from './routes/Home.vue';
//import Register from './routes/Register.vue';
//import Login from './routes/Login.vue';
//import ElementView from "@/routes/ElementView";

function lazyload(view){
    return() => import(`@/routes/${view}.vue`)
}

import store from "@/plugins/store";

function guard(to, from, next) {
    if(store.state.auth.logged == true){
        next()
    }else{
        next('/login')
    }
}
const routes = [
    { path: '/', component: lazyload('Home') },
    { path: '/foto', component: lazyload('Foto')  },
    { path: '/guesses', component: lazyload('Guesses')  },
    { path: '/register', component: lazyload('Register'),  },
    { path: '/login', component: lazyload('Login') },
    { path: '/Elementview/:id', component: lazyload('ElementView')},
    { path: '/Nickname', component: lazyload('Nickname')},
    { path: '/Questions', component: lazyload('Questions')},
    { path: '/dashboard', component: lazyload('Dashboard'), beforeEnter: guard,
    children:[
        {path: 'info1', component: lazyload('DashboardViews/info1')},
        {path: 'Charts', component: lazyload('DashboardViews/Charts')},
        {path: 'Expenses', component: lazyload('DashboardViews/Expenses')},
        {path: 'Pots', component: lazyload('DashboardViews/Pots')},
        {path: '*'}
    ]},
    { path: '*', component: lazyload('Error')}
];

export default new VueRouter({routes: routes});
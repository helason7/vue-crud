
//import createApp from Vue
import { createApp, ref } from 'vue';
// import {Bootstrap} from 'bootstrap';

//import component App
import App from './App.vue';

//import config router
import router from './router'

// import {bootstrap} from 'bootstrap/dist/css/bootstrap.css'
// import  {BootstrapVue} from 'bootstrap-vue/dist/bootstrap-vue.css'
//create App Vue
const app = createApp(App);

//gunakan "router" di Vue dengan plugin "use"
app.use(router);
// app.use(Bootstrap);  

app.mount('#app');
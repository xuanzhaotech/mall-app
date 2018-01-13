import Vue from 'vue';
import axios from 'axios';
Vue.prototype.$http = axios;
import exampleApp from './example-app.vue';
import '../../../public/style/common.scss';
$(document).ready(function(){
    new Vue({
        el: '#app',
        template: '<exampleApp/>',
        components: {exampleApp}
    });
});
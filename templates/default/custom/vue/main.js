// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

/* eslint-disable no-new */
if(document.getElementById("vue-example")) {
    const Example = require('./Example').default;

    Vue.config.productionTip = false;

    new Vue({
        el: '#vue-example',
        components: {Example},
        template: '<Example/>',
    });
}

import Vue from 'vue';

import './index.less'
import App from './test.vue';
new Vue({
  el: '#app',
  mounted() {
    console.log(this);
  },
  render: h => h(App),
});

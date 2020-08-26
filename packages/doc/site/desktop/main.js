import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import router from "./router";
import App from "./App.vue";
import demoBlock from "./components/demo-block";
import search from "./components/Search";
Vue.use(VueCompositionApi);
Vue.component("demo-block", demoBlock);
Vue.component("search", search);
new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
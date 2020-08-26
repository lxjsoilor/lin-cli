<template>
    <form class="">
        <input
            id="algolia-search-input"
            class="search-query"
            placeholder="搜索文档"
        />
    </form>
</template>

<script>
import "docsearch.js/dist/cdn/docsearch.min.css";

export default {
    name: "DocsearchBox",

    props: {
        options: {
            type: Object,
            default: () => {}
        }
    },

    watch: {
        options(newValue) {
            // this.$el.innerHTML = '<input class="form-control d-flex ml-2 mr-auto algolia-search-input search-query" id="asalgolia-search-input" placeholder="搜索文档">';

            this.initialize(newValue);
        }
    },

    mounted() {
        this.initialize();
    },

    methods: {
        initialize() {
            if (window) {
                import("docsearch.js").then(({ default: docsearch }) => {
                    console.log(this.options);
                    docsearch(
                        Object.assign(
                            {},
                            {
                                // apiKey: "feb33c2506cdece7f0267859a856767a",
                                // indexName: "wevue",
                                apiKey: "feb33c2506cdece7f0267859a856767a",
                                indexName: "wevue",
                                inputSelector: "#algolia-search-input",
                                debug: true // Set debug to true if you want to inspect the dropdown
                            }
                        )
                    );
                });
            }
        }
    }
};
</script>

<style scoped lang="less">
.search-query {
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 15px 0 30px;
    border: 1px solid #e3e3e3;
    color: #273849;
    outline: none;
    border-radius: 15px;
    margin-right: 10px;
    transition: border-color 0.2s ease;
    background: #fff url(https://cn.vuejs.org/images/search.png) 8px 5px
        no-repeat;
    background-size: 20px;
    vertical-align: middle !important;
    &:focus {
        border: 1px solid #8080ff;
    }
}
</style>

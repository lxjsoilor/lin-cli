<template>
    <div id="app">
        <Header :logo="logo" :title="title"></Header>
        <Nav :list="list"/>
        <Container>
            <router-view />
        </Container>
    </div>
</template>
<script>
import { reactive, computed, toRefs, ref  } from '@vue/composition-api'
import { config, documents } from 'site-shared';

import Header from './components/Header';
import Nav from './components/Nav';
import Container from './components/Container'
export default{
    components: {
        Header,
        Nav,
        Container
    },
    setup() {
        const count = ref(0)
        const site = config.site;
        const list = site.locales[site.defaultLang].nav
        const { logo, title } = site.locales[site.defaultLang]
        return {
            list,
            logo,
            title
        }
    }
}
</script>
<style lang="less">
 html, body {
     margin: 0;
     padding: 0;
 }
 body {
     background: #f7f8fa;
 }

.card {
    margin-bottom: 24px;
    padding-top: 15px ;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 12px #ebedf0;
    h3, h2, p, table, pre{
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 10px;
        margin-bottom: 0px;
    }
    pre{
        padding-bottom: 15px;
    }
    table{
        width: calc(100% - 40px);
    }
}

</style>
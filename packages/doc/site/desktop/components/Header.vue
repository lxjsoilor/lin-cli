<template>
    <div class="v-header">
        <div class="v-header-logo">
            <img :src="logo" alt="" srcset="" />
            <div class="v-header-title">{{ title }}</div>
        </div>
        <div class="v-header-top">
            <search />
        </div>
    </div>
</template>
<script>
import { reactive, computed, toRefs, ref } from "@vue/composition-api";
export default {
    name: "v-nav",
    props: {
        logo: String,
        title: String
    }
};
</script>
<style lang="less" scoped>
.v-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-logo {
        // color: honeydew;
        width: 220px;
        line-height: 60px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    &-title {
        color: #515a6e;
        height: 25px;
        line-height: 25px;
        padding-left: 15px;
        border-left: 1px solid #ebedee;
        margin-left: 15px;
    }
}
</style>

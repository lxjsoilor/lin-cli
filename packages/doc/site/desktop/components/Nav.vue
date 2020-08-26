<template>
    <div class="v-nav">
        <div class="v-nav-group" v-for="(group, idx) in list" :key="idx">
            <div v-if="!group.path" class="v-nav-title">{{ group.title }}</div>
            <div
                v-if="group.path"
                class="v-nav-item title"
                @click="changeCurrent(idx, '-1')"
            >
                <router-link
                    :class="{ active: current == idx + '-' + '-1' }"
                    :to="group.path"
                    v-html="group.title"
                />
            </div>

            <template v-if="group.items">
                <div
                    v-for="(item, index) in group.items"
                    :key="index"
                    @click="changeCurrent(idx, index)"
                    class="v-nav-item"
                >
                    <router-link
                        v-if="item.path"
                        :class="{ active: current == idx + '-' + index }"
                        :to="item.path"
                        v-html="item.title"
                    />
                    <a
                        v-else-if="item.link"
                        :href="item.link"
                        v-html="item.title"
                    />
                    <a v-else v-html="item.title" />
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { reactive, computed, toRefs, ref } from "@vue/composition-api";
export default {
    name: "v-nav",
    props: {
        list: Array
    },
    setup(props) {
        const current = ref(null);
        const changeCurrent = (idx, index) => {
            current.value = idx + "-" + index;
        };
        return {
            current,
            changeCurrent
        };
    }
};
</script>
<style lang="less" scoped>
.v-nav {
    position: fixed;
    top: 61px;
    bottom: 0;
    left: 0;
    z-index: 1;
    min-width: 220px;
    max-width: 220px;
    padding: 24px 0 72px;
    overflow-y: scroll;
    background-color: #fff;
    box-shadow: 0 8px 12px #ebedf0;

    &-group {
        // margin-bottom: 16px;
    }

    &-title {
        padding: 8px 0 8px 30px;
        color: #455a64;
        font-weight: 500;
        font-size: 15px;
        line-height: 28px;
    }

    &-item {
        padding-left: 15px;
        a {
            display: block;
            margin: 0px 0 8px 30px;
            color: #455a64;
            font-size: 14px;
            line-height: 28px;
            -webkit-transition: color 0.2s;
            transition: color 0.2s;
            cursor: pointer;
            text-decoration: none;
            &:hover,
            &.active {
                color: #2d8cf0;
                border-right: 2px solid red;
            }
        }
        &.title {
            padding-left: 0;
            a {
                font-size: 15px;
            }
        }
    }
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: transparent;
        border-radius: 6px;
    }
}
</style>
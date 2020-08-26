<template>
    <div class="demo-block">
        <div class="demo-block-source">
            <slot name="source"></slot>
        </div>
        <div class="demo-block-code" :class="{ active: showCode }">
            <slot />
        </div>
        <div class="demo-block-control" @click="showCode = !showCode">
             {{ showCode ? '隐藏代码' : '显示代码' }}
        </div>
    </div>
</template>
<script>
import { reactive, computed, toRefs, ref  } from '@vue/composition-api'

export default{
    components: {
        
    },
    setup() {
        const showCode = ref(false)
        return {
            showCode,
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../common/style/highlight';
.demo-block{
    &-source{
        margin: 15px 20px;
    }
    &-code{
        display: none;
        background: #fafafa;
        padding: 5px 20px;
        &.active{
            display: block;
        }
    }
    &-control{
        text-align: center;
        color: #d3dce6;
        border-top: 1px solid #eaeefb;
        height: 44px;
        line-height: 44px;
        cursor: pointer;
        &:hover{
            color: #409eff;
        }
    }
}
</style>
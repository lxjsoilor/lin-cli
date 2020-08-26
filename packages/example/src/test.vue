<template>
    <div id="app">
        <div class="v-test">
        test {{test}}
    </div>
    </div>
    
</template>
<script>
export default {
    data() {
        return {
            test:'123'
        }
    }
}
</script>
<style lang="less" scoped>
.v-test{
    height: 100;
    width: 200;
    background: grey;
}
</style>
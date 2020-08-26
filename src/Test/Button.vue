<template>
    <div class="v-button" @click="handle()">按钮 </div>
</template>
<script>
export default {
    name: 'v-button',
    methods: {
        handle() {
            this.$emit('click')
        }
    }   

}
</script>

<style lang="less" scoped>
 .v-button{
     background: chocolate;
     display: inline-block;
     color: #fff;
     padding: 5px 15px;
     cursor: pointer;
     &:hover{
         background: #333333;
     }
 }
</style>
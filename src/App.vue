<template>
    <h1>{{ msg }}</h1>
    <cascader-panel ref="panel" v-model="value" :options="options" @on-change="onChange"></cascader-panel>
    <div style="border: 1px solid red"><p>value:</p>{{ value }}</div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {cascaderValue} from "@/data/cascaderValue";
import CascaderPanel from "@/components/CascaderPanel.vue";

const panel = ref<any>(null);
const msg = ref<string>('QWQ');
const value = ref<Array<any>>([[273000025, 273000030], [273000025, 273000028], [273000025, 273000040, 273000041]])
const options = ref<Array<any>>(cascaderValue)

const onChange = () => {
    console.log('App-Change', value.value)
}
</script>

<style lang="scss" scoped>
.cascader-panel {
    height: 50vh;
}
</style>

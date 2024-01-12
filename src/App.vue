<template>
    <h1>{{ msg }}</h1>
    <p>
        <label>
            <input v-model="limit" type="radio" :value="1" @change="onRefresh" />单选
        </label>
    </p>
    <p>
        <label>
            <input v-model="limit" type="radio" :value="3" @change="onRefresh" />多选-3条
        </label>
    </p>
    <p>
        <label>
            <input v-model="limit" type="radio" :value="Infinity" @change="onRefresh" />多选-无限
        </label>
    </p>
    <cascader-panel ref="panel" v-if="showPanel" v-model="value" :limit="limit" :options="options" @on-change="onChange"></cascader-panel>
    <div style="border: 1px solid red"><p>{{ limit === 1 ? '单选' : '多选' }} value:</p>{{ value }}</div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {cascaderValue} from "@/data/cascaderValue";
import CascaderPanel from "@/components/CascaderPanel.vue";

const panel = ref<any>(null);
const showPanel = ref<boolean>(true);
const msg = ref<string>('QWQ');
const limit = ref<number>(Infinity);
const value = ref<Array<any>>([[273000025, 273000030], [273000025, 273000028], [273000025, 273000040, 273000041]])
const options = ref<Array<any>>(cascaderValue)

const onRefresh = () => {
    showPanel.value = false
    value.value = []
    setTimeout(() => {
        showPanel.value = true
    }, 50)
}
const onChange = () => {
    console.log('App-Change', value.value)
}
</script>

<style lang="scss" scoped>
.cascader-panel {
    height: 50vh;
}
</style>

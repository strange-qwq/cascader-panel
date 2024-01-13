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
    <cascader-panel
        ref="panel"
        v-if="showPanel"
        v-model:modelValue="value"
        v-model:label-value="label"
        :limit="limit"
        :options="options"
        @change="onChange"
    ></cascader-panel>
    <div style="border: 1px solid red">
        <p>当前模式： {{ limit === 1 ? '单选' : '多选' }}</p>
        <p>label: {{ label }}</p>
        <p>value: {{ value }}</p>
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {cascaderValue} from "@/data/cascaderValue";
import CascaderPanel from "@/components/CascaderPanel.vue";

const panel = ref<any>(null);
const showPanel = ref<boolean>(true);
const msg = ref<string>('QWQ');
const limit = ref<number>(Infinity);
// 测试数据1
// const value = ref<Array<any>>([[273000025, 273000030], [273000025, 273000028], [273000025, 273000040, 273000041]])
// 测试数据2
const value = ref<Array<any>>([["273000025", "273000040", "273000041"]])
const label = ref<Array<string>>([])
const options = ref<Array<any>>(cascaderValue)

const onRefresh = () => {
    showPanel.value = false
    value.value = []
    label.value = []
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

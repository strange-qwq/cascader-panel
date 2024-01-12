<template>
    <div class="cascader-panel">
        <div class="cascader-panel-box">
            <div v-for="(key, index) in options" :key="index" class="item-box" @click="activeIndex = index">
                <div class="item-left">
                    <!-- TODO 需要修改为多选框，并实现未选中、已选中、半选中样式 -->
                    <p v-if="hashObject[key.value]?.selectStatus === 0" class="unselect" @click="onSelect(key, index)">0</p>
                    <p v-else-if="hashObject[key.value]?.selectStatus === 1" class="selected" @click="onUnselect(key, index)">1</p>
                    <p v-else class="half-select" @click="onSelect(key, index)">2</p>
                    <p>{{ key.label }}</p>
                </div>
                <p v-if="key.children && key.children.length > 0" class="item-right">&gt;</p>
            </div>
        </div>
        <cascader-panel
            v-if="activeIndex != null && options[activeIndex]?.children"
            ref="children"
            :level="level + 1"
            :options="options[activeIndex].children"
            @update:modelValue="onChangeModelValue"
        ></cascader-panel>
    </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref} from "vue"

const props = defineProps({
    options: {
        type: Array<any>,
        required: true
    },
    modelValue: {
        type: Array<Array<string>>,
        default: () => []
    },
    level: {
        type: Number,
        default: 1
    }
})

const emits = defineEmits(['update:modelValue', 'on-change'])

const activeIndex = ref<number>(null)
if (!window["__checkedHashObject__"]) {
    window["__checkedHashObject__"] = ref<any>({})
}
const hashObject = window["__checkedHashObject__"]

onBeforeMount(() => {
    // 仅第一层初始化
    if (props.level !== 1) return
    // 获取所有已选中的最后一层
    const hashModelValue: any = {}
    for (let it of props.modelValue) {
        hashModelValue[it[it.length - 1]] = true
    }
    // 反选父级状态
    const parentSelect = (parentId: string) => {
        const parent = hashObject.value[parentId];
        for (let i of parent.it.children) {
            if (hashObject.value[i.value].selectStatus !== 1) {
                hashObject.value[parentId].selectStatus = 2
                return
            }
        }
        hashObject.value[parentId].selectStatus = 1
    }
    // 初始化hashObject
    const initHashObject = (options: Array<any>) => {
        for (let it of options) {
            let values: Array<any>
            const parent = hashObject.value[it.dicPid]
            const self = !!hashModelValue[it.value]
            if (parent) {
                values = [...parent.values, it.value]
            } else if (it.dicPid) {
                values = [it.dicPid, it.value]
            } else {
                values = [it.value]
            }
            const selectObj = {
                selectStatus: self ? 1 : 0,
                isLast: false,
                values,
                it
            }
            hashObject.value[it.value] = selectObj
            if (it.children && it.children.length > 0) {
                initHashObject(it.children)
            } else {
                selectObj.isLast = true
            }
        }
    }
    initHashObject(props.options)
    // 初始化父级状态
    const initSelectStatus = (options: Array<any>) => {
        for (let it of options) {
            const parent = hashObject.value[it.dicPid]
            const self = !!hashModelValue[it.value]
            if (self && parent) {
                parentSelect(it.dicPid)
            }
            if (it.children && it.children.length > 0) {
                initSelectStatus(it.children)
            }
        }
    }
    initSelectStatus(props.options)
})

/**
 * 选中事件
 * @param key   键
 * @param index 下标
 */
const onSelect = (key: any, index: number) => {
    hashObject.value[key.value].selectStatus = 1
    if (key.children && key.children.length > 0) {
        for (let it of key.children) {
            onSelect(it, index)
        }
    }
    loopSelect(key)
    antiShake(onChangeModelValue)
}
const loopSelect = (key: any) => {
    const parent = hashObject.value[key.dicPid];
    if (parent) {
        parent.selectStatus = parent.it.children.every((it: any) => hashObject.value[it.value].selectStatus === 1) ? 1 : 2
        loopSelect(parent.it)
    }
}
/**
 * 取消选中事件
 * @param key   键
 * @param index 下标
 */
const onUnselect = (key: any, index: number) => {
    hashObject.value[key.value].selectStatus = 0
    if (key.children && key.children.length > 0) {
        for (let it of key.children) {
            onUnselect(it, index)
        }
    }
    loopUnselect(key)
    antiShake(onChangeModelValue)
}
const loopUnselect = (key: any) => {
    const parent = hashObject.value[key.dicPid];
    if (parent) {
        hashObject.value[key.dicPid].selectStatus = parent.it.children.some((it: any) => hashObject.value[it.value].selectStatus !== 0) ? 2 : 0
        loopUnselect(parent.it)
    }
}
/**
 * 防抖（解决多次触发 onChangeModelValue 事件的问题）
 * @param block 函数
 * @param delay 延迟时间
 */
const antiShake = (block: Function, delay: number = 100) => {
    window["__timer__"] && clearTimeout(window["__timer__"])
    window["__timer__"] = setTimeout(() => {
        block()
        window["__timer__"] && clearTimeout(window["__timer__"])
    }, delay)
}
/**
 * 获取选中的值
 */
const onChangeModelValue = (result: Array<Array<string>> = []) => {
    if (!result || !result.length) for (let key in hashObject.value) {
        const it = hashObject.value[key]
        if (it.selectStatus === 1 && it.isLast) {
            result.push(it.values)
        }
    }
    // console.log('Cascader-Panel-Change', result)
    emits('update:modelValue', result)
    emits('on-change', result)
}
</script>

<style lang="scss" scoped>
.cascader-panel {
    display: flex;
    border: 1px solid #808080;
    border-radius: 5px;
    &-box {
        overflow-y: auto;
        width: 300px;
        height: 100%;
        .item-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            cursor: pointer;
            user-select: none;
            .item-left {
                display: flex;
                align-items: center;
            }
            &:hover {
                background-color: #e6e6e6;
            }
        }
        &:not(:last-child) {
            border-right: 1px solid #808080;
        }
    }
    > ::v-deep(.cascader-panel) {
        border: 0;
    }
}
</style>

<template>
    <div class="cascader-panel">
        <div class="cascader-panel-box">
            <div v-for="(key, index) in options" :key="index" class="item-box" @click="activeIndex = index">
                <div class="item-left">
                    <!-- TODO 需要修改为多选框，并实现未选中、已选中、半选中样式 -->
                    <p v-if="hashObject[key.value]?.selectStatus === 0" class="unselect" @click="onSelect(key)">0</p>
                    <p v-else-if="hashObject[key.value]?.selectStatus === 1" class="selected" @click="onUnselect(key)">1</p>
                    <p v-else class="half-select" @click="onSelect(key)">2</p>
                    <p>{{ key.label }}</p>
                </div>
                <p v-if="key[childrenField] && key[childrenField].length > 0" class="item-right">&gt;</p>
            </div>
        </div>
        <cascader-panel
            v-if="activeIndex != null && options[activeIndex] && options[activeIndex][childrenField]"
            ref="children"
            :limit="limit"
            :level="level + 1"
            :modelValue="modelValue"
            :labelValue="labelValue"
            :valueField="valueField"
            :labelField="labelField"
            :parentField="parentField"
            :greaterLimit="greaterLimit"
            :childrenField="childrenField"
            :options="options[activeIndex][childrenField]"
            @update:modelValue="onChangeModelValue"
        ></cascader-panel>
    </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref} from "vue"

const props = defineProps({
    // 树形结构数据
    options: {
        type: Array<any>,
        required: true
    },
    // 选中的值
    modelValue: {
        type: Array<Array<string>>,
        default: () => []
    },
    // 选中的标签
    labelValue: {
        type: Array<string>,
        default: () => []
    },
    // 最大可选数（按最后层级算）
    limit: {
        type: Number,
        default: Infinity,
        validator: (val: number) => val > 0
    },
    // 超过最大可选数后的行为（return：不做任何操作直接返回，overwrite：覆盖先选择的数据）
    greaterLimit: {
        type: String,
        default: 'overwrite',
        validator: (val: string) => ['return', 'overwrite'].includes(val)
    },
    // 树形结构中的值的字段名
    valueField: {
        type: String,
        default: 'value'
    },
    // 树形结构中的父级id字段名
    parentField: {
        type: String,
        default: 'dicPid'
    },
    // 树形结构中的标签字段名
    labelField: {
        type: String,
        default: 'label'
    },
    // 树形结构中的子级字段名
    childrenField: {
        type: String,
        default: 'children'
    },
    // 层级（请勿手动传该值）
    level: {
        type: Number,
        default: 1
    }
})

const emits = defineEmits(['update:modelValue', 'update:labelValue', 'on-change'])

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
        for (let i of parent.it[props.childrenField]) {
            if (hashObject.value[i[props.valueField]].selectStatus !== 1) {
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
            const parent = hashObject.value[it[props.parentField]]
            const self = !!hashModelValue[it[props.valueField]]
            if (parent) {
                values = [...parent.values, it[props.valueField]]
            } else if (it[props.parentField]) {
                values = [it[props.parentField], it[props.valueField]]
            } else {
                values = [it[props.valueField]]
            }
            const selectObj = {
                selectStatus: self ? 1 : 0,
                isLast: false,
                values,
                it
            }
            hashObject.value[it[props.valueField]] = selectObj
            if (it[props.childrenField] && it[props.childrenField].length > 0) {
                initHashObject(it[props.childrenField])
            } else {
                selectObj.isLast = true
            }
        }
    }
    initHashObject(props.options)
    // 初始化父级状态
    const initSelectStatus = (options: Array<any>) => {
        for (let it of options) {
            const parent = hashObject.value[it[props.parentField]]
            const self = !!hashModelValue[it[props.valueField]]
            if (self && parent) {
                parentSelect(it[props.parentField])
            }
            if (it[props.childrenField] && it[props.childrenField].length > 0) {
                initSelectStatus(it[props.childrenField])
            }
        }
    }
    initSelectStatus(props.options)
})

/**
 * 选中事件
 * @param key   键
 */
const onSelect = (key: any) => {
    // 选中数大于等于最大可选数时的操作处理
    if(props.modelValue.length >= props.limit) {
        if (key[props.childrenField] && key[props.childrenField].length > 0) return
        switch (props.greaterLimit) {
            case 'return':
                return
            case 'overwrite':
                let index = 0
                let length = props.modelValue.length
                do {
                    const first = props.modelValue[index];
                    onUnselect(hashObject.value[first[first.length - 1]].it)
                    index++
                    length--
                } while (length >= props.limit)
                break
        }
    }
    hashObject.value[key[props.valueField]].selectStatus = 1
    if (key[props.childrenField] && key[props.childrenField].length > 0) {
        for (let it of key[props.childrenField]) {
            onSelect(it)
        }
    }
    loopSelect(key)
    antiShake(onChangeModelValue)
}
/**
 * 递归选中父级
 * @param key 键
 */
const loopSelect = (key: any) => {
    const parent = hashObject.value[key[props.parentField]];
    if (parent) {
        parent.selectStatus = parent.it[props.childrenField].every((it: any) => hashObject.value[it[props.valueField]].selectStatus === 1) ? 1 : 2
        loopSelect(parent.it)
    }
}
/**
 * 取消选中事件
 * @param key 键
 */
const onUnselect = (key: any) => {
    hashObject.value[key[props.valueField]].selectStatus = 0
    if (key[props.childrenField] && key[props.childrenField].length > 0) {
        for (let it of key[props.childrenField]) {
            onUnselect(it)
        }
    }
    loopUnselect(key)
    antiShake(onChangeModelValue)
}
/**
 * 递归取消选中父级
 * @param key 键
 */
const loopUnselect = (key: any) => {
    const parent = hashObject.value[key[props.parentField]];
    if (parent) {
        hashObject.value[key[props.parentField]].selectStatus = parent.it[props.childrenField].some((it: any) => hashObject.value[it[props.valueField]].selectStatus !== 0) ? 2 : 0
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
 * @param modelValue 选中的值
 * @param labelValue 选中的标签
 */
const onChangeModelValue = (modelValue: Array<Array<string>> = [], labelValue: Array<string> = []) => {
    if (!modelValue || !modelValue.length) {
        for (let key in hashObject.value) {
            const item = hashObject.value[key]
            if (item.selectStatus === 1 && item.isLast) {
                modelValue.push(item.values)
                labelValue.push(item.it[props.labelField])
            }
        }
    }
    // console.log('Cascader-Panel-Change', result)
    emits('update:modelValue', modelValue, labelValue)
    emits('update:labelValue', labelValue)
    emits('on-change', modelValue)
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

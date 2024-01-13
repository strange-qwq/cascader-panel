<template>
    <div v-if="options && hashObject" class="cascader-panel">
        <div class="cascader-panel-box">
            <div v-for="(key, index) in options" :key="index" class="item-box" @click="activeIndex = index">
                <div class="item-left">
                    <!--suppress HtmlUnknownAttribute -->
                    <input
                        v-if="limit === Infinity || hashObject[key.value].isLast"
                        type="checkbox"
                        :checked="hashObject[key.value].selectStatus === 1"
                        :indeterminate="hashObject[key.value].selectStatus === 2"
                        @click="hashObject[key.value].selectStatus === 1 ? onUnselect(key) : onSelect(key)"
                    />
                    <p>{{ key[labelField] }}</p>
                </div>
                <p v-if="key[childrenField] && key[childrenField].length > 0" class="item-right">&gt;</p>
            </div>
        </div>
        <cascader-panel
            v-if="activeIndex != null && options[activeIndex] && options[activeIndex][childrenField]"
            ref="children"
            :limit="limit"
            :level="level + 1"
            v-model:modelValue="__modelValue"
            v-model:labelValue="__labelValue"
            :valueField="valueField"
            :labelField="labelField"
            :parentField="parentField"
            :greaterLimit="greaterLimit"
            :childrenField="childrenField"
            :options="options[activeIndex][childrenField]"
        ></cascader-panel>
    </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref, watch} from "vue"

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

const emits = defineEmits(['update:modelValue', 'update:labelValue', 'change'])

const activeIndex = ref<number|null>(null)
const __modelValue = ref<Array<Array<string>>>([])
const __labelValue = ref<Array<string>>([])
if (!window["__checkedHashObject__"]) {
    window["__checkedHashObject__"] = ref<any>({})
}
const hashObject = window["__checkedHashObject__"]

watch(() => __modelValue.value, (val) => {
    emits('update:modelValue', val)
    emits('change', val)
}, { deep: true })

watch(() => __labelValue.value, (val) => {
    emits('update:labelValue', val)
}, { deep: true })

onBeforeMount(() => {
    __modelValue.value = props.modelValue
    // 仅第一层初始化
    if (props.level !== 1) return
    // 获取所有已选中的最后一层
    const hashModelValue: any = {}
    for (let it of props.modelValue) {
        hashModelValue[it[it.length - 1]] = true
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
            const hasChildren: boolean = it[props.childrenField] && it[props.childrenField].length > 0;
            hashObject.value[it[props.valueField]] = {
                selectStatus: self ? 1 : 0,
                isLast: !hasChildren,
                values,
                it
            }
            if (hasChildren) {
                initHashObject(it[props.childrenField])
            }
            if(self) {
                __labelValue.value.push(it[props.labelField])
            }
        }
    }
    initHashObject(props.options)
    for (let key in hashModelValue) {
        loopSelect(hashObject.value[key].it)
    }
})

/**
 * 选中事件
 * @param key    键
 * @param length 选中的总个数（默认值为__modelValue的长度）
 */
const onSelect = (key: any, length: number = __modelValue.value.length) => {
    // 选中数大于等于最大可选数时的操作处理
    if(__modelValue.value.length >= props.limit) {
        if (key[props.childrenField] && key[props.childrenField].length > 0) return
        switch (props.greaterLimit) {
            case 'return':
                return
            case 'overwrite':
                do {
                    const first = __modelValue.value[0]
                    onUnselect(hashObject.value[first[first.length - 1]].it)
                    __modelValue.value.shift()
                } while (__modelValue.value.length >= props.limit)
                break
        }
    }
    hashObject.value[key[props.valueField]].selectStatus = 1
    if (key[props.childrenField] && key[props.childrenField].length > 0) {
        for (let it of key[props.childrenField]) {
            onSelect(it, length)
            if(++length >= props.limit) break
        }
    }
    loopSelect(key)
    antiShake(buildModelValue)
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
    antiShake(buildModelValue)
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
 * 防抖（解决多次触发onChangeModelValue事件的问题）
 * @param block 函数
 * @param delay 延迟时间（默认值为100毫秒）
 */
const antiShake = (block: Function, delay: number = 100) => {
    window["__timer__"] && clearTimeout(window["__timer__"])
    window["__timer__"] = setTimeout(() => {
        block()
        window["__timer__"] && clearTimeout(window["__timer__"])
    }, delay)
}
/**
 * 修改事件
 */
const buildModelValue = () => {
    __modelValue.value = []
    __labelValue.value = []
    for (let key in hashObject.value) {
        const item = hashObject.value[key]
        if (item.selectStatus === 1 && item.isLast) {
            __modelValue.value.push(item.values)
            __labelValue.value.push(item.it[props.labelField])
        }
    }
}
/**
 * 刷新事件（需手动触发，触发后会根据 props.modelValue 重新选择）
 */
const onRefresh = () => {
    for (let key in hashObject.value) {
        hashObject.value[key].selectStatus = 0
    }
    for (let it of props.modelValue) {
        onSelect(hashObject.value[it[it.length - 1]].it)
    }
}

defineExpose({
    onRefresh
})
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

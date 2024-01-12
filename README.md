# 级联选择器面板

## 项目介绍

项目为原生级联选择器面板实现，未使用任何ui框架，轻量易修改

主要实现于逻辑方面，样式未做设计，可自行更改

## 使用说明

将`src/components/CascaderPanel.vue`文件复制到项目中，引入即可

测试页面位于`src/App.vue`文件中，可参考使用

输入数据结构：见项目`src/data/cascaderValue.js`文件

输出数据结构：选中的层级的最后一层的路径组合成的二维数组

组件参数：

|     属性名称      |         属性类型         | 是否必传 |    默认值    |                        说明                         |
|:-------------:|:--------------------:|:----:|:---------:|:-------------------------------------------------:|
|    options    |      Array<any>      |  √   |   true    |                      树形结构数据                       |
|  modelValue   | Array<Array<string>> |  ×   |    []     |                       选中的值                        |
|  labelValue   |    Array<string>     |  ×   |    []     |                       选中的标签                       |
|     limit     |        Number        |  ×   | Infinity  |                   最大可选数（按最后层级算）                   |
| greaterLimit  |        String        |  ×   | overwrite | 超过最大可选数后的行为（return：不做任何操作直接返回，overwrite：覆盖先选择的数据） |
|  valueField   |        String        |  ×   |   value   |                    树形结构中的值的字段名                    |
|  parentField  |        String        |  ×   |  dicPid   |                   树形结构中的父级id字段名                   |
|  labelField   |        String        |  ×   |   label   |                    树形结构中的标签字段名                    |
| childrenField |        String        |  ×   | children  |                    树形结构中的子级字段名                    |
|     level     |        Number        |  ×   |     1     |                    层级（请勿手动传该值）                    |

组件事件：

|   事件名称    |    事件参数    |  说明  |
|:---------:|:----------:|:----:|
| on-change | modelValue | 修改事件 |

## 需要注意

组件样式使用scss编写，需要注意引入scss插件，你也可以修改为css版本

需要修改`cascader-panel`组件的第7、8、9行为多选框，并实现未选中（class=unselect）、已选中（class=selected）、半选中（class=half-select）样式

！！！请勿手动传入level属性，该属性为组件内部使用，传入后可能会导致组件无法正常工作！！！

## 数据示例：

> 输入：
>  ```
> [
>     {
>         "value":"273000025",
>         "dicPid":"",
>         "sortOrder":1,
>         "label":"欧洲",
>         "dicEnName":"Europe",
>         "children":[
>             {
>                 "value":"273000030",
>                 "dicPid":"273000025",
>                 "sortOrder":0,
>                 "label":"北欧",
>                 "dicEnName":" bo"
>             }
>         ]
>     },
>     {
>         "value":"000272",
>         "dicPid":"",
>         "sortOrder":0,
>         "label":"中国",
>         "dicEnName":"China",
>         "children":[
>             {
>                 "value":"272023000",
>                 "dicPid":"000272",
>                 "sortOrder":1000,
>                 "label":"四川省",
>                 "dicEnName":"",
>                 "children":[
>                     {
>                         "value":"272023001",
>                         "dicPid":"272023000",
>                         "sortOrder":0,
>                         "label":"成都市",
>                         "dicEnName":"",
>                         "children":[
>                             {
>                                 "value":"273002435",
>                                 "dicPid":"272023001",
>                                 "sortOrder":0,
>                                 "label":"武侯祠",
>                                 "dicEnName":"武侯祠"
>                             },
>                             {
>                                 "value":"273002438",
>                                 "dicPid":"272023001",
>                                 "sortOrder":0,
>                                 "label":"宽窄巷子",
>                                 "dicEnName":"宽窄巷子"
>                             },
>                             {
>                                 "value":"273002439",
>                                 "dicPid":"272023001",
>                                 "sortOrder":0,
>                                 "label":"太古里",
>                                 "dicEnName":"太古里"
>                             },
>                             {
>                                 "value":"273002441",
>                                 "dicPid":"272023001",
>                                 "sortOrder":0,
>                                 "label":"春熙路",
>                                 "dicEnName":"春熙路"
>                             }
>                         ]
>                     }
>                 ]
>             }
>         ]
>     }
> ]
>  ```
> 选中：
> - 欧洲
> - 中国 - 四川省 - 成都市 - 武侯祠
> - 中国 - 四川省 - 成都市 - 太古里
>
> 输出：
> ```
> [['273000025', '273000025'], ['000272', '272023000', '272023001', '273002435'], ['000272', '272023000', '272023001', '273002439']]
> ```

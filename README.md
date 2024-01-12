# 级联选择器面板

## 项目介绍

项目为原生级联选择器面板实现，未使用任何ui框架，轻量易修改

主要实现于逻辑方面，样式未做设计，可自行更改

## 使用说明

输入数据结构：见项目`data/cascaderValue.js`文件

输出数据结构：选中的层级的最后一层的路径组合成的二维数组

## 需要注意

需要修改`cascader-panel`组件的第7、8、9行为多选框，并实现未选中（class=unselect）、已选中（class=selected）、半选中（class=half-select）样式

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

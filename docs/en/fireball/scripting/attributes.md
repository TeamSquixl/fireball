---
title: Property Attributes
categories: manual
permalinks: manual/scripting/attributes
---

## Attributes for Inspector Property

When we declare property exposed to Inspector, we can specify attributes to customize it as we wish.

Following attributes are also available to `get` method.

Attribute Name | Description | Type | Default Value
--- | --- |:---:|:---:
[type](/manual/scripting/class#type) | define data/value type of property（see [example](/manual/scripting/class#type)） | (Any) | undefined
[visible](/manual/scripting/class#visible) | Whether to show or hide property in Inspector | boolean | (注1)
url | 该属性为指定资源的 url（[点击范例](/manual/scripting/class#url)） | function(构造函数) | undefined
displayName | 在 Inspector 面板中显示为另一个名字 | string | undefined
tooltip | 在 Inspector 面板中添加属性的 Tooltip | string | undefined
multiline | 在 Inspector 面板中使用多行文本框 | boolean | false
readonly | 在 Inspector 面板中只读 | boolean | false
nullable | 在该属性的控件前附加一个单选框 | { propName: string, default: boolean } | undefined
watch | 监听其它属性的状态，来刷新本控件 | { "prop names": function (this, uiCtrl) {} } | undefined
range | 以滑动条的形式限定数值的最大最小值 | [min, max] | undefined

注：
 1. visible 的默认值取决于属性名。当属性名以下划线"_"开头时，默认隐藏，否则默认显示。

## 序列化相关属性

这些属性不能用于 get 方法

参数名 | 说明 | 类型 | 默认值
--- | --- |:---:|:---:
[serializable](/manual/scripting/class#serializable) | 序列化该属性 | boolean | true
editorOnly | 在导出项目前剔除该属性 | boolean | false
rawType | 该属性的类型是宿主平台上的原生对象 | string | undefined

## 其它属性

参数名 | 说明 | 类型 | 备注
--- | --- |:---:|:---:
notify | 当属性修改时触发指定方法 | function (oldValue) {} | 需要已定义 default

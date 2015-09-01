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
[type](/manual/scripting/class#type) | define data/value type of property (see [example](/manual/scripting/class#type)) | (Any) | undefined
[visible](/manual/scripting/class#visible) | Whether to show or hide property in Inspector | boolean | (Note1)
url | if property is for referencing asset url, use this attribute (see [example](/manual/scripting/class#url)) | function(constructor) | undefined
displayName | Inspector will show displayName instead of property name | string | undefined
tooltip | Add tooltip when mouse over this property in Inspector | string | undefined
multiline | Enable multiline input field for text property | boolean | false
readonly | Mark this property readonly in Inspector | boolean | false
watch | watch other property updates and run a callback function | { "prop names": function (this, uiCtrl) {} } | undefined
range | constrain property range and edit property value with a slider | [min, max] | undefined

Note:
 1. whether a property is visible by default is determined by its name. Property starts with a `_` is hidden by default.

## Serialization

These attributes are related to serialization, and cannot be used with `get` method.

Attribute Name | Description | Type | Default Value
--- | --- |:---:|:---:
[serializable](/manual/scripting/class#serializable) | This property will be serialized | boolean | true
editorOnly | This property will be removed after building | boolean | false
rawType | This property is native object type for host platform | string | undefined

## Other Attributes

Attribute Name | Description | Type | Note
--- | --- |:---:|:---:
[default](/manual/scripting/class#default) | default value of the property | (Any) | For serializable property, changing the default value will not affecting property value after it's modified in Inspector
notify | trigger the function when property value is changed | function (oldValue) {} | need to have default value

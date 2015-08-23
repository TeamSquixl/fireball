---
title: Inspector Panel
category: manual
permalinks: manual/editor-interface/inspector
---

![inspector](https://cloud.githubusercontent.com/assets/344547/9423058/c973e162-48e5-11e5-8858-5d9661dee749.png)

The **Inspector Panel** allows you to inspect and edit properties of selected node in scene. There are two sources of properties in inspector:

- properties from the base node (such as `position`, `rotation`, `color` from Node class, and `texture` from Sprite class).
- properties from behaviors attached to the node (such as `gravity` from Sheep class, which is a user script attached to the node)

All modifications made in **Inspector** will be applied onto selected item without recompiling. You can tested this by modifying position property of any selected node and see its position changing immediately in **Scene** view.

If you'd like to learn how to create Behavior script, please read [Behavior](/manual/scripting/attachable-script) scripting guide.

## Modify Property

Number, string, color and enum are value type properties. You can modify these properties with easy operations:

- **Number**: type a number in the property field, or click on the up or down arrow at the right of the field to increase or decrease the value step by step.
- **String**:  type text in the input field. Or paste any text into the field.
- **Enum**:  to set enum value, click to open the drop down list and choose a value from the list.
- **Color**: click on the color indicator to open color panel, and choose the color you want.

Then there are reference type properties, such as node and asset. To set or modify these properties, simply drag a node or an asset onto the property field. These properties are identified with a colored label, yellow label requires an asset while green label requires a node.

## Change Node Name

At the top of the **Inspector** panel there's a input field showing the node name. You can change the node name by typing in this field. So you can rename a node in either **Inspector** or **Hierarchy**.

## Behavior In Inspector

To add behavior to a node, drag a script from **Asset** panel to **Inspector** will attach the script to the current selected node. You'll see the Behavior at the bottom of **Inspector**.

![behavior](https://cloud.githubusercontent.com/assets/344547/9423595/0b8cedca-48fd-11e5-9100-2559f6065098.png)

You can click the title of Behavior (with a down arrow at the left) to fold the behavior properties. This is convenient if you have a lot of properties to show in your **Inspector** panel.

To remove (detach) a behavior from a node, click the **x** button at the right of behavior title.

---

Continue to read [Console](/manual/editor-interface/console).

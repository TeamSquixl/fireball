---
title: What's Fireball
category: manual
permalinks: manual/introduction
---

So is Fireball a game engine? No.
Is Fireball a full integrated game development solution? Yes.
I'm using a game engine to develop my game, can I add Fireball to my arsenal to extend my tool chain and have fully integrated assets pipeline and scene editing ability? YES!!!

## Cross-Engine Editor

Fireball is the first cross-engine integrated game development editor in the industry. It's structure can be described like this:

![fireball-structure](https://cloud.githubusercontent.com/assets/344547/8515113/e3bceec4-23ce-11e5-97f6-ecbe87df5d90.png)

With three layers of framework work together, it give users a full-featured game editor that can:

- Create and edit scenes to organize your game content.
- Allow user to drag script to nodes (or game objects, display objects, entities, whatever it's called in your beloved engine) to add function and behaviors in scene.
- Serialize script variables and allow user edit those data in Inspector.
- Run and preview game within editor, pause anytime to debug, hot update your scripts, change any variable exposed to editor.
- Provide asset database system that manage url(file path) and uuid binding for all resources. Thus user can move/rename/duplicate assets after import to the project without breaking any reference.
- Provide full asset workflow including: sprite, atlas, timeline animation, skeleton animation, audio, GUI, particle, prefab.
- Extend the editor quickly and easily with the open package system. Developer with different game engine background can even collaborate on a tool together and build tools that can be used with different engines.

If you're non-programmer and have no idea what I'm talking about. Don't worry you don't need to understand how Fireball works before you can use it. Just skip this documentation and get on with it anyway.

## Scene-Graph to Hierarchy View

Fireball supports any [scene-graph](https://en.wikipedia.org/wiki/Scene_graph) based engine. Usually in those engines a series of function calls are used for building hierarchy structure or tree structure for all nodes in a scene. Fireball turns those function calls into an editable graphical panel: Hierarchy.

In this panel you can create/remove a node, expand/collapse a node, add child to a node or move a node to be child of another.

Hierarchy is the key junction that connects other core modules. For example the Inspector only works when you have selected a node. For details on how Hierarchy works, [read this section](/manual/editor-overview#hierarchy).

**Note:** If you're unclear of the concept 'Node', you can read this [comprehensive article from Cocos2d-x programming guide](http://www.cocos2d-x.org/programmersguide/2/index.html#scene-graph).

## Node Type and Behavior

Engines supported by Fireball are usually consists of a lot individual classes. You can create instance of these classes in [Hierarchy](/manual/editor-interface/hierarchy) panel. For example a Sprite node is an instance of `cc.Sprite` (cocos2d-js) class, a LabelBMFont node is an instance of `cc.LabelBMFont` class. Different type of nodes are capable of rendering sprite, text, UI elements, tilemap and animation.

In Fireball, user can add properties and functions to any type of node easily by creating a **Behavior** script and attach it to the node.

### Inspector

[Inspector](/manual/editor-interface/inspector) is a panel to display detailed information about your currently selected node. We call these editable information **properties**. There are properties of node class and properties defined in behavior scripts.

![inspector](https://cloud.githubusercontent.com/assets/344547/9423058/c973e162-48e5-11e5-8858-5d9661dee749.png)

Programmers can write behavior script with properties that can be edited in **Inspector**, effectively delegate data inputing and tweaking work to non-programmers such as artists and designers.

For details on how Inspector works, [read this section](/manual/editor-interface/inspector) in Editor Overview.

### Attach Behavior to Node

To add behaviors to a node, all you have to do is drag your script to the **Inspector** with the node selected. The behavior will be added to Inspector. You can drag more script onto a single node. Inspector will show each behavior separately with their properties.

To learn the details on how behavior works, please read [Behavior](/manual/scripting/attachable-script) guide.

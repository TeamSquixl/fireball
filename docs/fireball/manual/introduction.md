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

![fireball-structure](https://cloud.githubusercontent.com/assets/344547/8510729/216ac6c4-232a-11e5-85b1-1d17d66210b1.png)

With three layers of framework work together, it give users a full-featured game editor that can:

- Create and edit scenes to organize your game content.
- Allow user to drag script to entities(node) to add function and behaviors in scene.
- Serialize script variables and allow user edit those data in Inspector.
- Run and preview game within editor, pause anytime to debug, hot update your scripts, change any variable exposed to editor.
- Provide asset database system that manage url(file path) and uuid binding for all resources. Thus user can move/rename/duplicate assets after import to the project without breaking any reference.
- Provide full asset workflow including: sprite, atlas, timeline animation, skeleton animation, audio, GUI, particle, prefab.
- Extend the editor quickly and easily with the open package system. Developer with different game engine background can even collaborate on a tool together and build tools that can be used with different engines.

If you're non-programmer and have no idea what I'm talking about. Don't worry you don't need to understand how Fireball works before you can use it. Just skip this documentation and get on with it anyway.

## Scene-Graph to Hierarchy View

Fireball supports any [scene-graph](https://en.wikipedia.org/wiki/Scene_graph) based engine. Usually in those engines a series of function calls are used for building hierarchy structure or tree structure for all nodes in a scene. Fireball turns those function calls into an editable graphical panel: Hierarchy View.

In this panel you can create/remove a node, expand/collapse a node, add child to a node or move a node to be child of another.

Hierarchy View is the key junction that connects other core modules. For example the Inspector only works when you have selected a node.

## Inspector

A panel to display detailed information about your currently selected node, including all attached scripts and their properties. It also display properties for basic node, such as position/rotation/scale.

## Attach Scripts to Node using Mixin

The most valuable feature of Fireball, is the ability to add component-like data binding and behaviors to nodes by attaching script.

JavaScript's [mixin](https://en.wikipedia.org/wiki/Mixin) feature makes this possible. All you have to do is drag your script to the Inspector of a certain node. The script will be added to Inspector View. You can drag more script onto a single node. Inspector will show each script separately with their properties.
But behind the scene all scripts attached are "mixed" together to create a mixin.

There are detailed guide and rules for this core system, we will introduce them in later articles.

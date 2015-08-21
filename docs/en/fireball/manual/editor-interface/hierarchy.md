---
title: Hierarchy Panel
category: manual
permalinks: manual/editor-interface/hierarchy
---

![hierarchy panel](https://cloud.githubusercontent.com/assets/344547/9374769/9ba11b76-472b-11e5-9c1f-2c3f540da3fa.png)

**Hierarchy** panel is a tree view contains all nodes in the current open scene. Each entry in this tree view represents an individual **node**. And nodes are usually organized hierarchically (parent-child relationship in other words). This panel's main purpose is to manage the hierarchical structure of current scene, also giving you quick access to each node so you can edit them.

## Create Node

There are two ways to add node to Hierarchy tree view:

- click "+" button at top left corner, and select your node type from the context menu.
- drag an associated asset from **Assets** view to **Hierarchy** view. For example texture asset (`.png`, `.jpg`, etc ) are associated to Sprite, dragging a texture asset to **Hierarchy** will create a Sprite node with that texture.

The list of node from create node context menu will vary according to the current engine your project use.

## Parenting

You can make a node the child of another node, by dragging the desired child node onto the node you want it to be parent. A parent node can be child of yet another node. You can create nested node structure as you like, and change their hierarchical relationship anytime.

Once you have some nested node, you'll see a right arrow on the left of a parent node. Click on the node will expand its children list. Click on an expanded node will fold it, just like in **Assets** tree view.

## Reorder Node

Besides drag a node onto another node, you can also drag the node to move up and down over its siblings.

![reorder node](https://cloud.githubusercontent.com/assets/344547/9401105/ca2718c0-47fc-11e5-97e2-3e2ea1087907.png)

The orange frame shows current dragging node's parent scope, the green line indicates where the node should end up with.

Currently node order are used for rendering order. The node at top of the list will be rendered first, the node at bottom of the list will be rendered last. In the game view you will always see node at bottom of the list over other node.

## Manage Node

Right click on a node to bring up its context menu, you can do these jobs:

- Create a new node as child of current selected node.
- Duplicate node, make the new node a sibling of current selected node. Can also be done with <kbd>Cmd/Ctrl + D</kbd>
- Rename node, can also be done with pressing <kbd>Enter</kbd> on mac or <kbd>F2</kbd> on windows.

---

Continue to read [Scene](/manual/editor-interface/scene).

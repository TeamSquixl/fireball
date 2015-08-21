---
title: Scene Panel
category: manual
permalinks: manual/editor-interface/scene
---

![scene-panel](https://cloud.githubusercontent.com/assets/344547/9374374/c5ee4920-4727-11e5-803d-78de5f3d4fa1.png)
The **Scene Panel** is a WYSIWYG visual editor where we assembles the graphic and interactive node in scene, such as setting up background, floor, obstacles, GUI, menus and other visual elements.

## Navigation

Currently there are two operation for scene panel navigation:

- <kbd>Shift + Mouse Drag</kbd>: pan the scene view.
- <kbd>Mouse Scroll</kbd>: zoom in and out.

## Selection

Left click on a visual element (for example a sprite) to select it, you'll see the blue frame around the sprite indicating it's the current selection.

If you drag a selection box around multiple sprites, you'll select them all at once.

![drag selection](https://cloud.githubusercontent.com/assets/344547/9401288/b0aa5288-47ff-11e5-84f3-421b3486777f.png)

Your selection in **Scene** and **Hierarchy** will reflect each other. Sometimes it's hard to select what you want in a visually crowded scene, you can always find the node in **Hierarchy** tree view, then manipulate it in **Scene**. Thus, please always name your node with something meaningful.

## Transform Manipulation

One of the key purpose of using **Scene** panel is to layout graphical elements. We do this by using **Transform Gizmos**, which is on the top left corner of **Scene** panel.

![move](https://cloud.githubusercontent.com/assets/344547/9401661/763a3c5c-4805-11e5-83c6-8b9db276765f.png)

**Translate**: this is the default transform gizmo when you launch Fireball Editor. It has two arrow handle and and a blue center handle. Drag green arrow moves your element along y axis, drag red arrow moves it along x axis. Drag on the center handle moves the element freely.

You can activate this gizmo by pressing <kbd>W</kbd> when **Scene** panel is focused.

![rotate](https://cloud.githubusercontent.com/assets/344547/9401725/63ad22a6-4806-11e5-90a9-315d1fa69a55.png)

**Rotate**: click on the middle one of gizmo selection buttons will switch over to Rotate gizmo, which looks like a red circle with an arrow. Drag on the arrow or anywhere inside the circle to change the rotation of the node.

You can activate this gizmo by pressing <kbd>E</kbd> when **Scene** panel is focused.

![scale](https://cloud.githubusercontent.com/assets/344547/9401739/9349109c-4806-11e5-9826-1393b530a4be.png)

**Scale**: drag on the green box to change the scale of the node's y axis, or drag on the red box to change the node's x axis. Or you can drag on the center handle to scale both axis.

You can activate this gizmo by pressing <kbd>R</kbd> when **Scene** panel is focused.

## Design Resolution

![design resolution](https://cloud.githubusercontent.com/assets/344547/9403726/2367c6d6-481c-11e5-869b-f867670ef5cb.png)

You can set design resolution (width and height) by the widget on top of **Scene** panel.

Design Resolution decides how much of scene content (in pixels) will be shown in the final game view. Game developer use this set of values together with screen content policy to make sure the game can be scaled up and down on different devices.

Your design resolution setting will be shown as a purple frame in the scene, only the content inside the purple frame will make into the game!

---

Continue to read [Inspector](/manual/editor-interface/inspector).

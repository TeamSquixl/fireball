---
title: Assets Panel
category: manual
permalinks: manual/editor-interface/inspector
---

# Inspector Panel
The **Inspector Panel** allows you to inspect and edit properties of selected items.
The **Inspector Panel** will show editable properties and their values as soon as you select an **Asset** as well as an **Entity**. All modifications made in inspector will be applied onto selected item without recompiling.

## **Entity** Property Editing

![inspector-entity](/manual/start/editor-overview/inspector-entity.png)
* Enable/Disable checkbox
  You can enable or disable the selected **Entity** by ticking or unticking the checkbox. Disabled **Entities** will not be shown in the scene.
* Name textbox
  Change the name of the selected **Entity** for better identification. Different **Entities** can have a same name, however, we suggest you to name your **Entities** following certain rules, in order to reduce the difficulty of development and maintenance. You can rename **Entities** in the **Hierarchy Panel** as well.
* New **Component** Button
  You can add **Components** for **Entities** to make them acquire certain functions and behaviours.
  Click the ![add-button](/manual/start/editor-overview/add-button.png) button in the upper-right corner will pop up the **Component** adding menu, whose features include:
  - **Scripts**: Bind a Fire-shell script to the **Entity** for behaviour controlling. Fireball will search all scripts in the asset library, and list them in the sub-menu for quick selection.
  - **SpriteRenderer**: Add a sprite renderer component to make the **Entity** render specified sprite **Asset** in the scene.
  - **BitmapText**: Draw texts with bitmap font in the scene.
  - **Text**: Draw texts with system fonts in the scene.
  - **Camera**: Add a camera to control the game view.
  - **AudioSource**: Add a audio source for playing music or sound effects.
  - **Sprite Animation**: Add a sprite animation controller. *施工中*
* **Component** List
  This is the main working area of the **Inspector Panel**, including all **Components** of the selected **Entity** and all their editable properties. Typically, **Components** of an **Entity** will be listed in the sequence as added, but `Fire.Transform` will be the first one constantly, as it is the basic component. Click the arrow icon on the left of **Component** name will expand or collapse its details, which can save you some space. Click the X button will delete the **Component** from the **Entity**.
  For details of **Component** properties, please refer to **Component** documentation.

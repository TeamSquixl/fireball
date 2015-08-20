---
title: Editor Overview
category: manual
permalinks: manual/editor-overview
---

> This chapter will introduce you all the features of Fireball Editor. It would be a good place for being familiar with Fireball Editor, and getting ready for your future Fireball works.
> Please make sure you have finished reading the following articles before going further:
> - [Introduction](/manual/introduction)
> - [Dashboard](/manual/dashboard)

## Overview

You'll have no chance to build an exciting game without understanding what all the editor tools can do for you first, so hold your horse for a while and meet the Fireball Editor along with thrilling features. And, whenever you are in doubt, don't forget this chapter is a good place to look up for as well.


Fireball Editor mainly consists of several panels. These panels cover project asset management, scene editing, data inspecting, building and other extended functions which completes the full workflow of creating a game. You can adjust each panel's size and position by your own taste. Beside of these panels, there are other UIs which are essential for building a game, including menus, tool bar and DevTools window, and you should know about them as well.


Check out the screenshot below - it gives a basic concept of the UI layout. We will discuss every piece of features in the sections below.

![editor-overview-intro](https://cloud.githubusercontent.com/assets/344547/9374257/9d4c2ba0-4726-11e5-99bd-afaac5e59940.png)

## Assets

![Assets](https://cloud.githubusercontent.com/assets/344547/9374759/8e996776-472b-11e5-93fa-c22247676283.png)

This is where you can access and manage assets of your game. You'd better start from here if you just created an empty project. In that case you'll see an empty list waiting for you to drag stuff into it.

### Basics

The list matches file content inside your project's `assets` folder. (to learn the file structure of a Fireball project, read [Project Structure](/manual/project-structure) ) If your project assets folder have several sub-folders, you will see them as folder icon ![folder](https://cloud.githubusercontent.com/assets/344547/9375313/c04287fc-4731-11e5-8cda-259bebe5584a.png) in **Assets** panel as well. If you see a right arrow icon on the left of a folder in the list, you can click on it to expand the nested list it contains. Click on an expanded folder to "fold" it so you have more space.

The files in Assets view are displayed with an icon and filename. Icon indicates the type of file identified by file extension, here's the details:


- ![asset](https://cloud.githubusercontent.com/assets/344547/9375307/c016678a-4731-11e5-93a0-b0673e894c6c.png) **Default asset**: if a file cannot be recognized as one of the registered type, this default asset icon will be used.
- ![atlas](https://cloud.githubusercontent.com/assets/344547/9375310/c018bdd2-4731-11e5-9b3c-1772695feb4f.png) **Atlas plist**: A common sprite atlas asset type with `.plist` extension, you can create this type of assets in tools such as [TexturePacker](https://www.codeandweb.com/texturepacker)
- ![audio-clip](https://cloud.githubusercontent.com/assets/344547/9375309/c0182fac-4731-11e5-80d9-e74b92f0e098.png) **Audio clip**: Any audio file with `.mp3`, `.wav`, `.ogg`
- ![bitmap-font](https://cloud.githubusercontent.com/assets/344547/9375308/c018043c-4731-11e5-823a-9c60222a6c35.png) **Bitmap font**: a font format commonly used in games to render characters as sprite. You can use these tools ([Glyph Designer](http://glyphdesigner.71squared.com/) [AngleCode Bmfont](http://www.angelcode.com/products/bmfont/) ) to create `.fnt` bitmap font files.
- ![javascript](https://cloud.githubusercontent.com/assets/344547/9375314/c044c364-4731-11e5-9990-b3356ffd1e45.png)![typescript](https://cloud.githubusercontent.com/assets/344547/9375320/c06efc4c-4731-11e5-85c0-c21419fffb62.png)![coffeescript](https://cloud.githubusercontent.com/assets/344547/9375311/c03314d4-4731-11e5-945b-e1c6a72a0be6.png)![css](https://cloud.githubusercontent.com/assets/344547/9375312/c03f1c20-4731-11e5-8e90-ca90d442e12c.png)![html](https://cloud.githubusercontent.com/assets/344547/9375315/c044f352-4731-11e5-8788-e0e569574fdf.png) **Script files**: including Javascript `.js`, TypeScript `.ts`, Coffeescript `.coffee`, CSS `.css`, HTML `.html`. These file format are all supported for scripting your game or editor extensions.
- ![scene](https://cloud.githubusercontent.com/assets/344547/9375317/c057cfea-4731-11e5-8d57-e43d9dfd03b6.png) **Scene**: Fireball's scene file. Can only be created in **Assets** view.
- ![text](https://cloud.githubusercontent.com/assets/344547/9375319/c06c4718-4731-11e5-99e2-a47912dc5c2d.png) **Text file**: a file with extension `.txt`.
- ![ttf-font](https://cloud.githubusercontent.com/assets/344547/9375321/c0733c8a-4731-11e5-9648-77d857c60c55.png) **TTF font**: TrueType font format.


### Add Assets to Project

There are three ways of add new assets to project:

- create asset in **Assets** view.
- drag asset files from your file system (such as Finder for Mac or Explorer for Windows) into **Assets** view.
- copy or move asset files to your project's `assets` folder in your file system, then focus Fireball Editor window to automatically scan and import new assets.

Add new files from file system is self explanatory, let's see how to creating asset in  **Assets** view:

- Click on the top-left ![image](https://cloud.githubusercontent.com/assets/344547/9375817/dbe3e608-4737-11e5-90d1-5a575600c398.png) plus button.
- or right click anywhere on **Assets** panel, and select `Create` sub menu.
- In either way, you will see the following options in `Create` context menu:
  - Folder
  - JavaScript
  - CoffeeScript
  - Scene
- click one of them and your asset will be created in currently selected folder.

There seems to be not many options at the moment, but as development goes, Fireball will be able to create more types of assets with builtin tools, and saves user money and trouble to find external tools.

### Manage Assets

You can rename/move/delete assets in this panel.

- to rename an asset, right click the asset and select `rename` from context menu.
- to move an asset, drag the asset around the tree view, until you're happy with where its new location is. The new folder to hold the asset will be highlighted in orange.
- to delete an asset, right click and select `delete` or select the asset and press <kbd>Cmd + Backspace</kbd> on mac or <kbd>Del</kbd> on windows.

Besides these operations, there are other options in right click context menu that gives you more details about the asset:

- `Reveal in Finder` (mac) `Reveal in Explorer` (win): select this and Fireball will open the folder that contains the asset in Finder/Explorer.
- `Reveal in Library`: open the library folder that contains the imported copy of the asset.
- `Show UUID`: print the UUID of the asset in console panel. This is mainly for debug purpose and normal user should not need it.

### Search Asset

By typing in the search field at top of **Assets** panel,  the asset tree view will only show assets whose filename contains your typed search keyword.

![search asset](https://cloud.githubusercontent.com/assets/344547/9376761/ffbc3312-4743-11e5-9b3e-d7f5abe64b95.png)

It's convenient to find the asset you want this way if your project is getting bigger. Once you find the asset you want, select it in the filtered list, and click the pin icon at the right of search field. It will go back to assets tree view and keep the asset you find highlighted.


## Hierarchy
![hierarchy panel](https://cloud.githubusercontent.com/assets/344547/9374769/9ba11b76-472b-11e5-9c1f-2c3f540da3fa.png)

**Hierarchy** panel is a tree view contains all nodes in the current open scene. Each entry in this tree view represents an individual **node**. And nodes are usually organized hierarchically (parent-child relationship in other words). This panel's main purpose is to manage the hierarchical structure of current scene, also giving you quick access to each node so you can edit them.

### Create Node



### Entity List

**Entities** in a scene will be present in terms of their relationship.  Those that owns children will show a little arrow ![collapse-arrow](/manual/start/editor-overview/collapse-arrow.png) in front of their names. Parent **Entities** will be expanded or collapsed by clicking the arrow.

Properties of selected **Entities** will be shown in the **Inspector Panel**, while the handlers of the **Entities** will appear in the **Scene Panel** in the meantime. You can select multiple **Entities** in the list by pressing <kbd>Shift</kbd> key or <kbd>Ctrl</kbd> key, continuously or not.

You can also change the relationship by dragging **Entities** in the list. Say, dragging **Entity** A onto **Entity** B will make A become B's child.

Click right mouse button in the list will pop up a context menu, whose features includes:
* **Duplicate**: Make a copy of selected **Entity** and add it to the end of the list. It is the easiest way to create multiple **Entities** with same or similar properties.
* **Rename**: Rename the selected **Entity**. You can do so in the **Inspector Panel** as well.
* **Delete**: Delete the selected **Entity**. You can do so by pressing <kbd>Delete</kbd> key as well.
* **Create Empty**: Create an empty **Entity** in the scene.
An empty **Entity** solely contains its **Transform information**, i.e. its position, rotation and scale. The default property values are:
  - ***Position*** x=0, y=0
  - ***Rotation*** 0
  - ***Scale*** x=1, y=1
* **Create Empty Child**
Create a **Child Entity** that belongs to the selected **Entity**.
For the situation of no **Entity** is selected, this function will create an empty **Entity** as a root one, which behaves exactly the same as **Create Empty** function.

## Add **Entity**
Click the ![add-button](/manual/start/editor-overview/add-button.png) in the upper-left corner in the panel will show you the **Entity** creation menu, whose features includes:
* **Create Empty**: Create an empty **Entity** in the scene.
An empty **Entity** solely contains its **Transform information**, i.e. its position, rotation and scale. The default property values are:
  - ***Position*** x=0, y=0
  - ***Rotation*** 0
  - ***Scale*** x=1, y=1
* **Create Empty Child**
Create a **Child Entity** that belongs to the selected **Entity**.
For the situation of no **Entity** is selected, this function will create an empty **Entity** as a root one, which behaves exactly the same as **Create Empty** function.

## Search **Entity**
The search box is designed for filtering and locating **Entities** with specific keywords quickly. When there are numerous **Entities** in the scene, or the relationship between them are quite complicating, the search box will improve your efficiency in a great deal.


## Scene Panel
![scene-panel](https://cloud.githubusercontent.com/assets/344547/9374374/c5ee4920-4727-11e5-803d-78de5f3d4fa1.png)
The **Scene Panel** is the core of Fireball Editor. It's usually used for stage designing and building, such as setting up background, floor, obstacles and other visual elements. Thanks to its WYSIWYG feature, it can also be used for layout GUI and test interactive elements.

### Navigation

Currently there are two operation for scene panel navigation:

- <kbd>Shift + Mouse Drag</kbd>: pan the scene view.
- <kbd>Mouse Scroll</kbd>: zoom in and out.

The **Scene Panel** is very easy to master. All you need is to click or drag a selection box to selected the **Entities** you want to edit, transform them will the tools in tool bar, and check the results. When multiple **Entities** are selected, the items will be highlighten in the **Hierarchy Panel**, and handlers will be shown in the **Scene Panel** (but their positions depends on your **handler position setting**, referring to the [Toolbar](#toolbar) manual).

When the scene is large, you can use your mouse scroller for zooming.

Also, you can quick select **Entities** by putting keywords in the search box in the upper-right corner.

## Menus
## Fireball
* **Hide Fireball (Shortcut: <kbd>H</kbd> )**
*In construction*
* **Hide Others (Shortcut: <kbd>Shift + H</kbd> )**
*In construction*
* **Show All**
*In construction*
* **Quit (Shortcut: <kbd>Ctrl/Command + Q</kbd> )**
Exit Fireball Editor
* **Check For Updates**
Check if there is any new version of Fireball Editor to update.
* **About**
Display about information and copyrights of Fireball Editor.
* **Panels**
*In construction*

##File
* **New Scene (Shortcut: <kbd>Ctrl/Command + N</kbd> )**
Create a new scene in current project.
A game consists of one or more scenes. You'll need to create new scenes when you indend to make indepent modules such as new stages, main menu, loading screen, setting screen, etc.
* **Save Scene (Shortcut: <kbd>Ctrl/Command + S</kbd> )**
Save the current editing scene.
A save file dialog will pop up if the current scene is never saved before, in which you can determine where to save your scene file (*.fire). If the scene has been saved, Fireball Editor will update the save file directly.
> It is suggested to place all scene files in a particular directory for management, for example **assets/scenes**.
* **Build Settings**
Set the project build parameters.
Building is a critical step in the deployment process. Fireball Editor will pack and optimize your game files during building process, in order to make it able to be deployed on various platforms fast, safely and correctly. Through Build Settings, you can fine tuning the parameters for certain needs, as well as to preview your game before deployment.
You will find more information about Build Settings in the [Tool Windows](#tool-windows] section.

##Edit
* **Undo (Shortcut: <kbd>Z</kbd> )**
Undo the last operation.
* **Redo (Shortcut: <kbd>Shift + Z</kbd> )**
Redo the latest undone operation.
* **Cut (Shortcut: <kbd>X</kbd> )**
Cut the selected Entity into the clipboard.
* **Copy (Shortcut: <kbd>C</kbd> )**
Copy the selected Entity into the clipboard.
* **Paste (Shortcut: <kbd>V</kbd> )**
Paste the Entity in the clipboard into the current scene.
* **Select All (Shortcut: <kbd>A</kbd> )**
Select all Entities in the current scene.

##Entity
> In Fireball Engine, a game object is called a **Entity**. **Entity** will appear or behave differently by attaching different resources or components. The presentation, interactions and logic execution of a scene are organized by multiple **Entities**.

* **Create Empty**
Create an empty **Entity** in the scene.
An empty **Entity** solely contains its **Transform information**, i.e. its position, rotation and scale. The default property values are:
  - ***Position*** x=0, y=0
  - ***Rotation*** 0
  - ***Scale*** x=1, y=1
* **Create Empty Child**
Create a **Child Entity** that belongs to the selected **Entity**.
For the situation of no **Entity** is selected, this function will create an empty **Entity** as a root one, which behaves exactly the same as **Create Empty** function.

##View
*In construction*

##Window
* **Close (Shortcut: <kbd>W</kbd> )**
Close the Fireball Editor window.

##Developer
* **Reload (Shortcut: <kbd>Ctrl/Command + R</kbd> )**
Reload the Fireball Editor.
* **Recompile (Shortcut: <kbd>F7</kbd> )**
Recompile all scripts in the current scene.
* **Developer Tools (Shortcut: <kbd>Alt + Ctrl/Command + I</kbd> )**
Open the **Developer Tools** window.
Various useful and powerful features are provided in **Developer Tools** for analyzing, debugging and tracing, which are essential for game script developers. You will find more information about **Developer Tools** in the [Tool Windows](#tool-windows) section.
* **Show Selected Asset in Library**
Open the sub-directory of the Library folder where stores the currently selected asset in system file explorer.
* **Test**
  * **Reload Window Scripts**
*In construction*
  * **Reload Core Plugins**
*In construction*
  * **Thrown an Uncaught Exception**
*In construction*
  * **Ipc send2panel foo:bar@foobar@fire**
*In construction*
  * **AssetDB Debugger**
Open the **AssetDB Debugger**, which is for tracking asset modifications and correspondings during debugging. You will find more information about **AssetDB Debugger** in the [Tool Windows](#tool-windows) section.

##Help
* **Website**
Visit the official website of Fireball Engine for more information.
* **Documentation**
Visit the documentation site of Fireball Engine for engine manuals and scripting API references.
* **Forum**
Visit the forum of Fireball Engine to share ideas with other users and developers.
* **Submit An Issue On Github**
Commit an issue in the Fireball Engine Github repository. You can always let us know by committing issues if you encounter bugs or have better ideas about Fireball Engine. Our team will be cheerful and reply you as soon as possible.
* **Subscribe To Newsletter**
Subscribe to Fireball Engine news letters for latest news and updates.

# Toolbar<a id="toolbar"></a>
## Move Tool ![tool-move](/manual/start/editor-overview/tool-move.png)
Move the selected **Entity** by handlers. The handlers will look like below when using the Move Tool:
![preview-move](/manual/start/editor-overview/preview-move.png)
* Dragging the green arrow will move the **Entity** along the coordinates' Y-axis.
* Dragging the red arrow will move the **Entity** along the coordinates' X-axis.
* Dragging the blue rectangle in the centre will move the **Entity** along both of the coordinates' X and Y axes.

## Rotate Tool ![tool-rotate](/manual/start/editor-overview/tool-rotate.png)
Rotate the selected **Entity** by hander. The handler will look like below when using the Rotate Tool:
![preview-rotate](/manual/start/editor-overview/preview-rotate.png)
* Dragging the red handler or any point inside the circle will rotate the **Entity** clockwise or counter-clockwise, depending on the direction of dragging.
* The angel of rotation will be shown during your rotation.

## Scale Tool ![tool-scale](/manual/start/editor-overview/tool-scale.png)
Scale the selected **Entity** by handlers. The handlers will look like below when using the Scale Tool:
![preview-scale](/manual/start/editor-overview/preview-scale.png)
* Dragging the green handler will scale the **Entity** along the coordinates' Y-axis.
* Dragging the red handler will scale the **Entity** along the coordinates' X-axis.
* Dragging the grey rectangle in the centre will scale the **Entity** along both of the coordinates' X and Y axes.

## Use self coordinates ![tool-self-coordinate](/manual/start/editor-overview/tool-self-coordinate.png)
The handlers aligns with **Entity**'s self coordinates, and will rotate as **Entity** rotates.
The handlers will behave as below when using self coordinates.
![preview-self-coordinate](/manual/start/editor-overview/preview-self-coordinate.png)
## Use world coordinates ![tool-world-coordinate](/manual/start/editor-overview/tool-world-coordinate.png)
The handers aligns with the world coordinates, pointing to the world's X and Y axes.
The handlers will behave as below when using world coordinates.
![preview-world-coordinate](/manual/start/editor-overview/preview-world-coordinate.png)
## Place on Pivot ![tool-pivot](/manual/start/editor-overview/tool-pivot.png)
The handlers are placed on pivot of the selected **Entity**. Moving, rotating and scaling use the pivot as centre.
When multiple **Entities** are selected, the handlers will use the first selected one's pivot. An example is shown below (**Entities** are selected from left to right):
![preview-pivot](/manual/start/editor-overview/preview-pivot.png)
## Place on Centre ![tool-centre](/manual/start/editor-overview/tool-centre.png)
The handlers are placed on the centre of the selected **Entities**. Moving, rotating and scaling are based on the centre point.
When multiple **Entities** are selected, the handlers will be placed on the centre of the entire selection area, shown as below:
![preview-centre](/manual/start/editor-overview/preview-centre.png)
## Play ![tool-play](/manual/start/editor-overview/tool-play.png)
Compile and run the current scene. The interaction of **Game Panel** will be activated in the meantime.
## Pause ![tool-pause](/manual/start/editor-overview/tool-pause.png)
Pause the current running game.
By pausing the current game will make it possible to check game data and object states of a certain moment.
## Stepping ![tool-step](/manual/start/editor-overview/tool-step.png)
Run the game to the next frame and the pause.
By stepping, you can tracking the changes of game data and object states in every frame. This function is often used for dynamic debugging in a certain time range.
## Shortcut Mapping ![tool-hotkeys](/manual/start/editor-overview/tool-hotkeys.png)
Clicking this button will pop up the shortcut mapping table for quick reference.
## User Profile ![tool-user](/manual/start/editor-overview/tool-user.png)
*In construction*



# Assets Panel  
![assets-panel](/manual/start/editor-overview/assets-panel.png)

**Assets**, belonging to the entire project, are basic elements for visual presents and logic controls of a game, and are shared among all scenes. **Entities** become useful, such as drawing graphics and executing scripts, only if there are corresponding **Assets**. In Fireball Engine, **Assets** can be of following types:

* Textures
* Normal Maps
* Sprites
* Sprite Animations
* Music and sound effects
* Fonts
* Fire-shell scripts
* Atlases
* Scenes

There are different behaviours for different **Assets** that varies among **Components**. For more information please refer to Fireball Engine API documentaion.

## Asset List

**Assets** of a project are organized by folders. The *Assets* folder is used as root, which means that Fire Editor will load the **Assets** placed in *Assets* folder and its sub folders. There can be numerous **Assets** for a complete game, so it is suggested to organize **Assets** by sub folders for your own convenience. For instance, all scripts should be in the *script* folder, while UI related **Assets** be in the *ui* folder, etc.

Once an **Asset** is selected in the list, its property will be shown in the **Inspector Panel**. You can do multiple selection by <kbd>Shift</kbd> key or <kbd>Ctrl</kbd> key.

You can set the which folder it belongs to by dragging an **Asset** for better structure.

If you want to put an **Asset** into the current scene, simply drag it into the **Hierarchy** panel. The **Asset** will be converted to **Entity** automatically and be placed into the scene.
> Here is an exception: scenes cannot be dragged into **Hierarchy Panel**, for them cannot be contained by another scene. You can open the scene **Assets** by double-clicking them.

Click right mouse button in the list will pop up a context menu, whose features includes:
* **Create**
  - **New Folder**: Create a new sub folder in the selected folder.
  - **New Script**: Create a new fire-shell script. A basic template will be provided in a new script. Details can be found in API documentation.
  - **New Scene**: Create a new scene.
  - **New Atlas**: Create a new atlas (image pack).
  - **New Sprite(Standalone)**: Create a static sprite object. An image as texture must be selected first.
  - **New Sprite Animation**: *In construction*
* **Rename**: Rename the selected **Asset**.
* **Delete**: Delete the selected **Asset**. You can do so with <kbd>Delete</kbd> key as well.
* **Reimport**: Reimport all **Assets** in the Asset List.
* **Show in Explorer**: Open the system file explorer and locate to the **Asset** file.
* **Show in Library**: Open the system file explorer and locate to the meta file of the selected **Asset** in the *Library* folder.
* **Show Uuid**: Print the UUID of the selected **Asset** in the **Console Panel**.

## Add **Assets**
Click the ![add-button](/manual/start/editor-overview/add-button.png) button in the upper-left corner will pop up the **Asset** adding menu, whose features include:

  - **New Folder**: Create a new sub folder in the selected folder.
  - **New Script**: Create a new fire-shell script. A basic template will be provided in a new script. Details can be found in API documentation.
  - **New Scene**: Create a new scene.
  - **New Atlas**: Create a new atlas (image pack).
  - **New Sprite(Standalone)**: Create a static sprite object. An image as texture must be selected first.
You can also add new files to the **Asset Panel** by drag and drop.

## Search **Assets**
The search box is designed for filtering and locating **Assets** with specific keywords quickly. When there are numerous **Assets** in the scene, or the relationship between them are quite complicating, the search box will improve your efficiency in a great deal.

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



# Game Panel
![game-panel](/manual/start/editor-overview/game-panel.png)
The ** Game Panel** is where the game runs. It has no editing functions itself, but while game running, it will simulate the user-end environment, which allows you to ensure what the game looks like in users' eyes, and to check the in-game interactions.

Game view in the **Game Panel** depends on your settings of the camera **Entity**. The good news is, you can set screen ratio in the **Game Panel** to simulate different platforms and screens. Most aspect ratios are self-explained by their names, however there are some special ones:
* **Free Aspect**: Fit the display area with the **Game Panel** size, using the entire available space.
* **Custom Size**: Customize the size of the display area. By selecting this, you can set width and height accurantly in the value boxes to the right, with the unit of pixels.
* **Rotate**: By ticking this option, the game display will rotate by 90 degrees, for landscape simulation.

# Console Panel
![console-panel](/manual/start/editor-overview/console-panel.png)
The **Console Panel** is for monitoring game script running status and console output, in purpose of debugging. Information printed here can be from your scripts, or Fireball Editor itself.

Fireball Editor distinguishes different levels of information by colors. The severities are ordered from the lowest to the highest as:
* **Log** (grey): information usually for tracking or debugging.
* **Info**（blue）: information usually for notification or notes.
* **Warn**（yellow）: information usually for indicating that there is an abnormal situation, but won't crash the game.
* **Error**（red）: information for fatal errors which will crash the game, such as uncaught exceptions.

You can manage information in the **Console Panel** when there is too many:
* **Clear** ![console-clear](/manual/start/editor-overview/console-clear.png): Clear all console outputs.
* **Filter box** ![console-filter](/manual/start/editor-overview/console-filter.png):
Filter console information by keywords. When **Regex** checkbox is ticked, content in the filter box is considered as a regular expression.
* **Level filter combobox** ![console-level](/manual/start/editor-overview/console-level.png):
Display information of only one severity level. All levels will be shown when **All** is selected.
* **Collapse checkbox**: Ticking this checkbox will merge same outputs, with a leading number that tells how many times it has been repeated. This feature is rather useful and space economic when there are many outputs and their sequence don't matter.

# Status Bar
*In construction*

# Tool Windows <a id="tool-windows"></a>
*In construction*

---
title: Assets Panel
category: manual
permalinks: manual/editor-interface/main-menu
---

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

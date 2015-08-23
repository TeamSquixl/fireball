---
title: Hierarchy
category: manual
permalinks: manual/editor-interface/assets
---

![Assets](https://cloud.githubusercontent.com/assets/344547/9374759/8e996776-472b-11e5-93fa-c22247676283.png)

This is where you can access and manage assets of your game. You'd better start from here if you just created an empty project. In that case you'll see an empty list waiting for you to drag stuff into it.

## Basics

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


## Add Assets to Project

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

## Manage Assets

You can rename/move/delete assets in this panel.

- to rename an asset, right click the asset and select `rename` from context menu.
- to move an asset, drag the asset around the tree view, until you're happy with where its new location is. The new folder to hold the asset will be highlighted in orange.
- to delete an asset, right click and select `delete` or select the asset and press <kbd>Cmd + Backspace</kbd> on mac or <kbd>Del</kbd> on windows.

Besides these operations, there are other options in right click context menu that gives you more details about the asset:

- `Reveal in Finder` (mac) `Reveal in Explorer` (win): select this and Fireball will open the folder that contains the asset in Finder/Explorer.
- `Reveal in Library`: open the library folder that contains the imported copy of the asset.
- `Show UUID`: print the UUID of the asset in console panel. This is mainly for debug purpose and normal user should not need it.

## Search Asset

By typing in the search field at top of **Assets** panel,  the asset tree view will only show assets whose filename contains your typed search keyword.

![search asset](https://cloud.githubusercontent.com/assets/344547/9376761/ffbc3312-4743-11e5-9b3e-d7f5abe64b95.png)

It's convenient to find the asset you want this way if your project is getting bigger. Once you find the asset you want, select it in the filtered list, and click the pin icon at the right of search field. It will go back to assets tree view and keep the asset you find highlighted.

---

Continue to read [Hierarchy](/manual/editor-interface/hierarchy).

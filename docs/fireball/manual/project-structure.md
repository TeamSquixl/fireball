---
title: Project Structure
category: manual
permalinks: manual/project-structure
---


##Project File Structure
Files are structured in a Fireball project as below:
```
ProjectName
├──assets
├──library
├──local
├──settings
└──temp
```
- Public folders to project collaborators
  - **assets**
    Project resource files, including all actual elements used to form up a project. Such as:
    - Scenes
    - Scripts
    - Sprites
    - Textures
    - Audio files
    - ...
    Just think them as all loaded resources in the Assets Panel of the [Editor]（/start/editor-overview)
  - **settings**
    Global project settings, which are of project-level and shared by all project collaborators. Such as:
    - Plug-in settings
    - Button settings
    - Physics settings
    - ...
- Private folders used by current client *(and you should ignore them in version control)*
  - **library**
    Files in this folder are for resource library management, and will be used by the [Editor](/manual/start/editor-overview) for library data persistence and resource display.
  - **local**
    Local project settings, which store user's customized settings, such as Editor layout.
  - **temp**
    Temporary files created by Fireball Engine.


---
###Next...
- Read [Editor Overview](/manual/start/editor-overview/) to learn more about the IDE.

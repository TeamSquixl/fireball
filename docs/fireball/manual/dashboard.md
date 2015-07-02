---
title: Dashboard
category: manual
permalinks: manual/dashboard
---

Dashboard is the first thing you see when launch Fireball Editor. From here you can create new project, open existing project and get helpful information. Let's open Fireball and get started right now!

## Dashboard Overview

![dashboard-overview](https://cloud.githubusercontent.com/assets/344547/8473028/d0fc7a50-20d8-11e5-8737-dd2fca288d9f.png)

This is Fireball dashboard, it contains the following tabs:

- **Recent Projects**: a list of recently opened projects
- **New Project**: a wizard to guide you through creating a new Fireball project.
- **Open Others**: open a project anywhere on your disk, click this tab will open a dialog to browse files.
- **Help**: a static page with useful information about Fireball and dashboard.

Let's get to know them one by one.

### Recent Projects

You can quickly access recently opened projects via **Rencent Projects**. This page may be empty the first time you run Fireball, don't worry you can get back here after you created one or two projects.

![recent project hovering](https://cloud.githubusercontent.com/assets/344547/8473491/97fc0438-20dc-11e5-9b07-18f6963d5945.png)

By hovering your mouse on a recent project entry, action buttons will be displayed on top of the project entry. You can:

- Click **Open** to open the project in Fireball Editor
- Click **Close** to remove the selected entry from the recent project list. This doesn't delete the actual project folder from your disk.

By hovering or click on a project entry, you'll see its location path in status bar at the bottom of dashboard:

![status bar](https://cloud.githubusercontent.com/assets/344547/8473565/3892ba7c-20dd-11e5-954e-5bd7aac44575.png)

### New Project

You can create a new Fireball project via **New Project** tab. Click `New Project` will bring out a wizard page for setting up new project as you want.

#### Select a Runtime Engine

First we will choose a runtime game engine for your project. Beware that in Fireball we use game engine's original API for scripting, so you can't really convert a project with EngineA to EngineB once you create it. Choose the game engine you're familiar with or most suitable for your project.

![choose runtime engine](https://cloud.githubusercontent.com/assets/344547/8473934/9ba21e6c-20df-11e5-8057-09cbfb38aebc.png)

In this page you can see a list of runtime engine. By clicking on one of them, you'll see the runtime engine's description at the bottom of the page.

Click **Learn More** to jump over to the website of current selected runtime engine.

Click **Next** button to go to next step.

#### Select a Project Template

Now we're at project template selecting page. A project template can contain scaffolding of a certain type of game project, or a bunch of useful resources and scripts to help you create game more quickly and easily.

*Note: There are not many template to choose at early stage of Fireball. We will keep adding templates to cover more game type and user needs in future releases.*

Click on one of the template to see its description.

![choose template](https://cloud.githubusercontent.com/assets/344547/8474608/de419eb0-20e3-11e5-8b10-f55ba37806ef.png)

At the bottom of the page you can specify the location path and name of your project. The text input field shows you the location path, the last part of the path will be used as project name.

You can also click **Browse** button to choose a location by browsing through your disk.

Once everything is ok, click **Create** button to create your new project. Dashboard will be shut down, the new project will be loaded in Fireball Editor.

You can also click **Back** to go back and choose another engine.

### Open Other...

Can't find your project in **Recent Projects** page? Or just downloaded a project from online? You can find your project anywhere in your disk with **Open Other** tab.

Click the tab will open a pop-up dialog with local file system. Choose your project folder in this dialog Fireball Engine maintains projects with **directories** instead of particular project files.

###Help
You can access Fireball manuals and help documentations with **Help**.

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

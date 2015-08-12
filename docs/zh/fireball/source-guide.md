# Fireball Source Guide

Fireball contains several submodule repos and other "dependency" repos. This doc will guide you through Fireball repo structure and important sub repos to help you better understand and hack Fireball.

## Fireball Structure

```plain
Fireball
  |--engine-framework (Submodule, an Entity-Component interface for connecting Fireball Editor and other game engines)
  |--editor-framework (Submodule, the backbone of Fireball editor, a framework for easy dockable editor making)
  |--asset-db (Submodule, assets and data management system, integrated with VCS and custom data interpreter)
  |--canvas-studio (aka Fireball editor, an editor-framework app)
  |--dashboard (with user login, project management, tutorial and project tempalate browser)
  |--package-studio (a helper app for creating and testing packages)
  |--builtin (Cloned repo, builtin packages, such as console, package-manager, inspector)
  |--runtime (Cloned repo, each engine has a runtime in this folder)
  |--test (Unit test run in Electron environment)
```

Developers can utilize **Engine-Framework**, **Editor-Framework** and **Asset-Database** to combine their favorite game engine and editor tools to make the perfect game development toolset they need.

## Editor Framework

`TODO`


## Engine Framework

`TODO`

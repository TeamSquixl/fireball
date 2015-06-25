![Fireball Game Engine](https://cloud.githubusercontent.com/assets/344547/6882303/a8b7a740-d5ba-11e4-9518-e6494b1c94fa.png)

![release badge](https://img.shields.io/github/tag/fireball-x/fireball.svg)
[![Dependency Status](https://david-dm.org/fireball-x/fireball.svg)](https://david-dm.org/fireball-x/fireball)
[![devDependency Status](https://david-dm.org/fireball-x/fireball/dev-status.svg)](https://david-dm.org/fireball-x/fireball#info=devDependencies)
<a href="https://fireball-slack.herokuapp.com"><img src="http://fireball-slack.herokuapp.com/badge.svg"></a>

Fireball is a hackable game editor for creating mobile and HTML5 games, providing powerful scene editor and other integrated tools for open source game engines such as [Cocos2D-JS](https://github.com/cocos2d/cocos2d-js), [Pixi.js](https://github.com/GoodBoyDigital/pixi.js). We will be supporting more engines in the future.

Fireball consists of:

- [Editor framework](https://github.com/fireball-x/editor-framework) for creating multi panel editor UI.
- [Engine framework](https://github.com/fireball-x/engine-framework) to enable entity-component like workflow for any JavaScript game engine.
- [Package Manager](https://github.com/fireball-packages/package-manager) for adding and managing editor extensions easily.
- [Asset Database](https://github.com/fireball-x/asset-db) for managing game assets with native file system.

Fireball is a cross-platform software powered by [Electron](https://github.com/atom/electron) and [Polymer](https://github.com/polymer/polymer). Currently we test our distribution on Mac and Windows 7/8.1. Issues and PR on other platform are welcome!

Learn what's going on from [Fireball Beta Roadmap](https://github.com/fireball-x/fireball/issues/3).

## Prerequisite

- Install [node.js v0.12+](https://nodejs.org/) or [io.js v2.0+](https://iojs.org/en/index.html)
- Install [gulp](https://github.com/gulpjs/gulp) command line tool
- Install [bower](http://bower.io/) command line tool

## Install

In cloned project folder, run the following command to setup dev environment:

```bash
# Initialize gulp task dependencies
# npm is a builtin CLI when you install Node.js
npm run init

# bootstrap
gulp bootstrap
```

Bootstrap task will run the following command in sequence, so if anything goes wrong during the bootstrap process, you can manually run these commands to get back on track:

```bash
# Initialize git submodules
git submodule update --init

# Install builtin packages
gulp install-builtin

# Install runtime packages
gulp install-runtime

# Install fireshell(electron)
gulp update-electron

# Install npm packages
gulp npm # DO NOT use npm directly

# Install bower packages
bower install
```

## Run

Here are ways to run fireball development version:

```bash
# Run fireball's dashboard
gulp run

# Open Fireball Package Studio
gulp package-studio

# Open a Fireball project
gulp fireball --path path/to/project
```

You can run package studio with path parameter like this:

```bash
# Open Fireball Package Studio with default builtin packages
gulp package-studio

# Open Fireball Package Studio with all packages in editor-framework/demo loaded
gulp package-studio --path editor-framework/demo

# Open Fireball Package Studio with a single package editor-framework/demo/grid loaded
gulp package-studio --path editor-framework/demo/grid
```

Package Studio will detect the path argument you sent to it, if there is a
package.json under the path, it will treat your path as a single package, and load
it after builtin package loaded.

Otherwise, Package Studio will register your path as a package loading path through
`Editor.registerPackagePath` function, and load any packages under it. This also trigger
the watch for the path, so any packages you add to this path after Studio opened, will
be loaded automatically.

## Update

To get the latest fireball build:

```bash
# Update fireball from github repo,
# also update builtin packages and electron binary
gulp update

# Optional, update npm and bower dependencies
gulp update-deps
```

`gulp update` will run `git pull origin` in fireball's root folder. This way submodules will be updated according to fireball repo's commit. In case you want to update all submodules to latest commit, run following command:

```bash
gulp pull-submodules
```

## Test

```bash
# Run all tests
npm test

# Run a single test
npm run test -- <testfile...>

# Run test in submodule
npm run test -- editor-framework/test/<testfile...>

# Run All test of a submodule
npm run test -- editor-framework
```

All test files are located in [test](/test/) folder or submodule's `test/` folder.

## API Docs

```bash
# Generate and preview API docs
npm run gendoc
```

## Feedback & Contribution

- Join our [community on slack](https://fireball-slack.herokuapp.com), then access with http://fireball.slack.com/
- If you have questions about a specific page of documentation, use the disqus sidebar on the left of [Fireball Documentation Site](http://docs.fireball-x.com).
- If you have any suggestion/feedback/problem, feel free to [submit an issue](https://github.com/fireball-x/fireball/issues).
- If you want to contribute to this project, please read [Contributing Guidelines](https://github.com/fireball-x/fireball/blob/master/CONTRIBUTING.md).


## Fireball 0.4

We are refactoring Fireball to make it compatible with more open source HTML5 game engines. Fireball 0.5 will fully support Cocos2D-JS api, and we will add more engine support in the near future. Fireball users can use each engine with its original api.

For Fireball 0.4, we have wrapped Cocos2D-JS and Pixi.js with our own API. Please check out the following content.

### Download

1. Download distribute version from [release page](https://github.com/fireball-x/fireball/releases).
2. Extract the zip file to a folder of its own. This folder can locate anywhere on your disk.
3. Click `Fireball.app` on Mac or `fireball.exe` on Windonws to launch fireball.
4. Have fun!

### Get Started

Visit http://docs.fireball-x.com to learn how to use Fireball Game Engine.

### Examples

- [Examples](https://github.com/fireball-x/examples) - Every Fireball components and features are demonstrated in this project. Check out the example one by one and you'll get what Fireball is capable of.
- [Tutorial](https://github.com/fireball-x/tutorial) - Step by step guide to build your first game with Fireball.
- [Duang Sheep](https://github.com/fireball-x/game-duang-sheep) - Flappy bird clone featuring a jumping sheep!
- [1010!](https://github.com/fireball-x/game-1010) - 1010! clone, play tetris in a 10x10 grid.

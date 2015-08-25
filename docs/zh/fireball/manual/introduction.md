---
title: Fireball简介
category: manual
permalinks: manual/introduction
---

Fireball 是一款游戏引擎吗？—— 不是。
Fireball 是全功能整合型的游戏开发解决方案吗？ —— 是的。
我在使用一款开源 JavaScript 引擎开发游戏，我能在此基础上使用 Fireball 来扩展我的工具链来获得完整顺畅的资源和场景编辑工作流程吗？—— 完全OK！

## 跨引擎编辑器解决方案

Fireball 是业内首个支持多种游戏引擎的整合型游戏开发编辑器。整体的架构如下图所示：

![fireball-structure](https://cloud.githubusercontent.com/assets/344547/8515113/e3bceec4-23ce-11e5-97f6-ecbe87df5d90.png)

通过三层结构的共同作用，Fireball 为用户提供了包括以下功能的全套开发解决方案：

- 创建、编辑场景，并以此为核心组织你的游戏内容。
- 允许用户拖拽脚本到 node 节点（或者 game object, display object, entity 等等，由你喜爱的引擎命名）来为场景中的节点物件添加功能和行为。
- 将脚本中的变量成员序列化，使非程序员也可以在编辑器中随时修改这些数据。
- 编辑器提供了一键运行和预览游戏的功能，还可以随时暂停调试。
- 提供了一套轻量而强大的资源管理系统，保存资源地址到 uuid 的映射，用户可以在项目中随意移动、重命名、复制资源，而不用担心编辑器中对资源的引用失效。
- 提供完整的资源生产和编辑流程，包括：sprite、图集、时间轴动画、骨骼动画、GUI、粒子、预制体等。
- 开放的包管理系统允许用户快速容易的扩展编辑器功能。你甚至可以开发支持跨引擎的编辑器工具。

如果你对我前面说的这些内容感到迷惑，请放心。你要使用 Fireball 的话不一定需要了解内部的作用原理。看不懂的地方跳过就好，后面的文档
会从用户界面开始详细介绍如何上手 Fireball。

## Scene-Graph 和 Hierarchy 层级视图

Fireball 能够支持任意 [scene-graph](https://en.wikipedia.org/wiki/Scene_graph) 结构的 JavaScript 游戏引擎。
通常在这些引擎里用户需要专门编写脚本来描述场景中物体的位置、大小和结构关系。在 Fireball 里我们使用图形界面的 Hierarchy 视图来
帮助用户用可视化的拖拽的方式来构建场景中节点的层级关系。

在 Hierarchy 视图中你可以创建/移除节点，展开或折叠节点下面的所有子节点，或者拖拽一个节点到另一个节点下面，建立和修改父子关系。

Hierarchy 是场景和节点的编辑场所，是连接其他核心编辑器模块的中枢。例如，Inspector 属性检查器只有在 Hierarchy 中选中一个节点后
才能作用。要了解 Hierarchy 的详细指南，请阅读[Hierarchy介绍文档](/manual/editor-interface/hierarchy).

**注意：** 如果你不理解节点（Node）的含义，可以阅读[Cocos2d-x 编程指南中这一篇内容](http://www.cocos2d-x.org/programmersguide/2/index.html#scene-graph).

## 节点类型和 Behavior 行为脚本

Fireball 支持的游戏引擎通常会由很多类（Class）组成，不同的类定义了节点和物件的不同功能。在 Fireball 里你可以在 [Hierarchy视图](/manual/editor-interface/hierarchy) 中创建这些类的实例。例如创建一个 Sprite 节点，等同于创建一个`cc.Sprite`(cocos2d-js) 类的实例；一个 LabelBMFont 节点相当于一个`cc.LabelBMFont`(cocos2d-js)类的实例。这些不同类型的节点担负起了渲染 sprite、文字、
UI 界面、tilemap 和动画的任务。

除此以外，Fireball 还允许用户向任意类型的节点添加由属性和函数功能组成的 Behavior 行为脚本。从而赋予这些节点新的功能和表现。

### Inspector 属性检查器

[Inspector](/manual/editor-interface/inspector) 是展示和编辑当前选中节点的详细信息的视图面板。我们把这些可编辑的信息称为
properties（属性）。Inspector 中可以看到的属性分为节点类型属性和 Behavior 行为属性。

![inspector](https://cloud.githubusercontent.com/assets/344547/9423058/c973e162-48e5-11e5-8858-5d9661dee749.png)

程序员可以编写行为脚本，并将其中一些成员作为属性暴露在 Inspector 里，这样就可以有效的把数据录入和调试的工作转交给美术和策划等
团队成员来完成。

要了解更多关于 Inspector 的使用指南，请阅读编辑器界面介绍中的[Inspector 章节](/manual/editor-interface/inspector)。

### 挂载 Behavior 行为到节点

要将编写好的 behavior 行为脚本挂载到节点上，只需要拖拽脚本资源到当前选中 node 的 Inspector 面板上。你可以立刻在 Inspector 面板
下部看到刚刚挂载的行为和属性。对同一个节点可以挂载多个不同的行为脚本，Inspector 会把所有挂载的行为和他们的属性都列在面板下部。

要了解 Behavior 行为脚本如何作用，请阅读[Behavior行为编程指南](/manual/scripting/attachable-script)。

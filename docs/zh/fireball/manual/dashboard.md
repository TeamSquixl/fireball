---
title: Dashboard
category: manual
permalinks: manual/dashboard
---

启动 Fireball 以后，就会打开 Dashboard 界面，在这里你可以新建项目、打开已有项目以及获得帮助信息。现在请启动 Fireball 来开始学习吧。

## Dashboard 总览

![dashboard-overview](https://cloud.githubusercontent.com/assets/344547/8473028/d0fc7a50-20d8-11e5-8737-dd2fca288d9f.png)

上图所示的就是 Fireball 的 Dashboard 界面，包括以下几种选项卡：

- **Recent Projects**: 列出最近打开项目，Dashboard 默认会显示这个列表。
- **New Project**: 新建项目，选择这个选项卡，会进入一系列创建 Fireball 项目的指引。
- **Open Others**: 浏览要打开的项目，如果你的项目没有在最近打开的列表里，你也可以点击这个按钮来浏览和选择你要打开的项目。
- **Help**: 帮助信息，一个包括各种新手指引信息的静态页面。

我们来依次介绍这些功能界面。

### Recent Projects （最近打开项目）

你可以通过 **Rencent Projects** 选项卡快速访问近期打开过的项目。第一次运行 Fireball 时，这个列表应该是空的，你可以在创建
了一些项目后回来，并看到你新建的项目。

![recent project hovering](https://cloud.githubusercontent.com/assets/344547/8473491/97fc0438-20dc-11e5-9b07-18f6963d5945.png)

当你的鼠标悬停在一个最近打开项目的条目上时，会显示出可以对该项目进行操作的行为：

- 点击 **Open** 在 Fireball 编辑器中打开该项目
- 点击 **Close** 将该项目从最近打开项目列表中移除，这个操作不会删除实际的项目文件夹。

此外，当鼠标点击选中或悬停在项目上时，你能够在 Dashboard 下方的状态栏看到该项目所在路径。

![status bar](https://cloud.githubusercontent.com/assets/344547/8473565/3892ba7c-20dd-11e5-954e-5bd7aac44575.png)

### New Project（新建项目）

你可以在 **New Project** 选项卡里创建新的 Fireball 项目，下面我们一步步介绍创建指引中的步骤。

#### 选择运行时引擎（Runtime）

首先要为你的新项目选择一个游戏引擎，作为运行时程序库。Fireball 的开发者用户需要使用目标引擎的 API 来完成游戏脚本编程，
因此一旦选定了引擎，之后在项目开发过程中就不能更换了。用户应该选择自己最为熟悉和喜爱的引擎来开发项目。

![choose runtime engine](https://cloud.githubusercontent.com/assets/344547/8473934/9ba21e6c-20df-11e5-8057-09cbfb38aebc.png)

在这个页面，你会看到可用的引擎列表。点击其中任何一个，就可以在页面下方的描述栏看到该引擎的详细信息。

点击 **Learn More** （了解更多）来打开当前选中引擎的官方网站。

点击 **Next** （下一步）继续创建项目。

#### 选择项目模板（Project Template）

现在我们来到了项目模板选择页面，项目模板包括了某类特定游戏的基本架构、范例资源和脚本，来帮助你快速搭建游戏项目。

*注意： 早期的 Fireball 版本中还没有很多可选择的项目模板，我们会随着 Fireball 功能逐渐完整持续添加更多模板为用户提供方便。*

点击选择一个模板，你可以在页面下方看到该模板的描述。

![choose template](https://cloud.githubusercontent.com/assets/344547/8474608/de419eb0-20e3-11e5-8b10-f55ba37806ef.png)

在页面下方你可以看到项目名称和将会保存到的地址。你可以在项目路径输入框手动输入项目所在路径和项目名称，
路径的最后一节就是项目名称。

你也可以点击 **Browse** 按钮，打开浏览路径对话框，在你的本地文件系统中选择一个位置来存放新建项目。

一切都设置好后，点击 **Create** 按钮来完成项目的创建。Dashboard 界面会被关闭，然后新创建的项目会在 Fireball 编辑器窗口中打开。

如果你对引擎选择不满意，也可以点击 **Back** 按钮来返回上一步。

### Open Other...（浏览项目）

如果你在 **Recent Projects** 页面找不到你的项目，或者刚刚从网上下载了一个从未打开过的项目时，你可以通过 **Open Other**
选项卡按钮在本地文件系统浏览并打开项目。

点击 **Open Other** 后，会弹出本地文件系统的选择对话框，在这个对话框中选中你的项目文件夹，并选择打开就可以打开项目。

*注意：Fireball 使用特定结构的文件夹来作为合法项目标识，而不是使用工程文件。*

### Help（帮助信息）

你可以通过 **Help** 页面访问 Fireball 用户手册和其他帮助文档。

![dashboard help](https://cloud.githubusercontent.com/assets/344547/8475754/e5ea1ee0-20ec-11e5-9cbe-ab8ee3540de5.png)

---
title: Console Panel
category: manual
permalinks: manual/editor-interface/console
---

![console](https://cloud.githubusercontent.com/assets/344547/9423605/021a5b0a-48fe-11e5-93d9-d728d4c81eef.png)

The **Console Panel** is for monitoring game script running status and console output, in purpose of debugging. Information printed here can be from your scripts, or Fireball Editor itself.

Fireball Editor distinguishes different levels of information by colors. The severities are ordered from the lowest to the highest as:
* **Log** (grey): information usually for tracking or debugging.
* **Info**（blue): information usually for notification or notes.
* **Success** (green): information for feedback of successful operation.
* **Warn**（yellow）: information usually for indicating that there is an abnormal situation, but won't crash the game.
* **Error**（red）: information for fatal errors which will crash the game, such as uncaught exceptions.

You can manage information in the **Console Panel** when there is too many:

* **Clear** ![clear](https://cloud.githubusercontent.com/assets/344547/9423627/4faead48-48ff-11e5-8373-8aad225d82d5.png): Clear all console outputs.
* **Filter box** ![filter](https://cloud.githubusercontent.com/assets/344547/9423628/5a771b3e-48ff-11e5-9189-4c589b22ceb0.png):
Filter console information by keywords. When **Regex** checkbox is ticked, content in the filter box is considered as a regular expression.
* **Level filter combobox** ![level](https://cloud.githubusercontent.com/assets/344547/9423630/64b8f9a0-48ff-11e5-90ea-b035f9504962.png):
Display information of only one severity level. All levels will be shown when **All** is selected.
* **Collapse checkbox** ![collapse](https://cloud.githubusercontent.com/assets/344547/9423634/7552bc2e-48ff-11e5-89c2-2ad2603d87c8.png): Ticking this checkbox will merge same outputs, with a leading number that tells how many times it has been repeated. This feature is rather useful and space economic when there are many outputs and their sequence don't matter.

---

Continue to read [Main Menu](/manual/editor-interface/main-menu).

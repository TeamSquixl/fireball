---
title: Assets Panel
category: manual
permalinks: manual/editor-interface/console
---

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

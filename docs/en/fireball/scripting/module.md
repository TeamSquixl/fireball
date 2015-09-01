---
title: Module
categories: manual
permalinks: manual/scripting/module
---

In Fireball you can split your program into multiple module script and reference each other. Let's see how to define and use modules in Fireball scripts (also known as *modularization*).

> In this article, we consider module and script equal to each other. All sections with **note** are advanced material, beginner can safely skip those.

## Overview

If you're not sure what can modularization do for you, it's basically (with significant differences):

- `include` in C/C++
- `using` in C#
- `import` in Java and Python
- `link` in HTML

Modularization allow you to access other script in Fireball:

- Access public member of other script files
- Call public method of other script files
- Use public type of other script files
- Access or inherit other Behaviors

The way Fireball modularize scripts are nearly identical to JavaScript and node.js:
- Each individual script file is a module.
- Each module has its own scope ( in the module, any variable declared with `var` keyword cannot be accessed by other scripts )
- Use `require` method to reference other modules
- Put public variables in `module.exports` to allow access from other scripts

All of your script file, be it module or not, will be compiled to native JavaScript by Fireball and can run in any modern Mobile browser.

## Reference Modules

### require

Except API provided by Fireball, all user defined modules need to use `require` to access. Let's say we need to access a Behavior script called `Rotate`:

```js
var Rotate = require('rotate');
```

The return object of `require` method is target module's exported object. Usually we will store the object into a variable. The script file name should be passed to `require`. You should not include path or file extension, also keep in mind it's case sensitive.

### Full Example

Let's create a child class extending `Rotate`, named `SinRotate.js`:

```js
var Rotate = require('rotate');

var SinRotate = Fire.Class({
    extends: Rotate,
    update: function (delta) {
        this.rotation += this.speed * Math.sin(Date.now());
    }
});
```

We defined a new Behavior called `SinRotate` which inherits `Rotate` and overrides `update` method. This Behavior can be accessed by other script with `require('SinRotate')`.

**Note**:
- `require` can be called anywhere in your script.
- When the game loads all scripts will be required and executed once. No matter how many times a module is required, you still got the same module instance.
- When debugging in **DevTools** console, you can require any module in the project.

## <a name="define"></a>Define Module

### Define Behavior

Create a new script file named `Rotate.js`, define a Behavior like this:

```js
var Rotate = Fire.Class({
    extends: Fire.Behavior,
    properties: {
        speed: 1
    },
    update: function () {
        this.transform.rotation += this.speed;
    }
});
```

A Behavior class should have `extends: Fire.Behavior` in prototype object. Fireball will automatically export Behavior module for you. So you can require this Behavior from any other scripts.

### Define Non-FireClass JavaScript Module

You can use any JavaScript file as module. Let's say we have a normal JavaScript file `config.js`.

```js
var config = {
    moveSpeed: 10,
    version: '0.15',
    showTutorial: true,

    load: function () {
        // ...
    }
};
config.load();
```

If we want to access `config` object in this script:

```js
// player.js
var config = require('config');
Fire.log('speed is', config.moveSpeed);
```

You'll get a error: `TypeError: Cannot read property 'moveSpeed' of null`. Because we haven't set export for `config.js` file. To make it work, just use `module.exports` to add `config` object:

```js
module.exports = config;
```

> Why we don't have to set exports for Behaviors?
  Behavior is the most common FireClass and will be treated differently by Fireball.
  Fireball will automatically set exports for the whole Behavior module.

Full code for this example:

```js
// config.js
var config = {
    moveSpeed: 10,
    version: '0.15',
    showTutorial: true,

    load: function () {
        // ...
    }
};
config.load();

module.exports = config;
```
```js
// player.js
var config = require('config');
Fire.log('speed is', config.moveSpeed);
```

You'll get correct output: `speed is 10`.

## More Examples

### Export Variable

- `module.exports` by default is an empty object (`{}`), you can add new key-value pairs to it.

    ```js
    // foobar.js:
    module.exports.foo = function () {
        Fire.log("foo");
    };
    module.exports.bar = function () {
        Fire.log("bar");
    };
    // test.js:
    var foobar = require("foobar");
    foobar.foo();    // "foo"
    foobar.bar();    // "bar"
    ```
- `module.exports` can add any JavaScript type:

    ```js
    // foobar.js:
    module.exports = {
        FOO: function () {
            this.type = "foo";
        },
        bar: "bar"
    };
    // test.js:
    var foobar = require("foobar");
    var foo = new foobar.FOO();
    Fire.log(foo.type);      // "foo"
    Fire.log(foobar.bar);    // "bar"
    ```

### Encapsulate Private Member

All variables defined with `var` is only accessible inside the file scope of the script. So we define private member in module scope like this:

```js
// foobar.js:
var dirty = false;
module.exports = {
    setDirty: function () {
        dirty = true;
    },
    isDirty: function () {
        return dirty;
    },
};

// test1.js:
var foo = require("foobar");
Fire.log(typeof foo.dirty);        // "undefined"
foo.setDirty();

// test2.js:
var foo = require("foobar");
Fire.log(foo.isDirty());           // true
```

**Note**: If you omit `var` when define variable, it will become a global variable! (Accessible from any script in your project)

```js
// foobar.js:
dirty = false;        // This makes dirty a global variable! don't if you're not sure!
module.exports = {
    setDirty: function () {
        dirty = true;
    },
};
```

## Circular Reference

(TODO)

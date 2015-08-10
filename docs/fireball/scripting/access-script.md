---
title: Script Accessibility
category: manual
permalinks: manual/scripting/access-script
---

In this chapter we introduce how to communicate between:

- FireClass and the node it attached to
- Different FireClass scripts
- FireClass and EngineClass (means class defined in a script with engine API)


## Access Current Node

Use `this` in your FireClass to access current node. FireClass must be attached to a node to work, so `this` always point to its node instance.

## Access FireClass Members

If two FireClass are attached to the same node, the communication between these two are very straight-forward:

```js
//ClassA.js
var ClassA = Fire.Class({
    extends: Fire.Behavior,
    properties: {
        propA: 'hello world!'
    }
});

//ClassB.js
var ClassB = Fire.Class({
    extends: Fire.Behavior,
    // ...
    whatASay: function() {
        Fire.log(this.propA);
    }
});
```

This example shows as long as you have two scripts attached to the same node, they share the same class instance (thanks to mixin). Thus you can use `this.propA` to access ClassA's member from ClassB's script.

>**IMPORTANT NOTE** Although it looks easy to access another class on the same node via `this`, we strongly recommend to use this pattern with caution. Since it's easy to get bloated member list and it's hard to differentiate which class a member belong to on the same node. For more specific strategy and recommended patterns, read [Best Scripting Practice]().

### Access Class Member on Another Node

If two FireClass attached to two different nodes, all you need to do is to access the node instance. Then every member from scripts that attached to it are available.

```js
//ClassA.js attached to NodeA
var ClassA = Fire.Class({
    extends: Fire.Behavior,
    properties: {
        propA: 'hello world!'
    }
});

//ClassB.js attached to NodeB
var ClassB = Fire.Class({
    extends: Fire.Behavior,
    properties: {
        classAInstance: { // drag NodeA to this property field of NodeB Inspector
            default: null,
            wrapper: cc.Node
        }
    }
    whatClassASay: function() {
        Fire.log(classAInstance.targetN.propA);
    }
});
```

## Access Non-FireClass Script (not attached to node)

You can write any kind of JavaScript in your project, and your FireClass script or other non-FireClass script will be able to access them. Basically there are two ways:

### Global Variable

If you create a variable in your JavaScript without using `var` or `function` keyword, your variable will be accessible from any script in your project.

Let's see an example:

```js
//Resource.js, this file can have any name
global_res = {
    imageA : "res/imageA.png",
    imageB : "res/imageB.png"
};
```

In your FireClass, you can access imageA like this:

```js
//MyClass.js
var MyClass = Fire.Class({
    extends: Fire.Behavior,
    // ...
    loadImage: function () {
        // let's assume there's a load function in this class that takes
        // a file path and load the image file and return the resource
        var image = this.load(global_res.imageA);
    }
});
```

### JS Modules

If you're not a fan of global variables, you can write your JS file as a module and use it with  [CommonJS](https://en.wikipedia.org/wiki/CommonJS) standard. Let's see an example:

```js
//MyModule.js, now the filename matters
function myMethod() {
    //Do something
};
module.exports = {
    myMethod: myMethod
};

//MyFireClass.js
var MyModule = require('MyModule');
var MyFireClass = Fire.Class({
    extends: Fire.Behavior,
    // ...
    useModule: function () {
        // this feels more safe since you know where the method comes from
        MyModule.myMethod();
    }
});
```

For details, please refer to the [Module](/manual/scripting/module).

### Access FireClass From Engine Script

Access FireClass during runtime is the same deal with access a node instance with engine API. For example:

- In Cocos2d-js, you can find a node with [cc.Node.getChildByName](http://www.cocos2d-x.org/reference/html5-js/V3.6/symbols/cc.Node.html#getChildByName)
- In Pixi.js, you can find a node with [PIXI.Container.getChildAt](http://pixijs.github.io/docs/PIXI.Container.html#getChildAt)

Once you have the node, you can access all FireClass properties, functions and members. Of course, you need to attach your FireClass onto that node first.

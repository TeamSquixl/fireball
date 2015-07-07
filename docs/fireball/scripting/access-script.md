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
    properties: {
        propA: 'hello world!'
    }
});
module.exports = ClassA;

//ClassB.js
var ClassB = Fire.Class({
    whatASay: function() {
        Fire.log(this.propA);
    }
});
module.exports = ClassB;
```

This example shows as long as you have two scripts attached to the same node, they share the same class instance (thanks to mixin). Thus you can use `this.propA` to access ClassA's member from ClassB's script.

### Access Class Member on Another Node

If two FireClass attached to two different nodes, all you need to do is to access the node instance. Then every member from scripts that attached to it are available.

```js
//ClassA.js attached to NodeA
var ClassA = Fire.Class({
    properties: {
        propA: 'hello world!'
    }
});
module.exports = ClassA;

//ClassB.js attached to NodeB
var ClassB = Fire.Class({
    properties: {
        classAInstance: { // drag NodeA to this property field of NodeB Inspector
            default: null,
            type: ClassA
        }
    }
    whatClassASay: function() {
        Fire.log(classAInstance.propA);
    }
});
module.exports = ClassB;
```

## Access Engine Script (not attached to node)

In JavaScript there's no private member, so every engine script in your project that not wrapped in an object can be accessed from anywhere, including from FireClass.

Let's see a generic JavaScript file in your project:

```js
var global_res = {
    imageA : "res/imageA.png",
    imageB : "res/imageB.png"
};
```

In your FireClass, you can access imageA like this:

```js
//MyClass.js
var MyClass = Fire.Class({
    loadImage: function () {
        // let's assume there's a load function in this class that takes
        // a file path and load the image file and return the resource
        var image = this.load(global_res.imageA);
    }
});
module.exports = MyClass;
```

### Access FireClass From Engine Script

Access FireClass is the same deal with access a node instance with engine API. For example:

- In Cocos2d-js, you can find a node with [cc.Node.getChildByName](http://www.cocos2d-x.org/reference/html5-js/V3.6/symbols/cc.Node.html#getChildByName)
- In Pixi.js, you can find a node with [PIXI.Container.getChildAt](http://pixijs.github.io/docs/PIXI.Container.html#getChildAt)

Once you have the node, you can access all FireClass properties, functions and variable defined in constructor.

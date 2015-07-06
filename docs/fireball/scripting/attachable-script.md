---
title: FireClass: Attachable Script in Fireball
category: manual
permalinks: manual/scripting/attachable-script
---

What's the point of a scene editor if we can't attach scripts to scene nodes and give them behaviors that we can combine and tweak in Inspector? Fireball's great advantage is to allow you write script that can be attached to scene nodes, while you can still call any engine API from the script! Let's work it out.

## FireClass

An attachable script defines a `FireClass`. The filename of the script is the class name. For example a script named `MyClass.js` creates a `FireClass` named `MyClass`.

(screenshot)

Once the script is attached to a node, the class name will be used for identifying this modular script in Inspector.

(screenshot)

The whole process is similar to how you write component script for an entity-component system but behind the scene they are quite different. Learn more about how it's implemented at [here]().

## Basic Structure of an Attachable Script

Create a script file that follow this pattern:

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    properties: {
        // properties that you want to serialize and exposed in Inspector
    }
});
// you must export the class as a module since we use require to load these FireClass
module.exports = MyClass;
```

The name `MyClass` in the script is not relevant, only the **filename of the script** is used for identifying this FireClass. Thus it's not allowed to create scripts with the same name in a single project.

As long as your script conform to this basic structure, it can be dragged and attached onto a node. Let's keep going to see how to add property and function to your script.

## Add Properties

To allow values/variables in your script to be edited from the Inspector, you must add them as `properties` in your script.

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    properties: {
        myNumber: 0,
        myNode: {
            default: null,
            type: Fire.Node
        }
    }
});
module.exports = MyClass;
```

In the above example, we defined two properties with different format.

- If your property is a [primitive value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values), just write the default value that follows colon.
- If your property is a [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects), you need to explicitly define its default value and type. In the type field you can also write class defined with game engine API.

Once this is done, your properties will be serialized and shown in Inspector. From here on you can edit them in Inspector, no need for changing the code if you just want value or reference to be updated.

In your script, you can access your properties with `this.myNumber`, `this.myNode`. For detailed script access information, read the next chapter [Access Scripts]().

## Add Functions

To add a function:

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    properties: {
        // some properties
    },
    myFunction: function() {
        Fire.log('hellow world!');
    }
});
module.exports = MyClass;
```

Similar to properties, call a function in script with `this.myFunction()`.

## Constructor

If you want to declare variables that not exposed to Inspector, or run any initialization code when the class is created, put your code in `constructor` function:

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    constructor: function() {
        this.myVariable = 1;
    }
});
module.exports = MyClass;
```

Event if `this.myVariable` is not shown in Inspector. It's still accessible via other scripts. Again, more details can be found at [Access Scripts]().

## Update

`update` is another function that will be called by lifecycle control.

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    properties: {
        myCounter: 0
    }
    update: function() {
        this.myCounter++;
        Fire.log(this.myCounter);
    }
});
module.exports = MyClass;
```

`update` function will be called every frame by game engine. For different game engine the exact timing of `update` in program lifecycle may differ. Usually it's before rendering happens for each frame.

The above example will increase `this.myCounter` by one each frame, and log the value to Fireball console view.

## Game Engine API

In your FireClass script, you can use any game engine API, including creating a class instance defined in a pure game engine script.

Let's take Cocos2d-js engine API for example. If we'd like to create a sprite and add it to scene in script, we have to rely on Cocos2d-js API:
```js
var MyClass = Fire.Class({
    createMySprite: function() {
        // for the simplicity of this example, we create a sprite with file path
        // there are several ways to reference a resource in Fireball script  
        // you will learn them later
        var mySprite = cc.Sprite.create('mySprite.png');
        var myLayer = cc.Layer.create(); // create a layer
        var myLayer.addChild(mySprite); // add sprite to layer
        cc.Director.getRunningScene().addChild(myLayer); // add layer to current scene.
    }
});
module.exports = MyClass;
```

Don't worry if you're not Cocos2d-js user, the only thing that matters is you can use your favorite engine's API in FireClass. Also you're responsible for codes that build hierarchy changes if you are adding/removing nodes in script.

You can see exactly what you should do for a specific engine:

- [Cocos2d-js](runtimes/cocos2d-js.md)
- Pixi (coming soon)
- Phaser (coming soon)

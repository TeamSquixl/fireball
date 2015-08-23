---
title: Behavior 
category: manual
permalinks: manual/scripting/attachable-script
---

What's the point of a scene editor if we can't attach scripts to scene nodes and give them behaviors that we can combine and tweak in Inspector? Fireball's great advantage is to allow you write script that can be attached to scene nodes, while you can still call any engine API from the script! Let's work it out.

## Behavior (Attachable Script)

An attachable script must contain definition of a `Behavior`. The filename of the script is the class name. For example a script named `MyClass.js` creates a `Behavior` named `MyClass`.

(screenshot)

Once the script is attached to a node, the class name will be used for identifying this modular script in Inspector.

(screenshot)

The whole process is similar to how you write component script for an entity-component system but behind the scene they are quite different.

Behavior is one of the most usual **FireClass**. For details and advanced usage of FireClass, please refer to the [FireClass](/manual/scripting/class).

### Shared Instance of Behavior

Fireball use mixin to combine all scripts attached to a single node together. Thus for all of the scripts that attached to the same node, their instance (`this`) point to the same node.

Compare to other entity-component system, Fireball don't have 'component' instance and 'entity' instance. There is only the node instance, with all properties and method available from scripts attached to the node.

To learn more about how script mixin works in Fireball, see [Mixin Mechanics](mixin-mechanic.md).

## Basic Structure of an Attachable Script

Create a script file that follow this pattern:

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    extends: Fire.Behavior, // must have, every FireClass inherit from Fire.Behavior
    properties: {
        // properties that you want to serialize and exposed in Inspector
    },
    statics: {
        // you can export variables and functions declared outside of FireClass prototype object in this script
    },
    onLoad: {
        // initialization code
    }
});
```

The name `MyClass` in the script is not relevant, only the **filename of the script** is used for identifying this FireClass. Thus it's not allowed to create scripts with the same name in a single project.

As long as your script contains a Behavior definition, it can be dragged and attached onto a node. Let's keep going to see how to add property and function to your script.

## Add Properties

To allow values/variables in your script to be edited from the Inspector, you must add them as `properties` in your script.

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    extends: Fire.Behavior,
    properties: {
        myNumber: 0,
        myNode: {
            default: null,
            wrapper: cc.Node
        }
    }
});
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
    extends: Fire.Behavior,
    properties: {
        // some properties
    },
    myFunction: function() {
        Fire.log('hellow world!');
    }
});
```

Similar to properties, call a function in script with `this.myFunction()`.

## Initialization

If you want to declare variables that not exposed to Inspector, or run any initialization code when the class is created, put your code in `onLoad` function:

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    extends: Fire.Behavior,
    onLoad: function() {
        this.myVariable = 1;
    }
});
```

Event if `this.myVariable` is not shown in Inspector. It's still accessible via other scripts. Again, more details can be found at [Access Scripts](access-script.md).

## Update

`update` is another function that will be called by lifecycle control.

```js
var MyClass = Fire.Class({ // use Fire.Class to define your class
    extends: Fire.Behavior,
    properties: {
        myCounter: 0
    }
    update: function() {
        this.myCounter++;
        Fire.log(this.myCounter);
    }
});
```

`update` function will be called every frame by game engine. For different game engine the exact timing of `update` in program lifecycle may differ. Usually it's before rendering happens for each frame.

The above example will increase `this.myCounter` by one each frame, and log the value to Fireball console view.

## Game Engine API

In your FireClass script, you can use any game engine API, including creating a class instance defined in a pure game engine script.

Let's take Cocos2d-js engine API for example. If we'd like to set position for the current node. We have to rely on Cocos2d-js API:
```js
var MyClass = Fire.Class({
    extends: Fire.Behavior,
    properties: {
        targetPosX: 0,
        targetPosY: 0
    }
    changePosition: function() {
        // call cc.Node.setPosition(x,y) to change node position
        this.setPosition(this.targetPosX, this.targetPosY);
    }
});
```

Don't worry if you're not Cocos2d-js user, the only thing that matters is you can use your favorite engine's API in FireClass.

You can see exactly what you should do for writing script for a specific engine:

- [Cocos2d-js](runtimes/cocos2d-js.md)
- Pixi (coming soon)
- Phaser (coming soon)

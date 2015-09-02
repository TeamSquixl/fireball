---
title: Advanced FireClass
categories: manual
permalinks: manual/scripting/class
---

> All "Note" section is advanced learning material, beginner can safely skip those parts.

`Fire.Class` can define classes with Fireball specific features. To make things clear, we call it **FireClass** if a class is defined by `Fire.Class`. **FireClass** can be extended very easily, and able to define type-rich data.

## Overview

### Create FireClass

To define a FireClass, you need to call `Fire.Class` with a prototype object as parameter. Add properties according to a certain key-value pair pattern to the prototype object to customize your class.

```js
    var Sprite = Fire.Class({
        name: 'Sprite'
    });
```

The above code snippet created a FireClass and assigned it to `Sprite` variable. The variable name has nothing to do with class name. You can add a `name` property as class name, it only matters when you need the class to be serialized.

To make writing easier, we call this Fireball specific `{ name: 'Sprite' }` pattern of defining class **prototype object**. The following sections will focus on how to create and do scripting in this prototype object.

### Create Class Instance

FireClass is a JavaScript prototype, so you can create class instance with `new` keyword.

```js
    var obj = new Sprite();
```

### Constructor

If you add a `constructor` property in prototype object, the function will be called during the instantiation of the FireClass. FireClass does not allow parameter for constructor.

```js
    var Sprite = Fire.Class({
        constructor: function () {
            console.log(this instanceof Sprite);    // true
        }
    });
    var obj = new Sprite();
```

**Note**: Behavior is a special kind of FireClass, you cannot add `constructor` to Behavior's prototype object, but you can use `onLoad` for initialization.

### Test Class Prototype

`instanceof` can be used for testing if an object uses the FireClass prototype.

```js
    console.log(obj instanceof Sprite);     // true
```

**Note**

- If your class doesn't need serialization, you can safely omit `name` property. Class name can be any string but there should not have classes with the same name in one project. You can use `Fire.getClassName` to get class name, use `Fire.getClassByName` to use name to find class.
- If advanced developer need to use constructor with parameter, you can use `arguments` inside `constructor` to get parameters. But if this class need to be serialized, you must make sure the class can be instantiated with `new` keyword without any constructor parameter.

## Members

### Instance Variable

Instance variables should be declared in constructor:

```js
    var Sprite = Fire.Class({
        constructor: function () {
            // declare instance variable and gives default value
            this.url = "";
            this.id = 0;
        }
    });
    var obj = new Sprite();
    // assign value
    obj.url = 'img/fb.png';
    obj.id = 1;
```

### Instance Method

Instance methods defined as prototype object's properties:

```js
    var Sprite = Fire.Class({
        constructor: function () {
            // ...
        },
        // declare an instance method named "load"
        load: function () {
            // load this.url
        };
    });
    var obj = new Sprite();
    // call instance method
    obj.load();
```

### Static Class Variable and Method

Static class variable and class method can be added to class outside of prototype object:

```js
    var Sprite = Fire.Class({ ... });

    // declare class variable
    Sprite.count = 0;
    // declare class method
    Sprite.getBounds = function (spriteList) {
        // ...
    };
```

You can also declare them in `statics` property of prototype object:

```js
    var Sprite = Fire.Class({
        statics: {
            // declare class variable
            count: 0,
            // declare class method
            getBounds: function (spriteList) {
                // ...
            }
        }
    });
```

**A Full FireClass definition script:**

```js
    var Sprite = Fire.Class({
        name: 'Sprite',
        constructor: function () {
            // instance variables
            this.url = "";
            this.id = 0;
        },
        // instance method named `load`
        load: function () {
            // load this.url
        };
    });
    // class instantiation
    var obj = new Sprite();
    // access instance variable
    obj.url = 'sprite.png';
    // call instance method
    obj.load();

    // declare static class variable
    Sprite.count = 0;
    // declare static class method
    Sprite.getBounds = function (spriteList) {
        // ...
    };

    // call static class method
    Sprite.getBounds([obj]);
```

**Note**

- For **private** member that should not be accessible from outside, it's recommended to add `_` prefix to the member name.

    ```js
    var Sprite = Fire.Class({
        name: 'Sprite',
        constructor: function () {
            // private instance variable
            this._myData = 0;
        },
        // private instance method
        _load: function () {
            // ...
        };
    });
    // private static class variable
    Sprite._list = [];
    ```

- For **private** static member, you can also use closure

    ```js
    // private static method
    var doLoad = function (sprite) {
        // do load ...
    };
    // private static variable
    var url = 'foo.png';

    var Sprite = Fire.Class({
        load: function () {
            // call method with local scope
            doLoad(this, url);
        };
    });
    ```

- The concept *instance member* here includes instance variable and instance method.
- The concept *static member* here includes static variable and static method.
- To inherit a static variable, you should **shallow copy** the variable to the child class.

## Inheritance

### How to

To inherit a class, put the class type to prototype object's `extends` property:

```js
    // define base class
    var Node = Fire.Class();

    // define sub class
    var Sprite = Fire.Class({
        extends: Node
    });

    // test
    var obj = new Sprite();
```

`instanceof` can be used to detect if an object are created with a class inherits from a certain parent class:

```js
    var sub = new Sprite();
    console.log(sub instanceof Node);       // true
    var base = new Node();
    console.log(base instanceof Sprite);    // false
```

### Parent Class Constructor

You should notice that no matter if child class has constructor, the parent's constructor will be called before the child is instantiated.

```js
    var Node = Fire.Class({
        constructor: function () {
            this.name = "node";
        }
    });
    var Sprite = Fire.Class({
        extends: Node,
        constructor: function () {
            // before this code is executed, parent's constructor is already called
            // so this.name is defined.
            console.log(this.name);    // "node"
            // assign another value to this.name
            this.name = "sprite";
        }
    });
    var obj = new Sprite();
    console.log(obj.name);    // "sprite"
```

### Override

All instance method are considered virtual, so you can override any method in child class:

```js
    var Node = Fire.Class({
        getName: function () {
            return "node";
        }
    });
    var Sprite = Fire.Class({
        getName: function () {
            return "sprite";
        }
    });
    var obj = new Sprite();
    console.log(obj.getName());    // "sprite"
```

If you want to access parent method from child, you should use `call` or `apply` on parent's prototype:

```js
    var Node = Fire.Class({
        getName: function () {
            return "node";
        }
    });
    var Sprite = Fire.Class({
        getName: function () {
            var baseName = Node.prototype.getName.call(this);
            return baseName + ">sprite";
        }
    });
    var obj = new Sprite();
    console.log(obj.getName());    // "node>sprite"
```

Use `Fire.isChildClassOf` to detect if there are inheritance between two classes:

```js
    var Texture = Fire.Class();
    var Texture2D = Fire.Class({
        extends: Texture
    });
    console.log(Fire.isChildClassOf(Texture2D, Texture));   // true
```

Please note parameter of `Fire.isChildClassOf` should all be class constructor, not class instance. If you pass two identical classes it will return `true` as well.

**Note**

- You can access parent class with static member `$super` from child class.
- All instance members and static members will be inherited by child class.
- If you prefer vanilla JavaScript type of inheritance, in other words your parent and child are not both FireClass. You can use [Fire.JS.extend](http://docs.fireball-x.com/api/modules/Fire.JS.html#method_extend) for that.

## Properties

### <a name="default"></a>Define and Access Properties

Properties are special type of instance variable that you can see and edit them in **Inspector**. They can be serialized as well. To define properties, add key-object pair under prototype object's `properties` key.

Let's add a property named `playerName` in `Player` class.

```js
    var Player = Fire.Class({
        extends: Fire.Behavior,

        properties: {
            playerName: {
                default: 'Jare'
            }
        }
    });
```

This way `playerName` will be shown in **Inspector**, and it's value will be saved together with current scene.

The `default` key is used to give property a default value. For value types a default value also tells Fireball the type of property. Default value is only used when class is instantiated for the first time. In other words, for serialized properties, change default value in class script does not affect class instance in scene (which is already saved), unless you remove the class instance and recreate it.

Properties themselves are instance members, that can be accessed easily:

```js
    var Sprite = Fire.Class({
        constructor: function () {
            console.log(this.width);    // access width
        },

        properties: {
            width: {
                default: 128
            },
        },

        getWidth: function () {
            return this.width;
        }
    });
```

Properties are defined before constructor function is called, so they can be accessed or has value changed in constructor function.

### Property Attributes

Each property can have multiple attributes, to customize the way property is shown in **Inspector** and how its serialized.

```js
    properties {
        score: {
            default: 0,
            type: Fire.Integer,
            tooltip: 'The score of player'
        }
    }
```

The above code make sure you can only input integer value for `score` in **Inspector**. Also when move your mouse over the property it should display tooltip.

Below are common attributes, for more details please read [Property Attributes](/manual/scripting/attributes).

- type: define data type of the property
- url: define asset type of property (asset accessed with url).
- visible: set it to `false` to hide the property in **Inspector**.
- serializable: set it to `false` will make the property non-serializabe.
- displayName: show different name in **Inspector**
- tooltip: mouse over tooltip in **Inspector**

#### <a name="visible"></a>Visible Attribute

By default, if a property is shown in **Inspector** depends on if the property name starts with `_`. All properties with `_` prefix are hidden in **Inspector**.

To enforce showing these properties in  **Inspector**, you can set `visible` attribute to `true`:

```js
    properties {
        _id: {      //
            default: 0,
            visible: true // force showing property despite `_` prefix
        }
    }
```

To force hiding a property, you can set `visible` attribute to `false`:

```js
    properties {
        id: {       // force hiding property
            default: 0,
            visible: false
        }
    }
```

#### <a name="serializable"></a>Serializable Attribute

All properties by default are serializable, you can set `serializable: false` if you like otherwise.

```js
    temp_url: {
        default: '',
        serializable: false
    }
```

#### <a name="type"></a>Type Attribute

If `default` attribute alone cannot provide enough details about type information, we need to use `type` explicitly declare property type in order to correctly display and edit the property:

- For reference data type, usually the default value is `null`. We need to set a specific type so `Inspector` knows how to create an instance and edit the property:

    ```js
        enemy: {
            default: null,
            type: cc.Node
        }
    ```
- For primary value type (such as Number), set `type` to `Fire.Integer` to constrain property value to integer. This way user will not be able to input decimal point in **Inspector**:

    ```js
        score: {
            default: 0,
            type: Fire.Integer
        }
    ```
- Set `type` to a enum type (can be defined with [Fire.defineEnum](http://docs.fireball-x.com/api/modules/Fire.html#method_defineEnum)), you'll be able to select value from a drop down list in **Inspector**.

    ```js
        wrap: {
            default: Fire.Texture.WrapMode.Clamp,
            type: Fire.Texture.WrapMode
        }
    ```
- If `default` is set to an empty array (`[]`), you need to use `type` to represent each element's data type in order to show and edit property in **Inspector** properly.

    ```js
        nameList: {
            default: [],
            type: [Fire.String]     // this make sure each array element's type is `Fire.String`
        },
        enemyList: {
            default: [],
            type: [cc.Node]
        }
    ```

#### <a name="url"></a>Url Attribute

Some properties are used for referencing asset url. You need to use `url` key to define property type so you can drag the asset you want to **Inspector** and serialize it.

```js
    texture: {
        default: "",
        url: Fire.Texture
    },
```

**Note**

- Properties will be inherited by child class, but you can't override parent's properties.
- If a property's default value need to be fetched or calculated, you can assign its value in `constructor` function.

    ```js
    var Sprite = Fire.Class({
        constructor: function () {
            this.img = LoadImage();
        },
        properties: {
            img: null
        }
    });
    ```

## GetSet Method

You can add `get` or `set` method in a property. This way `get` or `set` method will be called whenever the property is accessed.

### get

To add a `get` method:

```js
    properties: {
        width: {
            get: function () {
                return this.__width;
            }
        }
    }
```

`get` method can return any type of value.
This property will be shown in **Inspector**, and can be accessed from anywhere.

```js
    var Sprite = Fire.Class({
        constructor: function () {
            this.__width = 128;
            console.log(this.width);    // 128
        },
        properties: {
            width: {
                get: function () {
                    return this.__width;
                }
            }
        }
    });
```

**Note**:

- A property with `get` method cannot be serialized, and cannot have default value. But you can add any attribute to it except `default` and `serializable`.

    ```js
        width: {
            get: function () {
                return this.__width;
            },
            type: Fire.Integer,
            tooltip: "The width of sprite"
        }
    ```

- A property with `get` method is read-only, but the returned object or value is not. You can still modify internal object in your script.

    ```js
    var Sprite = Fire.Class({
        ...
        position: {
            get: function () {
                return this.__position;
            },
        }
        ...
    });
    var obj = new Sprite();
    obj.position = new Fire.Vec2(10, 20);   // WRONG! position is read-only
    obj.position.x = 100;                   // ALLOWED! position object can be modified!
    ```

### set

To add a `set` method:

```js
    width: {
        set: function (value) {
            this.__width = value;
        }
    }
```

`set` method can have a parameter with any type.

`set` can be used together with `get`:

```js
    width: {
        get: function () {
            return this.__width;
        },
        set: function (value) {
            this.__width = value;
        },
        type: Fire.Integer,
        tooltip: "The width of sprite"
    }
```

**Note**:
- If not defined together with a `get` method, you cannot pass parameter to `set` method.
- You can't serialize a property if it has a `set` method.

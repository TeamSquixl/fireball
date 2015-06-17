export ORIGINAL_PATH=`pwd`

# check if we have builtin
if [ ! -d "builtin" ]; then
    mkdir builtin
fi
cd builtin

# builtin debugger
if [ ! -d "console" ]; then
    git clone https://github.com/fireball-packages/console
fi

if [ ! -d "ipc-debugger" ]; then
    git clone https://github.com/fireball-packages/ipc-debugger
fi

if [ ! -d "package-manager" ]; then
    git clone https://github.com/fireball-packages/package-manager
fi

if [ ! -d "tester" ]; then
    git clone https://github.com/fireball-packages/tester
fi

# builtin widgets
if [ ! -d "ui-kit" ]; then
    git clone https://github.com/fireball-packages/ui-kit
fi

if [ ! -d "pixi-grid" ]; then
    git clone https://github.com/fireball-packages/pixi-grid
fi

# builtin panels
if [ ! -d "assets" ]; then
    git clone https://github.com/fireball-packages/assets
fi

if [ ! -d "hierarchy" ]; then
    git clone https://github.com/fireball-packages/hierarchy
fi

if [ ! -d "inspector" ]; then
    git clone https://github.com/fireball-packages/inspector
fi

if [ ! -d "scene" ]; then
    git clone https://github.com/fireball-packages/scene
fi

if [ ! -d "timeline" ]; then
    git clone https://github.com/fireball-packages/timeline
fi

cd ${ORIGINAL_PATH}

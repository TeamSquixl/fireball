export ORIGINAL_PATH=`pwd`

# check if we have builtin
if [ ! -d "builtin" ]; then
    mkdir builtin
fi
cd builtin

# builtin dev helper

if [ ! -d "asset-db-debugger" ]; then
    git clone https://github.com/fireball-packages/asset-db-debugger
fi

if [ ! -d "console" ]; then
    git clone https://github.com/fireball-packages/console
fi

if [ ! -d "ipc-debugger" ]; then
    git clone https://github.com/fireball-packages/ipc-debugger
fi

if [ ! -d "package-manager" ]; then
    git clone https://github.com/fireball-packages/package-manager
fi

if [ ! -d "release-helper" ]; then
    git clone https://github.com/fireball-packages/release-helper
fi

if [ ! -d "tester" ]; then
    git clone https://github.com/fireball-packages/tester
fi

# builtin widgets
if [ ! -d "ui-gizmos" ]; then
    git clone https://github.com/fireball-packages/ui-gizmos
fi

if [ ! -d "ui-grid" ]; then
    git clone https://github.com/fireball-packages/ui-grid
fi

if [ ! -d "ui-kit" ]; then
    git clone https://github.com/fireball-packages/ui-kit
fi

if [ ! -d "ui-property" ]; then
    git clone https://github.com/fireball-packages/ui-property
fi

if [ ! -d "ui-tree" ]; then
    git clone https://github.com/fireball-packages/ui-tree
fi

if [ ! -d "fire-ui-kit" ]; then
    git clone https://github.com/fireball-packages/fire-ui-kit
fi

if [ ! -d "color-picker" ]; then
    git clone https://github.com/fireball-packages/color-picker
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

if [ ! -d "builder" ]; then
    git clone https://github.com/fireball-packages/builder
fi

if [ ! -d "code-editor" ]; then
    git clone https://github.com/fireball-packages/code-editor
fi

# builtin assets

if [ ! -d "canvas-assets" ]; then
    git clone https://github.com/fireball-packages/canvas-assets
fi

cd ${ORIGINAL_PATH}

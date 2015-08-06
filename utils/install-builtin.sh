export ORIGINAL_PATH=`pwd`

# check if we have builtin
if [ ! -d "builtin" ]; then
    mkdir builtin
fi
cd builtin

repos=( \
asset-db-debugger \
assets \
builder \
code-editor \
color-picker \
console \
fire-assets \
fire-gizmos \
fire-ui-kit \
hierarchy \
inspector \
ipc-debugger \
package-manager \
release-helper \
scene \
tester \
timeline \
ui-grid \
ui-kit \
ui-property \
ui-tree \
)

for name in "${repos[@]}"
do
    if [ ! -d "${name}" ]; then
        git clone https://github.com/fireball-packages/${name}
    fi
done

cd ${ORIGINAL_PATH}

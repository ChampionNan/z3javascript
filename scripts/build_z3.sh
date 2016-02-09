#!/bin/bash -e
./emsdk_portable/emsdk activate latest
source ./emsdk_portable/emsdk_env.sh

cd z3

if [ -e build ]; then
    rm -rf ./build/
fi

alias c++=em++
alias g++=em++
alias ar=emar
alias cc=emcc
alias gcc=emcc
alias clang=emcc
alias clang++=em++
alias cmake=emcmake
alias configure=emconfigure
alias ranlib=emranlib

export CC=em
export CXX=em++
export AR=emar
export RANLIB=emranlib

#TODO: Why the hell does this fix the Mac Build
export PATH=`echo $PATH | sed -e 's/:\/opt\/local\/bin:\/opt\/local\/sbin//'`

python scripts/mk_make.py --x86 --githash=$(git rev-parse HEAD) --staticlib
cd build
sed -i.bak -e 's/EXE_EXT=/EXE_EXT=.emscripten.js/g' config.mk
sed -i.bak -e 's/-m32/-m64/g' config.mk
sed -i.bak -e 's/^\(CXXFLAGS=.*\)/\1 -fPIC -std=c++03 /g' config.mk
sed -i.bak -e 's/^\(CXXFLAGS=.*\)/\1 INSERTEXPORTHERE/g' config.mk
sed -i.bak -e 's/^\(LINK_EXTRA_FLAGS=.*\)/\1 -O3 -std=c++03 -fPIC INSERTEXPORTHERE/g' config.mk
sed -i.bak -e 's/O3/O3/g' config.mk
sed -i.bak -e "s/INSERTEXPORTHERE/-s EXPORTED_FUNCTIONS=\"[$(cat ../../compiled/z3_bindings_flat)]\"/g" config.mk
emmake make -j 8
cp z3.emscripten.js* ../../compiled/
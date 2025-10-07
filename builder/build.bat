xcopy "../src" "./out" /s
call tsc
py removeTsFiles.py
uglifyjs-folder "./out/BP/scripts" --output "./out/BP/scripts" --each --extension ".js"
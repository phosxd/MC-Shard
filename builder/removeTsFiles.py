import os
dir = r'./out/BP/scripts'

# Recursively remove TypeScript files.
def bleh(dir):
    for path, folders, files in os.walk(dir):
        for filename in files:
            if filename.endswith('.ts') == False:
                continue
            os.remove(dir+'/'+filename)
        for subdir in folders:
            bleh(dir+'/'+subdir)

print('Removing leftover TypeScript files...')
bleh(dir)
print('Done.')

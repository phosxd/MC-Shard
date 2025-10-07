These are instruction for compiling `src` on your own machine, the resulting files should be identical to the latest release of this version.

All this does is convert the TypeScript files into JavaScript then use UglifyJS to compress them for better performance & size.

# Prerequisites:
- [TypeScript](https://www.typescriptlang.org/download/)
- [UglifyJS (Folder)](https://github.com/mihai-vlc/uglifyjs-folder)
- [Python](https://python.org)

# Steps:
1. Open your Windows Command Terminal inside of the `builder` directory.
2. Run `build.bat`.
3. Click `d` when it prompts you to specify file or directory.
4. Once all processes have finished, navigate to the `out` folder to find the finished `BP` & `RP` packs.

To make a `.mcaddon` file, ZIP the resulting `BP` & `RP` folders together & replace the `.zip` extension with `.mcaddon`.
IMPORTANT: Do not ZIP the folder containing the `BP` & `RP`.

# cacophony-of-pixels
A nice screensaver that fills your screen with pixelated junk in an animated fashion! (Made for the [#screensaverjam](https://itch.io/jam/screensaverjam), 2016.)

[Check it out in your browser!](http://madve2.github.io/cacophony-of-pixels/)
Press F11 for the best experience (and try to ignore your CPU fans crying for help)!

# How do I actually use it as a screensaver?

- Download this nice and trustworthy ZIP file (LINK COMING SOON)
- Right-click ```cacophony-of-pixels.scr```, select Install
- Windows' Screen Saver dialog should open, letting you test the thing and actually set it as a screensaver (I wouldn't recommend that though). I didn't implement the mini-preview that would be displayed inside that nice CRT monitor image, sorry.

# How do I "build" this from source?

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:
```bash
# Clone this repository
git clone https://github.com/madve2/cacophony-of-pixels
# Go into the repository
cd cacophony-of-pixels
# Install dependencies - you'll need them both globally and locally
# (I know, I know, I should manage my dependencies properly; maybe I'll do next week)
npm install -g electron-prebuilt
npm install electron-prebuilt
# Run the screensaver!
electron main.js /s
```

To make it work as a screensaver:

1. Copy everything from ```%APPDATA%\npm\node_modules\electron-prebuilt\dist```
2. Create a folder called "app" in the "resources" folder, and copy your app files (including main.js and package.json) to it.
3. Rename "electron.exe" to "cacophony-of-pixels*.scr*", to turn it into a screensaver.
4. Done!

There are some nice electron packagers if you'd prefer that over these manual steps, but I didn't have the time to experiment with those before the jam.
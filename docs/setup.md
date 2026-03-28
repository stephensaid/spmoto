# SP Motor Kiosk — Setup Guide

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- Google Chrome installed

---

## First-Time Setup

1. Run `launch-kiosk.bat` by double-clicking it
2. In the Chrome window that opens, navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `kiosk-extension` folder inside the project directory
6. Close Chrome

That's it. The extension is now permanently installed in the kiosk profile.

---

## Daily Use

Just double-click `launch-kiosk.bat`. Chrome will open with the extension already loaded and the kiosk will be ready to use.

> **Important:** Do not delete the `chrome-profile` folder. It stores the installed extension. If it is deleted, you will need to repeat the First-Time Setup steps above.

---

## Re-enabling Kiosk Mode

Once everything is confirmed working, open `launch-kiosk.bat` in a text editor and add `--kiosk` back to the Chrome flags line. This hides the browser chrome (address bar, tabs) for a full-screen kiosk experience.

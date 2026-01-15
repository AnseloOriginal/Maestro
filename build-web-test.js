const fs = require('fs-extra');
const path = require('path');

// Paths
const webbuild = path.join(__dirname, 'capacitortest');
const srcFolder = path.join(__dirname, 'src');
const nodelessFolder = path.join(__dirname, 'nodeless');

// Step 1: remove old webbuild
fs.removeSync(webbuild);

// Step 2: create webbuild/src
fs.mkdirpSync(path.join(webbuild, 'src'));

// Step 3: copy src folder into webbuild/src
fs.copySync(srcFolder, path.join(webbuild, 'src'));

// Step 4: copy nodeless folder into webbuild/src/nodeless
fs.copySync(nodelessFolder, path.join(webbuild, 'src', 'nodeless'));

// --- Replac/Place specific files ---
const replacements = [
  {
    src: path.join(__dirname, 'modules', 'api.js'),
    dest: path.join(webbuild, 'src', 'nodeless', 'modules', 'api.js')
  },
  {
    src: path.join(__dirname, 'andriod_modules', 'downloader.js'),
    dest: path.join(webbuild, 'src', 'nodeless', 'modules', 'downloader.js')
  },
  {
    src: path.join(__dirname, 'andriod_modules', 'filesystem.js'),
    dest: path.join(webbuild, 'src', 'nodeless', 'modules', 'filesystem.js')
  },
  {
    src: path.join(__dirname, 'andriod_modules', 'testing', 'core'),
    dest: path.join(webbuild, 'src', 'core')
  },
  {
    src: path.join(__dirname, 'andriod_modules', 'testing', 'fs'),
    dest: path.join(webbuild, 'src', 'fs')
  },
  {
    src: path.join(__dirname, 'andriod_modules', 'testing', 'synapse'),
    dest: path.join(webbuild, 'src', 'synapse')
  },
  {
    src: path.join(__dirname, 'andriod_modules', 'testing', 'index.html'),
    dest: path.join(webbuild, 'src', 'index.html')
  },
];

replacements.forEach(file => {
  if (fs.existsSync(file.src)) {
    fs.copySync(file.src, file.dest, { overwrite: true });
    console.log(`Replaced file: ${file.dest}`);
  } else {
    console.warn(`File not found to replace: ${file.src}`);
  }
});

console.log('Capacitor Testing Web build ready in Capacitor/src');

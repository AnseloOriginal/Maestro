const { expect } = require("chai");
// const {arrayBufferToBase64, base64ToArrayBuffer} = require("../andriod_modules/filemanager.js");
// const { readBlobAsBase64 } = require("@capacitor/core/types/core-plugins.js");
const { readFileSync } = require("fs");

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

const raw = readFileSync("testing.aba")

const sol = arrayBufferToBase64(raw.buffer)
const solraw = base64ToArrayBuffer(sol)

Un
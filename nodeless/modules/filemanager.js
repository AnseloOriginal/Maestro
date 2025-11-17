import * as WebFS from "./web-fs.js"

export async function init() {
  if (await WebFS.createFileSytem()) {
    await WebFS.createFolder(false,"notes")
    await WebFS.createFolder(true,"temp")
  }
  //console.log("Results", await WebFS.createFile("notes"))
}

export async function notes() {
  const files = await WebFS.filesInFolderInformation("notes")
  if (files) {
    const filelist = []
    files.forEach(file => filelist.push(file.name))
    return filelist
  } else {
    return []
  }
}

export async function getFileContent(filename) {
  const file = await WebFS.filesInFolderInformation("notes",filename)
  if (file[0]) {
    return file[0].content
  } else {
    return false
  }
}

export async function decrypt(arrayBuffer, password) {
  const data = new Uint8Array(arrayBuffer);

  // 1. IV (16 bytes)
  const iv = data.slice(0, 16);

  // 2. Meta length (4 bytes, big-endian)
  const metaLength =
    (data[16] << 24) |
    (data[17] << 16) |
    (data[18] << 8) |
    data[19];

  // 3. Meta JSON
  const metaStart = 20;
  const metaEnd = metaStart + metaLength;
  const metaJson = new TextDecoder().decode(data.slice(metaStart, metaEnd));
  const meta = JSON.parse(metaJson);

  // 4. Encrypted content
  const encrypted = data.slice(metaEnd);

  // 5. Key (SHA256 hash of password)
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest(
    "SHA-256",
    enc.encode(password)
  );

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  // 6. Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    encrypted
  );

  return { decrypted, meta }; // decrypted is an ArrayBuffer
}
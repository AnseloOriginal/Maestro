// Instead of importing, use the global:
const { Filesystem } = Capacitor.Plugins;
const Directory = {
  Data: 'DATA',
  Documents: 'DOCUMENTS',
  Cache: 'CACHE',
  External: 'EXTERNAL',
  ExternalStorage: 'EXTERNAL_STORAGE'
};

export function dump(arrayBuffer) {
  const data = new Uint8Array(arrayBuffer);
  console.log("Hex Preview:", Array.from(data.slice(0, 32)).map(b => b.toString(16).padStart(2, '0')).join(' '));
  console.log("String Preview:", new TextDecoder().decode(data.slice(0, 32)));  
}

export function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

async function createFolder(name) {
  try {
    await Filesystem.mkdir({
      path: name,
      directory: Directory.Data,
      recursive: true, // This is the most important part!
    });
    console.log('Folder created successfully');
  } catch (e) {
    // If the folder already exists, it might throw an error. 
    // Usually, you can ignore it if it's an "already exists" error.
    console.warn(name + ' Folder might already exist', e);
  }
}
async function handeAbaPackOpen(data) {
  console.log('App opened with file:', data.url);
  if (data.url.endsWith('.abapack')) {
      const contents = await Filesystem.readFile({ 
        path: data.url,
        encoding: "utf8"
      });
    const object = JSON.parse(contents.data);
    for (const [filename, base64] of Object.entries(object)) {
      try {
        await Capacitor.Plugins.Filesystem.writeFile({
          path: `notes/${filename}`,
          data: base64,
          directory: Directory.Data,
          recursive: true
        });
      } catch (e) {
        console.log(`Failed to write file ${filename} when loading ${data.url}`,e)
      }
    }
  }
}

 export async function init() {
  createFolder("notes")
  createFolder("temp")
  createFolder("banks")
  Capacitor.Plugins.App.addListener('appUrlOpen', async (data) => {
    handeAbaPackOpen(data)
  });

  const checkInitialUrl = async () => {
    const launchUrl = await Capacitor.Plugins.App.getLaunchUrl();
    if (launchUrl) {
        await handeAbaPackOpen(launchUrl);
    } else {
      console.log("No URL to load")
    }
  };
  
  await checkInitialUrl();
  console.log("[FS] Successfully initialized filesystem")
}


async function filesNamesInDir(dir) {
  try {
    const result = await Filesystem.readdir({
      path: dir,
      directory: Directory.Data, // Use the same directory you used to save
    });

    // result.files is an array of objects. We map it to get just the names.
    const files = []
    result.files.forEach(file => {
      files.push(file.name)
    })
    return files
  } catch (error) {
    console.error('Error reading directory', error);
    return [];
  }
}

export async function notes() {
  const files = await filesNamesInDir("notes")
  console.log("[DEBUG FIles] ",files)
  return files
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
  
  console.log("Hex Preview:", Array.from(data.slice(0, 32)).map(b => b.toString(16).padStart(2, '0')).join(' '));
  console.log("String Preview:", new TextDecoder().decode(data.slice(0, 32)));  
  // 1. IV (16 bytes)
  const iv = data.slice(0, 16);

  // 2. Meta length (4 bytes, big-endian)
  const metaLength = (
    (data[16] << 24) |
    (data[17] << 16) |
    (data[18] << 8)  |
    (data[19])
  ) >>> 0;

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


//Given by Gemini AI at 11/1/26 due to time contrainsts
/**
 * @param {string} folder - The folder name (e.g., 'uploads')
 * @param {string} filename - The file name (e.g., 'photo.jpg')
 * @param {Blob} blob - The actual Blob object
 */
export async function createFile(folder, filename, base64Data) {
  // 1. Convert Blob to Base64 (The bridge requirement)
  // const base64Data = await new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64 part
  //   reader.onerror = (err) => reject(err);
  //   reader.readAsDataURL(blob);
  // });
  
  // const base64Data = arrayBufferToBase64(buffer)
  // // 2. Ensure folder exists (recursive: true makes this safe)
  try {
    await Filesystem.mkdir({
      path: folder,
      directory: Directory.Data,
      recursive: true
    });
  } catch {
    console.warn(`Create File] Creating ${folder} folder failed`)
  }

  // 3. Write the file
  
  return await Filesystem.writeFile({
    path: `${folder}/${filename}`,
    data: base64Data,
    directory: Directory.Data,
    recursive: true
    // Note: Do NOT use Encoding.UTF8 for base64/blobs
  });
};



/**
 * @param {string} currentPath - e.g., 'temp/file.txt'
 * @param {string} destinationPath - e.g., 'archive/file.txt'
 */
const GenMoveFile = async (currentPath, destinationPath) => {
  console.log(`Moving log: ${currentPath} to ${destinationPath}`)
  try {
    console.log(currentPath)
    // 2. Perform the move
    await Filesystem.rename({
      from: currentPath,
      to: destinationPath,
      directory: Directory.Data,
      // toDirectory is optional if it's the same, but safer to include
      toDirectory: Directory.Data 
    });
    
    console.log('File moved successfully');
    return true
  } catch (e) {
    console.error('Move failed', e, currentPath, destinationPath);
    return false
  }
};

//End of Gemini Code
export async function moveFile(source,dest,name) {
  const sourceName = source + "/" + name
  const destName = dest + "/" + name
  return await GenMoveFile(sourceName,destName)
}

export async function renameFile(source,oldname,newname) {
  const sourceName = source + "/" + oldname
  const newName = source + "/" + newname
  return await GenMoveFile(sourceName,newName)
}

export async function deleteFile(path,name) {
  const filePath = path + "/" + name
  try {
    await Filesystem.deleteFile({
      path: filePath,
      directory: Directory.Data,
    });
    console.log('File deleted');
    return true
  } catch (e) {
    // Throws an error if the file doesn't exist
    console.error('Error deleting file', e);
    return false
  }
};
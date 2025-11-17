import * as idb from "./idb.js"

const DB_VERSION = 1;
export async function createFileSytem(ret) {
  let finalresult = false
  await idb.openDB("ABAFS", DB_VERSION, {
    upgrade(db) {
      //const db = event.target.result
      try {
        db.createObjectStore("folders")//, { autoIncrement: true, keyPath: "name" });
        db.createObjectStore("files", { autoIncrement: true });
      } catch (error) {
        console.log("Something went wrong in DB Creation" + error)
      }
    },
  })
  .then((request) => {
    if (ret === "request") {
      finalresult = request
    } else {
      finalresult = true
    }
  }).catch((err) => {
    console.log("Error creating DB "+ err)
    finalresult = false
  });
  return finalresult
}

export async function createFolder(overwrite = false,...foldernames) {
  const request = await createFileSytem("request")
  if (request) {
    //const store = request.transaction("folders").objectStore("folders");
  
    foldernames.forEach(async (folder) => {
      if (!overwrite && await request.get("folders",folder)) {
        console.log( `Failed to create folder ${folder} due to Folder already exists`)
        return false
      }
      const foldermeta = {
        files: [],
        version: DB_VERSION
      }
      try {
        await request.put("folders",foldermeta,folder)
      } catch (err) {
        console.log( `Failed to create folder ${folder} due to ${err}`)
      }
    })
  } else {
    console.log("Failed to open DB at folder creation")
  }
}

export async function folderInformation(foldername) {
  const request = await createFileSytem("request")
  const info = await request.get("folders", foldername)
  return info
}

export async function filesInFolderInformation(foldername,namefilter="") {
  const request = await createFileSytem("request")
  const folder = await request.get("folders", foldername)
  if (folder) {
    const groupOfFiles = []
    for (let i=0;i<folder.files.length;i++) {
      const filename = folder.files[i];
      const fileObject = await request.get("files",filename)
      console.log(fileObject)
      //console.log("Got file object",fileObject,`Filename ${fileObject.name} Filter ${namefilter}`)
      if ((namefilter !== "" && namefilter === fileObject.name) || namefilter === "" ) {
        fileObject.filekey = filename
        groupOfFiles.push(fileObject)
      }
    }
    return groupOfFiles
  } else {
    return []
  }
}

export async function createFile(folder,filename,filecontent, metatable) {
  const folderinfo = await folderInformation(folder)
  if (!folderinfo) {
    console.log(`File ${filename} failed due to: Folder ${folder} does not exist`)
    return false
  }
  const db = await createFileSytem("request")
  const fileobject = {
    name: filename,
    version: DB_VERSION,
    conent: filecontent,
    meta: metatable
  }
  let keyname = crypto.randomUUID()
  try {
    await db.put("files",fileobject,keyname)
    folderinfo.files.push(keyname)
    await db.put("folders",folderinfo,folder)
    return keyname
  } catch (err) {
    console.log(`Error finalizing file ${filename} creation: `+err)
    return false
  }
}

export async function renameFile(folder,filename,newname) {
  const request = await createFileSytem("request")
  const file = await filesInFolderInformation(folder,filename)
  if (file[0]) {
     const filekey = file[0].filekey
     const newFileObject = {
      version: DB_VERSION,
      name: newname,
      content: file[0].conent,
      meta: file[0].meta
     }
     request.put("files",newFileObject,filekey)
     return true
  } else {
    return false
  }
}

export async function deleteFile(folder,filename) {
  const request = await createFileSytem("request")
  const file = await filesInFolderInformation(folder,filename)
  if (file[0]) {
     request.delete("files",file[0].filekey)
     return true
  } else {
    return false
  }
}

export async function moveFile(source,dest,filename) {
  if (source === dest) {
    //Same Source and Destination Folder
    return false
  }
  const request = await createFileSytem("request")
  const souceFolder = await folderInformation(source)
  const file = await filesInFolderInformation(source,filename)
  console.log("Moving ",file[0])
  if (file[0]) {
    const key = file[0].filekey
    const destFolder = await folderInformation(dest)
    console.log("Moving File",file,"Dest",destFolder,"Source",souceFolder)
    if (!destFolder) {
      //Destination does not exist
      return false
    }
    if (destFolder.files.includes(key)) {
      //File already exists
      return false
    }
    const index = souceFolder.files.indexOf(key)
    souceFolder.files.splice(index,1)
    destFolder.files.push(key)
    request.put("folders",destFolder,dest)
    request.put("folders",souceFolder,source)
    return true
  } else {
    return false
  }
}
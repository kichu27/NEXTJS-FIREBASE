"use client"
import { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "@/firebase/config";

export default function Page() {
  const storage = getStorage();
  const [uploadimg, setUploadimg] = useState(null);

  const handleclick = (e) => {
    if (uploadimg == null) {
      return;
    }
    const imageref = ref(storage, `images/${uploadimg.name + v4()}`);
    uploadBytes(imageref, uploadimg).then(() => {
      console.log("image uploaded!");
    });
  };

  return (
    <div>
      <h1>ADD AN IMAGE!</h1>
      <input type="file" onChange={(e) => { setUploadimg(e.target.files[0]); }} />
      <button onClick={handleclick}>Upload Image</button>
    </div>
  );
}

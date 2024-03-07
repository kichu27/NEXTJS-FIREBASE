"use client"
import { useState, useEffect, Suspense } from "react";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "@/firebase/config";
import NextImage from "next/image";

// Custom Suspense component for loading images
const SuspenseImage = ({ src, alt, height, width }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {loaded ? (
        <NextImage src={src} alt={alt} height={height} width={width} />
      ) : (
        <div  style={{ height: "300px" , width:"200px" , margin: "10px", border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)" }}>Loading...</div>
      )}
    </Suspense>
  );
};

export default function Page() {
  const storageRef = getStorage();
  const [uploadimg, setUploadimg] = useState(null);
  const [imglist, setImglist] = useState([]);

  const listImgRef = ref(storageRef, "/images");

  useEffect(() => {
    const fetchImageList = async () => {
      try {
        const res = await listAll(ref(storageRef, "/images"));

        const downloadURLs = await Promise.all(
          res.items.map(async (itemRef) => {
            return await getDownloadURL(itemRef);
          })
        );

        console.log(downloadURLs);

        setImglist(downloadURLs);
      } catch (error) {
        console.error("Error listing images: ", error);
      }
    };

    fetchImageList();
  }, []);

  const handleclick = (e) => {
    if (uploadimg == null) {
      return;
    }
    const imageref = ref(storageRef, `images/${uploadimg.name + v4()}`);

    uploadImage(imageref, uploadimg);
  };

  const uploadImage = async (imageref, uploadimg) => {
    try {
      await uploadBytes(imageref, uploadimg);
      window.alert("Image Added Successfully !")
      // After uploading, refresh the image list
      refreshImageList();
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const refreshImageList = async () => {
    try {
      const res = await listAll(ref(storageRef, "/images"));

      const downloadURLs = await Promise.all(
        res.items.map(async (itemRef) => {
          return await getDownloadURL(itemRef);
        })
      );

      console.log(downloadURLs);

      setImglist(downloadURLs);
    } catch (error) {
      console.error("Error refreshing image list: ", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f0f0f0", borderRadius: "10px" }}>
      <h1 style={{ marginBottom: "20px", color: "#333", textAlign: "center" }}>ADD AN IMAGE!</h1>
      <input type="file" style={{ marginBottom: "10px", display: "block", width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} onChange={(e) => setUploadimg(e.target.files[0])} />
      <button onClick={handleclick} style={{ margin: "10px auto", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", display: "block" }}>Upload Image</button>
      <div>
        <h2 style={{ marginTop: "20px", color: "#333" }}>Image List</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {imglist.map((imgUrl, index) => (
            <div key={index} style={{ margin: "10px", border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)" }}>
              <SuspenseImage src={imgUrl} alt={`Image ${index}`} height={400} width={300} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

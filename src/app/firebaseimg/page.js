"use client"
import { useState, useEffect, Suspense } from "react";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL, uploadBytesResumable } from "firebase/storage";
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
  const [uploadVideo, setUploadVideo] = useState(null);
  const [imglist, setImglist] = useState([]);
  const [videoList, setVideoList] = useState([]);

  const listImgRef = ref(storageRef, "/images");
  const listVideosRef = ref(storageRef, "/videos");

  useEffect(() => {
    const fetchImageList = async () => {
      try {
        const res = await listAll(listImgRef);

        const downloadURLs = await Promise.all(
          res.items.map(async (itemRef) => {
            return await getDownloadURL(itemRef);
          })
        );

        setImglist(downloadURLs);
      } catch (error) {
        console.error("Error listing images: ", error);
      }
    };

    fetchImageList();
  }, []);

  useEffect(() => {
    const fetchVideoList = async () => {
      try {
        const res = await listAll(listVideosRef);

        const downloadURLs = await Promise.all(
          res.items.map(async (itemRef) => {
            return await getDownloadURL(itemRef);
          })
        );

        setVideoList(downloadURLs);
      } catch (error) {
        console.error("Error listing videos: ", error);
      }
    };

    fetchVideoList();
  }, []);

  const handleImageUpload = () => {
    if (uploadimg == null) {
      return;
    }
    const imageRef = ref(storageRef, `images/${uploadimg.name + v4()}`);

    uploadFile(imageRef, uploadimg, refreshImageList);
  };

  const handleVideoUpload = () => {
    if (uploadVideo == null) {
      return;
    }
    const videoRef = ref(storageRef, `videos/${uploadVideo.name + v4()}`);

    uploadFile(videoRef, uploadVideo, refreshVideoList);

  };

  const uploadFile = async (fileRef, file, refreshList) => {
    try {
      await uploadBytes(fileRef, file);
      window.alert("File uploaded successfully!");
      refreshList();
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const refreshImageList = async () => {
    try {
      const res = await listAll(listImgRef);

      const downloadURLs = await Promise.all(
        res.items.map(async (itemRef) => {
          return await getDownloadURL(itemRef);
        })
      );

      setImglist(downloadURLs);
    } catch (error) {
      console.error("Error refreshing image list: ", error);
    }
  };

  const refreshVideoList = async () => {
    try {
      const res = await listAll(listVideosRef);

      const downloadURLs = await Promise.all(
        res.items.map(async (itemRef) => {
          return await getDownloadURL(itemRef);
        })
      );

      setVideoList(downloadURLs);
    } catch (error) {
      console.error("Error refreshing video list: ", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f0f0f0", borderRadius: "10px" }}>
      <h1 style={{ marginBottom: "20px", color: "#333", textAlign: "center" }}>UPLOAD AN IMAGE OR VIDEO!</h1>
      <input type="file" style={{ marginBottom: "10px", display: "block", width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} onChange={(e) => setUploadimg(e.target.files[0])} />
      <button onClick={handleImageUpload} style={{ margin: "10px auto", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", display: "block" }}>Upload Image</button>
      <input type="file" style={{ marginBottom: "10px", display: "block", width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} onChange={(e) => setUploadVideo(e.target.files[0])} />
      <button onClick={handleVideoUpload} style={{ margin: "10px auto", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", display: "block" }}>Upload Video</button>
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
      <div>
        <h2 style={{ marginTop: "20px", color: "#333" }}>Video List</h2>
        <div>
          {videoList.map((videoUrl, index) => (
            <div key={index}>
              <video controls autoPlay loop style={{ width: "300px", height: "auto" }}>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client"
  
import { useState } from 'react';
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";
  
export default function Home() {
  const [user, setUser] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  }

  async function addDataToFirestore(userData) {
    try {
      const docRef = await addDoc(collection(db, "messages"), userData);
      console.log(docRef);
      console.log("Document ID:", docRef.id);
      setSuccess(true);
    } catch (error) {
      console.error("Error adding document:", error);
      setError(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addDataToFirestore(user);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            name="message"
            value={user.message}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {success && <p>Data submitted successfully!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

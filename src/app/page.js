"use client";

import { useState } from 'react';
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function addDataToFirestore(name, email, message) {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        name: name,
        email: email,
        message: message,
      });
      console.log("Document ID:", docRef.id);
      setSuccess(true);
    } catch (error) {
      console.error("Error adding document:", error);
      setError(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addDataToFirestore(name, email, message);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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

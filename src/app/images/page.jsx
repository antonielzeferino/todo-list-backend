"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import nextlogo from "../../../public/vercel.svg"

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null); // Variável de estado para armazenar o arquivo
  const [images, setImages] = useState([]);

  // Função chamada quando o usuário escolhe um arquivo
  function handleFileChange(event) {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // 1. Obter assinatura e timestamp
    const signatureResponse = await fetch("/api/cloudinary-signature", {
      method: "POST",
    });
  
    const { timestamp, signature } = await signatureResponse.json();
    const formData = new FormData();
    formData.append("file", selectedFile); // Adiciona o arquivo selecionado ao FormData
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("upload_preset", "images"); // Preset configurado no Cloudinary

    // 2. Fazer o upload diretamente para o Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();
    // 3. Salvar a URL no banco de dados
    const dbResponse = await fetch("/api/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: cloudinaryData.secure_url }),
    });

    const newImage = await dbResponse.json();

    // Atualizar o estado com a nova imagem
    setImages((prev) => [...prev, newImage]);
  }

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch("/api/images");
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }

    fetchImages();
  }, []);

  return (
    <div>
      {/* Input para o usuário escolher o arquivo */}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>

      {/* Exibindo as imagens já carregadas */}
      <ul>
        {images.map((image, index) => (
          <li key={index}>
            <Image 
              src={image.url || nextlogo}
              alt="Uploaded" 
              width={300} 
              height={300}
            />
          </li>
        ))}
      </ul>
    </div>  
  );
}

export default UploadImage;

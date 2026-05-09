import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Apenas imagens JPG, PNG, WebP e GIF são permitidas");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB");
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/uploads/avatar`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const data = await response.json();
      return data.path as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAvatar, isUploading, error };
}

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { UploadCloud, X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageDropzoneProps {
  onImageSelect: (imageUrl: string) => void;
  onImageClear: () => void;
  currentImage?: string;
}

export function ImageDropzone({ onImageSelect, onImageClear, currentImage }: ImageDropzoneProps) {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setIsCompressing(true);
        await compressImage(file);
        setIsCompressing(false);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <UploadCloud className="h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            {isCompressing ? (
              "Compression de l'image..."
            ) : isDragActive ? (
              "Déposez l'image ici"
            ) : (
              <>
                <p>Glissez-déposez une image ici, ou cliquez pour sélectionner</p>
                <p className="text-xs text-gray-400">
                  (L'image sera automatiquement compressée à moins de 100 KB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {currentImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={onImageClear}
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={currentImage}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

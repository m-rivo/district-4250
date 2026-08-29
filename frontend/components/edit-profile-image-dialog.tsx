"use client";

import { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { PencilIcon, UploadIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateMemberProfilePictureAction } from "@/app/actions/member-actions";

interface EditProfileImageDialogProps {
  memberId: string;
  currentImage?: string;
}

export function EditProfileImageDialog({
  memberId,
  currentImage,
}: EditProfileImageDialogProps) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(currentImage ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(1);
  const [saving, setSaving] = useState(false);

  const editorRef = useRef<any | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (selectedFile.size > MAX_FILE_SIZE) {
      return;
    }

    if (image?.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }

    const imageUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setImage(imageUrl);
    setScale(1);
  };

  const handleSave = async () => {
    if (!editorRef.current || !memberId) return;

    try {
      setSaving(true);

      const canvas = editorRef.current.getImageScaledToCanvas();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9);
      });

      if (!blob) {
        throw new Error("No se pudo procesar la imagen");
      }

      const avatarFile = new File([blob], "profile-avatar.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();

      formData.append("profile_picture", avatarFile);

      const result = await updateMemberProfilePictureAction(memberId, formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setOpen(false);
    } catch (error) {
      console.error("Error al actualizar la foto de perfil:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Editar foto de perfil"
          >
            <PencilIcon />
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Foto de perfil</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6">
          {image && (
            <>
              <AvatarEditor
                ref={editorRef}
                image={image}
                width={300}
                height={300}
                border={30}
                borderRadius={150}
                scale={scale}
                rotate={0}
              />

              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Zoom</span>
                  <span>{scale.toFixed(1)}x</span>
                </div>

                <Slider
                  value={[scale]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => {
                    if (typeof value === "number") {
                      setScale(value);
                      return;
                    }

                    setScale(value[0] ?? 1);
                  }}
                />
              </div>
            </>
          )}

          <input
            id="profile-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
            className="sr-only"
          />

          <label
            htmlFor="profile-image"
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <UploadIcon />
            Seleccionar imagen
          </label>

          <Button disabled={!file || saving} onClick={handleSave}>
            {saving ? "Guardando..." : "Guardar foto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

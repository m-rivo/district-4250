import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { getCroppedImage } from '#/lib/utils/crop-image'

type Props = {
  onSave: (file: File) => Promise<void>
}

export function ProfilePictureDialog({ onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<string>()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<{
    x: number
    y: number
    width: number
    height: number
  }>()
  const [isSaving, setIsSaving] = useState(false)

  const onCropComplete = useCallback(
    (
      _: unknown,
      pixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedArea(pixels)
    },
    [],
  )

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) return

    setImage(URL.createObjectURL(file))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  async function handleSave() {
    if (!image || !croppedArea) return

    setIsSaving(true)

    try {
      const blob = await getCroppedImage(image, croppedArea)

      const file = new File([blob], 'profile.jpg', {
        type: 'image/jpeg',
      })

      await onSave(file)
      setOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value)

    if (!value && image) {
      URL.revokeObjectURL(image)
      setImage(undefined)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedArea(undefined)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ImageIcon />
          Picture
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit profile picture</DialogTitle>
          <DialogDescription>
            Select and adjust your profile picture.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="picture">Picture</FieldLabel>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <FieldDescription>Select an image to upload.</FieldDescription>
        </Field>

        {image && (
          <>
            <div className="relative h-72 w-full overflow-hidden rounded-md bg-muted">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <Field>
              <FieldLabel>Zoom</FieldLabel>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
              />
            </Field>
          </>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleSave}
            disabled={!image || !croppedArea || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

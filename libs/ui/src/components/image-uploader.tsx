"use client";

import React, {
  useEffect,
  useState,
  useImperativeHandle,
  Ref,
  forwardRef
} from "react";
import {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Input } from "./input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./form";
import { ImagePlus, CircleXIcon } from "lucide-react";
import { cn } from "@potato-lab/lib/utils";
import { Slider } from "./slider";
import Cropper, { Point, Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./dialog";
import { Label } from "./label";
import { Button } from "./button";
import { getCroppedImg } from "../utils/crop-image.util";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";

export interface ImageUploaderComponentRef {
  removeImage: VoidFunction;
}

interface ImageUploaderProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  imageRef: FieldPath<T>;
  title: string;
  className?: string;
  imgClassName?: string;
  imgCropShape?: "rect" | "round";
  placeholder?: React.ReactNode;
}

const ImageUploaderContent = <T extends FieldValues>(
  {
    form,
    imageRef,
    title,
    className,
    imgClassName,
    imgCropShape = "rect",
    placeholder
  }: ImageUploaderProps<T>,
  ref: Ref<ImageUploaderComponentRef>
) => {
  const [tempImage, setTempImage] = useState<string | ArrayBuffer | null>("");
  const [image, setImage] = useState<string | ArrayBuffer | null>("");

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const [showEditorDialog, setShowEditorDialog] = useState(false);

  useImperativeHandle(ref, () => ({ removeImage }));

  useEffect(() => {
    if (!showEditorDialog) {
      resetEditorConfig();
    }
  }, [showEditorDialog]);

  const resetEditorConfig = () => {
    setTempImage(null);
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(undefined);
  };

  const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const saveChanges = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    try {
      const { image, imageUrl } = await getCroppedImg(
        tempImage as string,
        croppedAreaPixels,
        rotation
      );
      setImage(imageUrl);
      form.setValue(imageRef, image as PathValue<T, Path<T>>);
      form.clearErrors(imageRef);
    } catch (e) {
      console.error(e);
      toast.error("Image crop failed. Please try again.");
      form.resetField(imageRef);
    }
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const reader = new FileReader();
    try {
      reader.onload = () => setTempImage(reader.result);
      reader.readAsDataURL(acceptedFiles[0]);
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed. Please try again.");
      setTempImage(null);
    }
  }, []);

  const removeImage = () => {
    resetEditorConfig();
    setImage(null);
    form.resetField(imageRef);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1
    });

  return (
    <>
      <FormField
        control={form.control}
        name={imageRef}
        render={() => (
          <FormItem>
            <FormLabel
              className={`${fileRejections.length !== 0 && "text-destructive"}`}
            >
              {title}
            </FormLabel>
            <FormControl>
              <div className="relative flex items-center justify-start w-fit">
                {image && (
                  <CircleXIcon
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={removeImage}
                  />
                )}

                <div
                  {...getRootProps()}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground shadow-sm shadow-foreground aspect-square max-h-[250px] min-h-[150px] overflow-hidden relative",
                    className
                  )}
                >
                  {image && (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img
                      src={image as string}
                      alt="Uploaded image"
                      className={cn("object-cover", imgClassName)}
                    />
                  )}
                  <div className="scale-75 flex flex-col items-center gap-y-3">
                    {placeholder ? (
                      placeholder
                    ) : (
                      <ImagePlus
                        className={`size-28 ${image ? "hidden" : "block"}`}
                      />
                    )}
                    <Input
                      {...getInputProps()}
                      type="file"
                      onInput={() => setShowEditorDialog(true)}
                    />
                    {!image && (
                      <p className="text-center">
                        {isDragActive
                          ? "Drop the image!"
                          : "Click here or drag an image to upload it"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage>
              {fileRejections.length !== 0 && (
                <p>Image must be less than 1MB and of type png, jpg, or jpeg</p>
              )}
            </FormMessage>
          </FormItem>
        )}
      />
      <Dialog open={showEditorDialog} onOpenChange={setShowEditorDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="py-4 relative min-h-[60vh] max-h-[80vh] h-auto">
            <Cropper
              image={tempImage as string}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1}
              cropShape={imgCropShape}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div>
            <Label>Zoom</Label>
            <Slider
              className="mt-2"
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onValueChange={(zoom) => setZoom(zoom[0])}
            />
          </div>
          <div>
            <Label>Rotation</Label>
            <Slider
              className="mt-2"
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onValueChange={(rotation) => setRotation(rotation[0])}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={saveChanges}>Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const ImageUploader = forwardRef(ImageUploaderContent) as <
  T extends FieldValues
>(
  props: ImageUploaderProps<T> & { ref?: Ref<ImageUploaderComponentRef> }
) => ReturnType<typeof ImageUploaderContent>;

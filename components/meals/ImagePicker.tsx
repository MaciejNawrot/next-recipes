"use client";

import classes from './ImagePicker.module.css';
import { useRef, useState } from "react";
import Image from "next/image";

type ImagePickerProps = {
  label: string;
  name: string;
}

export default function ImagePicker({label, name}: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState< string | ArrayBuffer | null >();

  const imageInputRef = useRef<HTMLInputElement>(null);

  function handlePickImage() {
    imageInputRef.current?.click();
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    }
    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>

      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet</p>}
          {pickedImage && <Image src={pickedImage as string} alt="The image selected by user" fill />}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInputRef}
          onChange={handleImageChange}
          required
        />
        <button className={classes.button} type="button" onClick={handlePickImage}>
          Pick an image
        </button>
      </div>
    </div>
  );
}
import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from '../firebase';
import firebase from "firebase";
import '../style/ImageUpload.css'

function ImageUpload({ user, setUploadOpen }) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('');

    const handleChange = (e) => {
        // identifies the first selected file/photo, then sets image to this file
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = (e) => {
        // Uploading logic: referencing the chosen file from the image state, then adding it to firebase storage
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // showing progress logic...
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                // Error logic if upload goes wrong...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete logic...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: user.displayName,
                        });

                        setProgress(0);
                        setCaption('');
                        setImage(null);
                        setUploadOpen(false);
                    });
            }
        )
    };

    return (
        <div className="image-upload">
            <h1>Upload</h1>
            <progress className="image-upload__progress" value={progress} max="100" />
            <input className="image-upload__file" type="file" onChange={handleChange} />
            <input className="image-upload__caption" type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption}/>
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload

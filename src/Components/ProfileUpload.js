import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from '../firebase';
import '../style/ImageUpload.css'

function ProfileUpload({ user, setProfileUploadOpen }) {
    const [progress, setProgress] = useState(0);
    const [userProfile, setUserProfile] = useState('');

    const handleChange = (e) => {
        // identifies the first selected file/photo, then sets image to this file
        if (e.target.files[0]) {
            setUserProfile(e.target.files[0]);
        }
    };

    const handleUpload = (e) => {
        
        // delete any duplicate profiles for the current for username
        db.collection("profiles").where("username", "==", user.displayName)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    doc.ref.delete();
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
        });

        // Uploading logic: referencing the chosen file from the image state, then adding it to firebase storage
        const uploadTask = storage.ref(`profiles/${userProfile.name}`).put(userProfile);

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
                // complete logic to assign the imageUrl to the current user...
                storage
                    .ref("profiles")
                    .child(userProfile.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        user.updateProfile({
                            photoURL: url
                        });
                        // post image inside db
                        db.collection("profiles").add({
                            imageUrl: url,
                            username: user.displayName,
                        });
                    });
                    setProgress(0);
                    setUserProfile(null);
                    setProfileUploadOpen(false);
            }
        )
    };

    return (
        <div className="image-upload">
            <h1>Upload Profile Photo</h1>
            <progress className="image-upload__progress" value={progress} max="100" />
            <input className="image-upload__file" type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ProfileUpload

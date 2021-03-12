/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import '../style/Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from 'firebase';

function Post({ postId, currentUser, postUsername, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [userPhoto, setUserPhoto] = useState(null);

    // useEffect to map comments to posts based on the postId
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    // creates comment in the firebase db
    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: currentUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    const getPostUserPhoto = (event) => {
        // console.log(postUsername);
        db.collection("profiles").where("username", "==", postUsername)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                setUserPhoto(doc.data().imageUrl);
            });
        });
        
        return userPhoto
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={postUsername}
                    src={getPostUserPhoto()}
                    onClick={() => console.log(postUsername)}
                />
                <h3>{postUsername}</h3>
            </div>
            
            <img 
                className="post__image"
                src={imageUrl}
                alt="Post Image">
            </img>

            <h4 className="post__text"><strong>{postUsername}</strong> {caption}</h4>

            <div className="post__comments">
                {/* <strong>Comments</strong> */}
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {currentUser && (
                <form className="post__comment-box">
                    <input 
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        type="submit"
                        disabled={!comment}
                        onClick={postComment}
                    > 
                    Post 
                    </button>
                </form>
            )}
        </div>
    )
}

export default Post

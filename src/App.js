import React, { useState, useEffect }  from 'react';
import './App.css';
import Post from './Components/Post';
import ProfileUpload from './Components/ProfileUpload';
import ImageUpload from './Components/ImageUpload';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "./Components/GlobalStyles";
import { lightTheme, darkTheme } from "./Components/Themes"

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openUpload, setUploadOpen] = useState(false);
  const [openProfileUpload, setProfileUploadOpen] = useState(false);
  const [openProfile, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // onAuthStateChanged keeps you logged in even on a refresh until you actually log off and the user changes to null
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  // useEffect Runs a piece of code based on a specific condition. Example: run every time a post happens. if its empty, runs at the load.
  useEffect(() => {
    // pulling the db from firebase -> the collection -> setting a snapshot of each as a post object
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is added, this code fires...
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()
      })));
    })
  }, [])

  // Signup function to sign in with email and password using firebase
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
          photoUrl: "./profile.jpg"
        })
      })
      .catch((error) => alert(error.message))

      setOpen(false);
  }

  // Login function to sign in with email and password using firebase
  const login = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setOpenLogin(false);
  }

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles/>
        <div className="app">

          {/* Upload Profile Modal */}
          <Modal
            open={openProfileUpload}
            onClose={() => setProfileUploadOpen(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <center>
                {user ? (
                  <ProfileUpload user={user} setProfileUploadOpen={setProfileUploadOpen}/>
                ) : (
                  <h3>Sorry, you need to login to change user profile picture.</h3>
                )}
              </center>
            </div>
          </Modal>

          {/* Profile Modal */}
          <Modal
            open={openProfile}
            onClose={() => setProfileOpen(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <center>
              { user && (
                <div className="app__profile-container">
                  <Button onClick={() => setProfileUploadOpen(true)}>Change Profile Pic</Button>
                  <Button onClick={() => {
                    auth.signOut();
                    setProfileOpen(false);
                  }}>Logout</Button>
                </div>
                  )}
              </center>
            </div>
          </Modal>

          {/* Upload Modal */}
          <Modal
            open={openUpload}
            onClose={() => setUploadOpen(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <center>
                {user ? (
                  <ImageUpload user={user} setUploadOpen={setUploadOpen}/>
                ) : (
                  <h3>Sorry, you need to login to upload.</h3>
                )}
              </center>
            </div>
          </Modal>

          {/* SignUp Modal */}
          <Modal
            open={open}
            onClose={() => setOpen(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app__signup">
                <center>
                  <img 
                    className="app__header-image"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                  />
                </center>
                <Input 
                    placeholder="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  >
                  </Input>
                  <Input 
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  >
                  </Input>
                  <Input 
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  >
                  </Input>
                  <Button type="submit" onClick={signUp}>Sign Up</Button>
                </form>
            </div>
          </Modal>

          {/* Login Modal */}
          <Modal
            open={openLogin}
            onClose={() => setOpenLogin(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app__login">
                <center>
                  <img 
                    className="app__header-image"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                  />
                </center>
                  <Input 
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  >
                  </Input>
                  <Input 
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  >
                  </Input>
                  <Button type="submit" onClick={login}>Login</Button>
                </form>
            </div>
          </Modal>

          <div className="app__header">
            <img 
              className="app__header-image"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
                  
            {/* Container for user option buttons in the top right of the app. */}
            <div className="app__control-container">
              { user ? (
                <div className="app__logout-container">
                  <button className="app__theme-toggle-logout" onClick={themeToggler}>🌗</button>
                  <button className="app__button-logout" onClick={() => setUploadOpen(true)}>Upload</button>
                  <button className="app__button-logout" onClick={() => setProfileOpen(true)}>
                  <Avatar
                        className="app__avatar"
                        alt={username}
                        src={user.photoURL}
                    />
                  </button>
                </div>
                ) : (
                <div className="app__login-container">
                  <button className="app__theme-toggle-login" onClick={themeToggler}>🌗</button>
                  <button className="app__button-login" onClick={() => setOpenLogin(true)}>Login</button>
                  <button className="app__button-login" onClick={() => setOpen(true)}>Sign Up</button>
                </div>
              )}
            </div>
          </div>

          {/* <center>
            <div className="app__stories">
              Stories
            </div>
          </center> */}

          <div className="app__posts">
            {
              posts.map(({id, post}) => (
                <Post key={id} postId={id} currentUser={user} postUsername={post.username} caption={post.caption} imageUrl={post.imageUrl} />
              )) 
            }
          </div>
          
        </div>
    </ThemeProvider>

  );
}

export default App;

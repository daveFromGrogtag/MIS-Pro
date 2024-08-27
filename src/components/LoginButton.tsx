import { useState, useEffect } from 'react'
import {auth} from '../scripts/firebase/init.ts'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function LoginButton() {
    const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(setUser);
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [])

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        console.log(user);
        // Redirect or handle signed-in user
    })
    .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
    });
  }

  const handleLogout = () => {
    signOut(auth)
    .then(() => {
    // Sign-out successful.
    console.log('User signed out');
    // Redirect or update UI as needed after sign-out
    })
    .catch((error) => {
    // An error happened.
    console.error('Sign Out Error', error);
    });
  }

  return (
    <div>
      {user ? (
      <div>
        <div style={{display: 'flex', alignItems: 'center', color: 'white'}}>
          <img 
              src={user.photoURL || 'https://via.placeholder.com/50'} 
              alt="User Thumbnail"
              style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '10px' }}
            /><p>Signed in as<br/><b>{user.displayName || 'User'}</b></p>
            </div>
          <a onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>Sign Out</a>
        </div>
      ) : (
        <a onClick={handleLogin}><i className="fa fa-user" aria-hidden="true"></i>Sign In</a>
      )}
    </div>
  )

}

export default LoginButton
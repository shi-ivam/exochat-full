import React, { useRef } from 'react';
import Fade from 'react-reveal/Fade';
import '../styles/auth.scss';
import axios from 'axios';

const Auth = (props) => {
  const [type, setType] = React.useState('signup');
  const [snackBar, setSnackBar] = React.useState(false);
  const [snackBarText, setSnackBarText] = React.useState(
    'Sample Snack Bar Text'
  );

  // input ref
  const usernameRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();

  const loginUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    // check if the values are empty
    if (username === '' || password === '') {
      setSnackBarText('Please fill all the fields');
      setSnackBar(true);
      setTimeout(() => {
        setSnackBar(false);
      }, 5000);

      return;
    }

    axios
      .post('http://localhost:5000/login', {
        username,
        password,
      })
      .then((res) => {
        if (res.data.type === 'success') {
          chrome.storage.sync.set({ username: username }, function () {
            console.log('Value is set to ' + username);
            // console.log('')
            props.setUrl('chats');
          });
        } else {
          setSnackBarText(res.data.message);
          setSnackBar(true);
          setTimeout(() => {
            setSnackBar(false);
          }, 5000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signupUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    if (username === '' || password === '' || name === '') {
      setSnackBar(true);
      setTimeout(() => {
        setSnackBar(false);
      }, 5000);
      setSnackBarText('Please fill all the fields');
      return;
    }

    axios
      .post('http://localhost:5000/signup', {
        username,
        password,
        name,
      })
      .then((res) => {
        if (res.data.type === 'success') {
          chrome.storage.sync.set({ username: username }, function () {
            console.log('Value is set to ' + username);
            props.setUrl('chats');
          });
        } else {
          setSnackBarText(res.data.message);
          setSnackBar(true);
          setTimeout(() => {
            setSnackBar(false);
          }, 5000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <header className="auth-wrapper">
        <h2>Exochat</h2>
        <div className="main">
          <div className="auth-form">
            <Fade bottom collapse when={type === 'signup'}>
              <div>
                <div className="left">
                  <h2>Display Name</h2>
                </div>
                <input type="text" placeholder="John Doe" ref={nameRef} />
                <div className="sep"></div>
              </div>
            </Fade>
            <div className="left">
              <h2>Username</h2>
            </div>
            <input type="text" placeholder="johndoe" ref={usernameRef} />
            <div className="sep"></div>
            <div className="left">
              <h2>Password</h2>
            </div>
            <input type="password" placeholder="secure" ref={passwordRef} />
            <div className="change-type">
              <p>
                {type === 'signup'
                  ? 'Already have an account?'
                  : "Don't have an account?"}
              </p>
              <a
                onClick={() => {
                  if (type === 'signup') {
                    setType('login');
                  } else {
                    setType('signup');
                  }
                }}
              >
                {type === 'signup' ? 'Login' : 'Signup'}
              </a>
            </div>
          </div>
          <Fade bottom collapse when={snackBar}>
            <div className="snackbar">{snackBarText}</div>
          </Fade>
          <div className="btns">
            <button
              onClick={() => {
                if (type === 'signup') {
                  signupUser();
                } else {
                  loginUser();
                }
              }}
            >
              <span>Continue</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-right-short"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            </button>
            {/* <Link to={'/chats'}>Get Started</Link> */}
          </div>
        </div>
        <div></div>
        {/* <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/pages/Newtab/Newtab.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React!
          </a>
          <h6>The color of this paragraph is defined using SASS.</h6> */}
      </header>
    </div>
  );
};

export default Auth;

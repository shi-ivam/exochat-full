import React from 'react';
import './Popup.scss';
import '../../styles/fonts.scss';
import Chatpage from '../../components/Chatpage';
import Auth from '../../components/Auth';
import { useEffect } from 'react';

const Popup = (props) => {
  // const []

  return (
    <div className="App">
      <header className="App-header">
        <h2>Exochat</h2>
        <div className="main">
          <p>
            All New Way to interact with your favourite <span>communities</span>
          </p>
          <div className="btns">
            <button
              onClick={() => {
                chrome.storage.sync.get(['username'], function (result) {
                  if (result.username) {
                    props.setUrl('chats');
                  } else {
                    props.setUrl('auth');
                  }
                  setLoading(false);
                });
              }}
            >
              <span>Get Started</span>
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

const Loading = () => {
  return (
    <div className="loading-wrapper">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

const HOC = () => {
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    chrome.storage.sync.get(['username'], function (result) {
      if (result.username) {
        setUrl('chats');
      }
      setLoading(false);
    });
  }, []);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : url === 'chats' ? (
        <Chatpage setUrl={setUrl} />
      ) : url === 'auth' ? (
        <Auth setUrl={setUrl} />
      ) : (
        <Popup setUrl={setUrl} />
      )}
    </div>
  );
};

export default HOC;

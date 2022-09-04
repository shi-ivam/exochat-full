// create a stateless widget
import React from 'react';
import { useEffect, useState } from 'react';
import '../styles/variables.scss';
import '../styles/chatpage.scss';
import '../styles/fonts.scss';
import { hop } from '@onehop/client';
// import uuid from 'uuid';
const uuid = require('uuid');

hop.init({
  projectId: 'project_NTA2MzczNjA2OTgzNDc1MzE', // replace with your project ID
});
import { useChannelMessage, useReadChannelState } from '@onehop/react';
import axios from 'axios';
import moment from 'moment';
import Fade from 'react-reveal/Fade';

const toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};

const ErrorPage = () => {
  return (
    <div className="App">
      <header
        className="App-header"
        style={{
          width: '100%',
        }}
      >
        <h2>Exochat</h2>
        <div className="main">
          <p
            style={{
              fontSize: '1.2rem ',
              fontWeight: 400,
              paddingBottom: '2rem',
            }}
          >
            You are not on a <span>Supported</span> website.
          </p>
          <div></div>
        </div>
        <div></div>
      </header>
    </div>
  );
};
const Info = () => {
  return (
    <div
      className="App"
      style={{
        borderRadius: '1rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <header className="App-header">
        <div className="main">
          <p className="small">Send a Message to get the Party Started</p>
          <div></div>
        </div>
        <div></div>
      </header>
    </div>
  );
};
const Chatpage = (props) => {
  // const [lastUsedName, setLastUsedName] = useState('');
  const [username, setUsername] = useState('');
  const [active, setActive] = useState(0);
  const [dropdownvisible, setDropdownvisible] = useState(false);

  const [msgs, setMsgs] = useState([]);
  const [fetching, setFetching] = useState(true);

  const containerRef = React.useRef(null);

  useEffect(() => {
    getPrevMessages(props.url).then(() => {
      setFetching(false);
    });
    chrome.storage.sync.get('username').then((result) => {
      setUsername(result.username);
    });
    // getStats();
    // setInterval(() => {
    //   getStats();
    // }, 1000);
  }, []);

  useChannelMessage('channels', 'CHANNEL_CREATE', (message) => {
    if (message.channelId === props.url) {
      // getPrevMessages(props.url).then(() => {});
      props.restart();
    }
  });

  const { state } = useReadChannelState(props.url);

  useChannelMessage(props.url, 'MESSAGE_CREATE', (message) => {
    // this will be called every time the USER_MESSAGE event is sent to this channel
    // console.log(msgs);
    // anotherOne();

    setMsgs((prevMsgs) => [...prevMsgs, message]);
    // const prevMsgsIds = msgs.map((msg) => {
    //   msg.trackingId === undefined ? '0' : msg.trackingId;
    // });
    // console.log(prevMsgsIds);
    // console.log(message.trackingId);
    // if (!prevMsgsIds.includes(message.trackingId)) {
    // }

    // containerRef.current.scrollTop = containerRef.current.scrollHeight;
  });

  const createMessage = async (e) => {
    e.preventDefault();

    // value checking
    if (e.target.message.value === '') {
      return;
    }

    const username = await chrome.storage.sync.get(['username']);
    if (!username.username) {
      return;
    }

    getVideoTime().then((timeData) => {
      if (timeData.currentTime !== undefined) {
        const trackingId = uuid.v4();
        const message = {
          videoId: props.url,
          owner: username.username,
          message: e.target.message.value,
          videoTime: timeData.currentTime,
          trackingId: trackingId,
        };
        // setMsgs((m) => [...m, message]);
        containerRef.current.scrollTop = containerRef.current.scrollHeight;

        axios
          .post('http://localhost:5000/send-message', {
            videoTime: timeData.currentTime,
            message: e.target.message.value.trim(),
            owner: username.username.trim(),
            videoId: props.url,
            trackingId: trackingId,
          })
          .then((data) => {
            if (data.data.type === 'success') {
              // props.restart();
            }
          });
        e.target.message.value = '';
      } else {
        console.log('no time data');
      }
    });
  };

  const getVideoTime = async () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            from: 'popup',
            subject: 'getVideoTime',
          },
          function (response) {
            console.log('Resolved with response: ', response);
            resolve(response);
          }
        );
      });
    });
  };

  const setVideoTime = async (time) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          from: 'popup',
          subject: 'setVideoTime',
          time: time,
        },
        function (response) {
          console.log('Resolved with response: ', response);
        }
      );
    });
  };

  const getPrevMessages = async (videoId) => {
    axios.get(`http://localhost:5000/msgs/${videoId}`).then((res) => {
      if (res.data.type === 'success') {
        setMsgs(res.data.msgs);
        // scroll to bottom
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
        console.log('Success');
      } else {
        console.log('failed to get messages');
      }
    });
  };

  // const getStats = async () => {
  //   axios.get(`http://localhost:5000/stats/${props.url}`).then((res) => {
  //     if (typeof res.data.online_count === 'number') {
  //       // props.setStats(res.data);
  //       setActive(res.data.online_count);
  //     }
  //   });
  // };

  return (
    <div className="chatpage">
      {/* <h1>Live Chat</h1> */}
      <div className="channel-id">
        <p className="id">{props.url}</p>
        {!dropdownvisible ? (
          <button
            onClick={() => {
              setDropdownvisible(!dropdownvisible);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-chevron-down"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => {
              setDropdownvisible(!dropdownvisible);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-chevron-up"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          </button>
        )}
      </div>
      {state ? (
        <Fade collapse bottom when={state && dropdownvisible}>
          <div className="channel-info">
            <div className="photo">
              <img src={state.videoMaxThumbnail} alt="" />
            </div>
            <div className="expanded">
              <div className="grid">
                <div className="channel-infos channel-info-left">
                  <p>
                    Title : <span>{state.videoTitle.slice(0, 50)}</span>{' '}
                  </p>
                </div>
                <div className="channel-infos channel-info-right">
                  <p>
                    Active : <span>{active}</span>
                  </p>
                  <p>
                    Duration : <span>{state.videoDuration || 'Live'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      ) : (
        ''
      )}
      <div className="chatarea-wrapper" ref={containerRef}>
        {fetching ? (
          <Loading />
        ) : msgs.length === 0 ? (
          <Info />
        ) : (
          <div className="chatarea">
            {msgs.map((msg) => (
              <div
                className={
                  msg.owner === username ? 'msg sender' : 'msg receiver'
                }
                key={msg.id}
              >
                <div className="col">
                  <div className="inner-msg">
                    <div className="msg-body">
                      <p>{msg.message}</p>
                    </div>
                  </div>
                  <div className="msg-time">
                    <p>{moment(msg.createdAt).format('DD-MM-YY HH:SS')}</p>
                  </div>
                  <div className="msg-location">
                    <p>by {msg.userDisplayName} at </p>
                    <a
                      onClick={() => {
                        setVideoTime(msg.videoTime).then((d) => {
                          console.log(d);
                        });
                      }}
                    >
                      {toHHMMSS(msg.videoTime)}
                    </a>
                  </div>
                  {/* <div className="msg-time">
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form className="create" onSubmit={createMessage}>
        <div className="input-col">
          <div className="input-row">
            <input
              type="text"
              name="message"
              placeholder="Type a message"
              // width={'400'}
            />
            <button type="submit">
              <span>Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-send"
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
              </svg>
            </button>
          </div>
        </div>
      </form>
      <div className="btns">
        <button
          className="back "
          onClick={() => {
            props.setUrl('');
          }}
        >
          Go Back
        </button>
        <div className="sepe"></div>
        <button
          className="back logout"
          onClick={() => {
            // delete username from local storage
            chrome.storage.sync.remove(['username'], function () {
              // console.log('Value is set to ' + 'username');
              console.log('Value Deleted');
              props.setUrl('');
            });
          }}
        >
          Logout
        </button>
      </div>
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

const ReloadNotice = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Exochat</h2>
        <div className="main">
          <p
            style={{
              fontSize: '1.2rem ',
              fontWeight: 400,
              paddingBottom: '2rem',
            }}
          >
            The Channel created. Please <span>Reload</span> the extension to
            continue chatting.
          </p>
          <div></div>
        </div>
        <div></div>
      </header>
    </div>
  );
};

const HOC = (higherProps) => {
  const [url, setUrl] = useState('');
  const [notice, setNotice] = useState(false);

  const restart = () => {
    setNotice(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 20000);
  };

  useEffect(() => {
    console.log('Use Effect');
    console.log('Check');
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let tabs = await chrome.tabs.query(queryOptions);
      console.log(tabs);
      return tabs[0];
    }
    getCurrentTab().then((tab) => {
      const url = tab.url;
      const domain = new URL(url);
      if (domain.host === 'www.youtube.com') {
        if (domain.pathname === '/watch') {
          if (domain.searchParams.get('v')) {
            setUrl(domain.searchParams.get('v'));
          }
        }
      }
    });
  }, []);
  return notice ? (
    <ReloadNotice />
  ) : url !== '' ? (
    <Chatpage url={url} setUrl={higherProps.setUrl} restart={restart} />
  ) : (
    <ErrorPage />
  );
};

export default HOC;

import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Exochat</h2>
        <div className="main">
          <p>
            All New Way to interact with your favourite <span>communities</span>
          </p>
          <div className="btns">
            <button>Get Started</button>
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

export default Newtab;

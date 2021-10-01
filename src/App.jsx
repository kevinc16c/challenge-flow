import React, { useState } from 'react';
import './styles.scss';
import Header from './components/Header.jsx';
import Clima from './pages/Clima.jsx';

function App() {
  const [city, setCity] = useState("");
  return (
    <>
      <Header
        onSelectLocalidad={(e) => { setCity(e) }}
      />
      <div className="App-body">
        <br />
        <Clima
          city={city}
        />
      </div>
    </>
  );
}

export default App;

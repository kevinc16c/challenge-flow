import React, {useState} from 'react';
import './App.css';
import './styles/bootstrap/bootstrap.scss'
import Header from './components/Header';
import Clima from './pages/Clima';

function App() {
  const [city, setCity] = useState("")
  return (
    <div>
      <Header 
        onSelectLocalidad={(e)=>{setCity(e)}}
      />
      <div className="App">
        <div className="App-body">
          <Clima 
            city={city}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

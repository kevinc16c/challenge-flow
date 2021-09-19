import logo from './logo.svg';
import './App.css';
import './styles/bootstrap/bootstrap.scss'
import Header from './components/Header';
function App() {
  return (
    <div>
      <Header />
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>

        </header>
      </div>
    </div>
  );
}

export default App;

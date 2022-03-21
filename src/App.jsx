import Install from './components/Install';
import Home from './components/Main';

function App() {

  if (window.ethereum) {
    return <Home />;
  } else {
    return <Install />
  }
}

export default App;
import './App.css';
import NavBar from "./components/navbar/navbar.js";
import RegistrationLogin from "./components/registrationLogin/registrationLogin.js";
import SearchBar from './components/search-bar/search-bar.js';
import GetWords from './components/slider/slider.js';
function App() {
  return (
    <div>
      <NavBar />
      <RegistrationLogin />
      <SearchBar />
      <GetWords />
    </div>
  )
}

export default App;
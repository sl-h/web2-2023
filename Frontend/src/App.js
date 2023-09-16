import './styles/App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./views/LandingPage/LandingPage";

function App() {

  return (
      <>
        <Header/>
        <main className="App">
            <LandingPage/>
            {/*
        <ul className={"navbar-menu"}>

            <li><Link to={"/register"}>Register</Link></li>
            <li> <Link to={"/login"}>Login</Link></li>
        </ul>*/}
        </main>
        <Footer/>
      </>
  );
}

export default App;

import "./App.css";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import Home from "./components/layout/Home.jsx";
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <HelmetProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Footer />
        </HelmetProvider>
      </Router>
    </>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import "./assets/css/App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LoginChecker from "./components/passive/LoginChecker";
import Footer from "./components/Footer";

function App() {
  return (
    <section className="app-container">
      <LoginChecker />

      {/* Layout utama aplikasi */}
      <Sidebar />
      <div className="app-content-container">
        <Header />
        <div className="app-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </section>
  );
}

export default App;

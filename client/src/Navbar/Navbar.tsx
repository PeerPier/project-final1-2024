import { useState } from "react";
import logoKKU2 from "../pic/logowhite.png";
import { Link } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav id="navbar">
      <div className="head1">
        <a href="/home">
          <img className="navbar-logo" src={logoKKU2} alt="logo" />
        </a>
      </div>
      <div className="linka">
        <Link to="login">เข้าสู่ระบบ</Link>
        <Link to="register">สมัครใช้งาน</Link>
      </div>
      <label
        htmlFor="burger-checkbox"
        className="burger-menu"
        onClick={toggleMenu}
      >
        <div className="burger-icon">
          <div className="bar" style={{ color: "white" }}></div>
          <div className="bar" style={{ color: "white" }}></div>
          <div className="bar" style={{ color: "white" }}></div>
        </div>
        <input
          type="checkbox"
          id="burger-checkbox"
          className="burger-checkbox"
        />
        <div className={`menu-links ${isActive ? "active" : ""}`}>
          <Link to="login">เข้าสู่ระบบ</Link>
          <Link to="regist">สมัครใช้งาน</Link>
        </div>
      </label>
    </nav>
  );
}

export default Navbar;

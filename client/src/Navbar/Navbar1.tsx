import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar/navbar1.css";
import logoKKU from "../pic/logo-head.jpg";
import { IoIosSearch } from "react-icons/io";
import { PiUserCircleFill } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import {
  IoMdSettings,
  IoIosStats,
  IoIosHelpCircleOutline,
} from "react-icons/io";
import { IoLogOutOutline, IoNotificationsOutline } from "react-icons/io5";
import { getPosts } from "../api/post";
import { Post } from "../types/post";
import Notifications from "./chat/Notification";
import { searchPost } from "../api/search";
import { Dropdown } from "react-bootstrap";
import { FaUser } from "react-icons/fa";

const cates = ["Piyarat U", "ท่องเที่ยว", "Pearr"].map((name, index) => ({
  name,
  id: index,
}));

interface Navbar1Props {
  children?: ReactNode;
}

const Navbar1: React.FC<Navbar1Props> = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [feeds, setFeeds] = useState<Post[] | null>(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPosts();
        setFeeds(res);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredCate = cates.filter(
    (cate) =>
      search.length && cate.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const query = (event.target as HTMLInputElement).value.trim();
      if (!query) return;
      setLoading(true);
      try {
        await searchPost(query);
        navigate("/search", { state: { searchQuery: query } });
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userId");
    setUserId("");
    navigate("/login");
  }, [navigate]);

  const toggleNotiMenu = () => {
    setIsNotiOpen(!isNotiOpen);
  };

  const handleNotificationClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    type: string,
    notificationId: string,
    entityId: string
  ) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:3001/notifications/${notificationId}/mark-as-read`
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      navigate(
        type === "follow" ? `/profile/${entityId}` : `/content/${entityId}`
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/notifications?userId=${userId}`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, [userId]);

  const NotificationIcon = () => {
    const unreadCount = useMemo(
      () => notifications.filter((notification) => !notification.isRead).length,
      [notifications]
    );

    return (
      <div
        style={{ position: "relative", display: "inline-block" }}
        onClick={toggleNotiMenu}
      >
        <IoNotificationsOutline size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
        <Dropdown show={isNotiOpen} onToggle={() => setIsNotiOpen(!isNotiOpen)}>
          <Dropdown.Menu style={{ right: "-40px", top: "8px" }}>
            {notifications.map((notification) => {
              return (
                <Dropdown.Item key={notification._id} href="#">
                  <div className="d-flex">
                    <FaUser style={{ fontSize: "20px", marginRight: "15px" }} />
                    <p
                      className="m-0"
                      onClick={(e: any) =>
                        handleNotificationClick(
                          e,
                          notification.type,
                          notification._id,
                          notification.entity
                        )
                      }
                    >
                      {notification.message}
                    </p>
                  </div>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  return (
    <div className="navbarreal">
      <div className="headerr d-flex">
        <a href="#" className="logo1">
          <img src={logoKKU} alt="logo" />
        </a>

        <ul className="navmenu">
          <li>
            <a href="/">หน้าแรก</a>
          </li>
          <li>
            <a href="#">ยอดนิยม</a>
          </li>
          <li>
            <a href="#">หมวดหมู่</a>
          </li>
          <li>
            <a href="#">เกี่ยวกับเรา</a>
          </li>
        </ul>

        <div className="nav-icon">
          <div className={`search ${showDropdown ? "open" : ""}`}>
            <input
              ref={inputRef}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              placeholder="Search..."
              type="text"
            />
            <IoIosSearch onClick={toggleDropdown} />
          </div>
          <div className={`items ${showDropdown ? "open" : ""}`}>
            {filteredCate.length > 0 &&
              filteredCate.map((cate) => (
                <button key={cate.id} style={{ color: "#222222" }}>
                  {cate.name}
                </button>
              ))}
          </div>
          <NotificationIcon />
          <div className="user-profile-dropdown">
            <PiUserCircleFill onClick={toggleDropdown} />
            <Dropdown
              show={dropdownOpen}
              onToggle={() => setDropdownOpen(false)}
            >
              <Dropdown.Menu style={{ right: "-40px", top: "8px" }}>
                <Dropdown.Item href={`/profile/${userId}`}>
                  <div className="d-flex">
                    <FaUser style={{ fontSize: "20px", marginRight: "15px" }} />
                    <p className="m-0">โปรไฟล์</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                  <div className="d-flex">
                    <IoMdSettings
                      style={{ fontSize: "20px", marginRight: "15px" }}
                    />
                    <p className="m-0">ตั้งค่า</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-3">
                  <div className="d-flex">
                    <IoIosStats
                      style={{ fontSize: "20px", marginRight: "15px" }}
                    />
                    <p className="m-0">สถิติ</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-4">
                  <div className="d-flex">
                    <IoIosHelpCircleOutline
                      style={{ fontSize: "20px", marginRight: "15px" }}
                    />
                    <p className="m-0">ช่วยเหลือ</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <div className="d-flex">
                    <IoLogOutOutline
                      style={{ fontSize: "20px", marginRight: "15px" }}
                    />
                    <p className="m-0">ออกจากระบบ</p>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="bx bx-menu" id="menu-icon">
            <RxHamburgerMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar1;

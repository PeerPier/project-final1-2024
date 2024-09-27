import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LoginPage from "./Screens/login";
import RegistPage from "./Screens/register";
import TestPage from "./Screens/test";
import HomePage from "./Screens/home";
import Profile from "./Screens/profile";
import EditProfile from "./Screens/edit-profile";
import RegisterAdmin from "./Screens/Admin/adminRegister";
import Writepost from "./Screens/post";
import Content from "./Screens/Content";
import LoginAdmin from "./Screens/Admin/adminLogin";
import AdminHome from "./Screens/Admin/adminHome";
import Setting from "./Screens/setting1";
import Setting2 from "./Screens/setting2";
import Setting3 from "./Screens/setting3";
import Sidebar from "./Screens/sidebar";
import Settingtest from "./Screens/settingtest";
import Category from "./Screens/category";
import Popular from "./Screens/Popular";
import Footer from "./Navbar/footer";
import ForgotPassword from "./Screens/ForgotPassword";
import ResetPassword from "./Screens/ResetPassword";
import Post from "./Screens/post";
import Chat from "./Screens/chat";
import HelpCentre from "./Screens/helpcentre";
import { ChatContextProvider } from "./Screens/ChatContext";
import Navbar2 from "./Navbar/Navbar1";
import EditPost from "./Screens/edit-post";
import SearchResults from "./Navbar/SearchResults ";
import HelpCentre from "./Screens/helpcentre";
import Popular from "./Screens/Popular";

function NavbarLayout() {
  return (
    <>
      <Navbar2 />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <ChatContextProvider>
      <Router>
        <Routes>
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile/edit-profile/:id" element={<EditProfile />} />
            <Route path="/posts" element={<Post />} />
            <Route path="/writepost" element={<Writepost />} />
            <Route path="/editpost/:id" element={<EditPost />} />
            <Route path="/setting1" element={<Setting />} />
            <Route path="/setting2" element={<Setting2 />} />
            <Route path="/setting3" element={<Setting3 />} />
            <Route path="/sidebar" element={<Sidebar />} />
            <Route path="/st" element={<Settingtest />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/helpcentre" element={<HelpCentre />} />
            <Route path="/content/:id" element={<Content />} />
            <Route path="/category" element={<Category />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/register" element={<RegisterAdmin />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/:id" element={<AdminHome />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset_password/:id/:token"
            element={<ResetPassword />}
          />
          <Route path="/chats" element={<Chat />} />
          <Route path="/nav" element={<Navbar2 />} />
        </Routes>
      </Router>
    </ChatContextProvider>
  );
}

export default App;

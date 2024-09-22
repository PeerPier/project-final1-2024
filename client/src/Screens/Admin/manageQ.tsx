import React from "react";
import { PiUsersThreeFill } from "react-icons/pi";
import { LuView } from "react-icons/lu";
import { fetchAdminProfile } from "../../api/adminProfile";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { AiFillQuestionCircle } from "react-icons/ai";

const ManageQ: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const profileData = await fetchAdminProfile(id);
          setUsername(profileData.username);
          setAdminProfile(profileData);
          setEmail(profileData.email);
          setTel(profileData.tel);
          setFirstname(profileData.firstname);
          setLastname(profileData.lastname);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="manageUser">
      <div className="main1">
        <h1>จัดการคำถาม</h1>

        <div className="add-q">
          <div>
            <IoMdAdd />
            <a href="#">เพิ่มคำถาม</a>
          </div>
        </div>

        <div className="recent-order" style={{ marginTop: "1.5rem" }}>
          <h2>รายการ</h2>
          <div className="right">
            <div
              className="activity-analytics"
              style={{
                marginTop: "0.5rem",
              }}
            >
              <div className="item ">
                <div className="profile-photo">
                  <div>
                    <AiFillQuestionCircle />
                  </div>
                </div>
                <div className="right">
                  <div className="info">
                    <h3>วิธีการเขียนและเผยแพร่บล็อกแรกของคุณ</h3>
                  </div>
                  <div className="manage d-flex ">
                    <div
                      className="edit warning"
                      style={{ paddingRight: "10px" }}
                    >
                      <h3>Edit</h3>
                    </div>
                    <div className="delete danger">
                      <h3>Delete</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item ">
                <div className="profile-photo">
                  <div>
                    <AiFillQuestionCircle />
                  </div>
                </div>
                <div className="right">
                  <div className="info">
                    <h3>สามารถลบบัญชีผู้ใช้ได้อย่างไร</h3>
                  </div>
                  <div className="manage d-flex ">
                    <div
                      className="edit warning"
                      style={{ paddingRight: "10px" }}
                    >
                      <h3>Edit</h3>
                    </div>
                    <div className="delete danger">
                      <h3>Delete</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageQ;

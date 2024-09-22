import React from "react";

import Navbar2 from "../Navbar/Navbar1";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import cafeC from "../pic/cafeC.png";
import foodC from "../pic/foodC.png";
import trevelC from "../pic/travelC.png";
import beautyC from "../pic/beautyC.png";
import fashionC from "../pic/fashionC.png";
import lifestyleC from "../pic/lifestyleC.png";
import newsC from "../pic/newsC.png";
import otherC from "../pic/otherC.png";
const Category = () => {
  return (
    <div>
      <Navbar2 />

      <div className="categoryPage" style={{ margin: " 2% 15%" }}>
        <Row>
          <Col>
            <Card style={{ margin: "10px" }}>
              <Card.Img variant="top" src={cafeC} alt="cafe" />
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  คาเฟ่
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ margin: "10px" }}>
              <Card.Img variant="top" src={foodC} alt="food" />
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  อาหาร
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ margin: "10px" }}>
              <Card.Img variant="top" src={trevelC} alt="travel" />
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  ท่องเที่ยว
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ margin: "10px" }}>
              <Card.Img variant="top" src={fashionC} alt="fashion" />
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  แฟชั่น
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card style={{ margin: "10px" }}>
              <Card.Img variant="top" src={beautyC} alt="beauty" />
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  บิวตี้
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ margin: "10px" }}>
              <Card.Img variant="top" src={lifestyleC} alt="lifestyle" />
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  ไลฟ์สไตล์
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ margin: "10px" }}>
              <Card.Img variant="top" src={newsC} alt="other" />
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  ข่าวสาร
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ margin: "10px" }}>
              <Card.Img variant="top" src={otherC} alt="other" />
              <Card.Body>
                <Card.Title
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  อื่นๆ
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Category;

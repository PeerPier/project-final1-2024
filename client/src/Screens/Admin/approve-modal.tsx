import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

interface Report {
  _id: string;
  reason: string;
  verified: boolean;
  createdAt: string;
  reportedBy: {
    firstname: string;
  };
  post: {
    _id: string;
    user: {
      firstname: string;
    };
    image: string;
    topic: string;
  };
}

interface ReportDetailsModalProps {
  showModal: boolean;
  handleClose: () => void;
  report: Report | null;
  refreshReports: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  showModal,
  handleClose,
  report,
  refreshReports,
}) => {
  const API_BASE_URL = "http://localhost:3001";

  const verifyReport = async (
    reportId: string,
    isVerified: boolean
  ): Promise<AxiosResponse<any>> => {
    const url = `${API_BASE_URL}/api/report/${reportId}/verify`;

    try {
      const response = await axios.patch(url, {
        verified: isVerified,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to verify report: ${response.statusText}`);
      }

      return response;
    } catch (error: any) {
      console.error("Error verifying report:", error.message);
      throw error;
    }
  };

  const deletePostAndVerifyReport = async (
    reportId: string,
    postId: string
  ): Promise<any> => {
    const url = `${API_BASE_URL}/api/report/${reportId}/deletePost`;
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status} ${response.statusText} for report ${reportId}`
        );
      }

      return response.json();
    } catch (error: any) {
      console.error("Error deleting post and verifying report:", error.message);
      throw error;
    }
  };

  const handleVerification = async (isVerified: boolean) => {
    if (!report) {
      console.error("No report found");
      return;
    }

    try {
      await verifyReport(report._id, isVerified);
      console.log("Report verified successfully");

      if (!isVerified && report.post && report.post._id) {
        await deletePostAndVerifyReport(report._id, report.post._id);
        console.log("Post deleted successfully");
      }

      refreshReports();
      handleClose();
    } catch (error) {
      console.error("Failed to verify report:", error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Report Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {report ? (
          <>
            <p>
              {`${report.reportedBy.firstname} ได้รายงานโพสของ ${
                report.post.user.firstname
              }: ${report.reason || "No Title"}`}
            </p>
            <img
              src={report.post.image}
              alt={report.post.topic}
              style={{ width: "100%", height: "auto" }}
            />
          </>
        ) : (
          <p>No report selected.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => handleVerification(true)}>
          Verified
        </Button>
        <Button variant="danger" onClick={() => handleVerification(false)}>
          Not Verified
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportDetailsModal;

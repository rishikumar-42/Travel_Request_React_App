import React, { useState, useEffect, useRef } from "react";
import "../assets/css/NewSummary.css";
import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
import TravelRequestFormServiceLayer from "../service/TravelRequestFormService";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { border, borderLeft } from "@mui/system";
import CancelDialog from "./CancelDialog";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Button } from "primereact/button";
import TravelRequestFormService from "../service/TravelRequestFormService.js";
import { useNavigate } from "react-router-dom";

const NewSummary = ({
  item = {},
  travelInfo = [],
  attachmentInfo = [],
  onBack,
  isDashboardNavigate = false,
}) => {
  const [workflowTasks, setWorkflowTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [cancelFlag, setCancelFlag] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // 'approve' or 'reject'
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingNew, setLoadingNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEmailAddress, setEmailAddress] = useState(null);
  const [itineraries, setItineraries] = useState(
    Array.isArray(travelInfo) ? travelInfo : []
  );
  const [attachments, setAttachments] = useState(
    Array.isArray(attachmentInfo) ? attachmentInfo : []
  );

  // const { auth, login } = useAuth(); // Access auth from context
  // const { username, password } = auth;
  // const authHeader = "Basic " + btoa(username + ":" + password);
  const authHeader = window.Liferay.authToken;

  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   const storedPassword = localStorage.getItem("password");

  //   if (
  //     storedUsername &&
  //     storedPassword &&
  //     (username !== storedUsername || password !== storedPassword)
  //   ) {
  //     login(storedUsername, storedPassword);
  //   }
  // }, [login, username, password]);

  const fetchUserId = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_LIFERAY_BASE_URL}/o/headless-admin-user/v1.0/my-user-account`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'x-csrf-token': authHeader,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const user = await response.json();
      setEmailAddress(user.emailAddress);
      console.log(user.id);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
  },[authHeader]);

  useEffect(() => {
    const fetchWorkflowTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_LIFERAY_BASE_URL}/o/headless-admin-workflow/v1.0/workflow-tasks/assigned-to-me?page=1&pageSize=1000`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              'x-csrf-token': authHeader,
            },
          }
        );
        const data = await response.json();
        console.log("data : ", data);
        const task = data.items.find(
          (task) => task.objectReviewed.id === item.id
        );
        console.log("task", task);
        setCurrentTask(task);
        setWorkflowTasks(data.items || []);
        setIsTaskCompleted(!!task && task.completed);
        return task;
      } catch (err) {
        console.error("Failed to fetch workflow tasks:", err);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchWorkflowTasks();
  }, [authHeader, item.id]);

  const fetchWorkflowInstances = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_LIFERAY_BASE_URL}/o/headless-admin-workflow/v1.0/workflow-instances`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            'x-csrf-token': authHeader,
          },
        }
      );
      const data = await response.json();
      console.log("data : ", data);
      const task = data.items.find(
        (task) => task.objectReviewed.id === item.id
      );
      console.log("task", task);
      // setCurrentTask(task);
      // setWorkflowTasks(data.items || []);
      // setIsTaskCompleted(!!task && task.completed);
      return task;
    } catch (err) {
      console.error("Failed to fetch workflow tasks:", err);
    }
  };

  const handleRefresh = () => {
    // window.location.reload()
    onBack();
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/MyList");
  };

  const [formData, setFormData] = React.useState({
    travelRequestId: item.travelRequestId || "",
    issuer: item.issuer || "",
    issuerDate: new Date(item.issuerDate) || null,
    issuerNumber: item.issuerNumber || null,
    email: item.email || "",
    firstName: item.firstName || "",
    lastName: item.lastName || "",
    employeeNumber: item.employeeNumber || "",
    costCenter: item.costCenter || "",
    entity: item.entity || "",
    positionTitle: item.positionTitle || "",
    travelType: item.travelType || "",
    travelPurpose: item.travelPurpose || "",
    participants: item.participants || "",
    destination: item.destination || "",
    travelDepartureDate: new Date(item.travelDepartureDate) || null,
    travelArrivalDate: new Date(item.travelArrivalDate) || null,
    travelEstimatedDuration: item.travelEstimatedDuration || null,
    travelCurrency: item.travelCurrency,
    travelNote: item.travelNote || null,
    travelBudget: item.travelBudget || null,
    flightTicketReason: item.flightTicketReason,
    flightTicketType: item.flightTicketType,
    carRentalFrom: item.carRentalFrom || "",
    carRentalTo: item.carRentalTo || "",
    carRentalOn: new Date(item.carRentalOn) || null,
    carRentalUntil: new Date(item.carRentalUntil) || null,
    carRentalBirthDate: new Date(item.carRentalBirthDate) || null,
    carDrivingLicense: item.carDrivingLicense || "",
    carRentalCategory: item.carRentalCategory || "",
    carRentalNote: item.carRentalNote || "",
    personalCarDrivingLicenseNumber: item.personalCarDrivingLicenseNumber || "",
    personalCarRegistrationNumber: item.personalCarRegistrationNumber || "",
    personalCarNote: item.personalCarNote || "",
    trainTicketType: item.trainTicketType,
    hotelLocation: item.hotelLocation || "",
    hotelNumberOfNights: item.hotelNumberOfNights || null,
    hotelCheckIn: item.hotelCheckIn ? new Date(item.hotelCheckIn) : null,
    hotelCheckOut: item.hotelCheckOut ? new Date(item.hotelCheckOut) : null,
    hotelNote: item.hotelNote || "",
    manager: item.manager || "",
    hod: item.hod || "",
    itineraryRelation: itineraries,
    attachmentRelation: attachments,
    // itineraryRelation: Array.isArray(travelInfo) ? travelInfo : []
  });

  const setTimeZone = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 6);
    return date;
  };

  const formatFormData = (data) => {
    return {
      ...data,
      itineraryRelation: data.itineraryRelation.map((itinerary) => ({
        id: itinerary.id || null,
        r_itineraryRelation_c_travelInfoId:
          itinerary.r_itineraryRelation_c_travelInfoId,
        onwardJourney: itinerary.onwardJourney,
        onwardDepartureDate: itinerary.onwardDepartureDate
          ? setTimeZone(new Date(itinerary.onwardDepartureDate).toISOString())
          : null,
        onwardPreferredTime: itinerary.onwardPreferredTime,
        onwardJourneyNote: itinerary.onwardJourneyNote,
        onwardTransportNumber: itinerary.onwardTransportNumber,
        returnJourney: itinerary.returnJourney,
        returnArrivalDate: itinerary.returnArrivalDate
          ? setTimeZone(new Date(itinerary.returnArrivalDate).toISOString())
          : null,
        returnPreferredTime: itinerary.returnPreferredTime,
        returnTransportNumber: itinerary.returnTransportNumber,
      })),
      attachmentRelation: attachments.map((attachment) => ({
        id: attachment.id || null,
        r_attachmentRelation_c_travelInfoId:
          attachment.r_attachmentRelation_c_travelInfoId,
        title: attachment.title,
        fileId: attachment.fileId,
        contentUrl: attachment.contentUrl,
      })),
    };
  };

  const handleFormSubmit = async () => {
    console.log("Submitting formData:", formData);
    const formattedData = formatFormData(formData);
    setLoadingNew(true);
    try {
      let response;
      if (item.id) {
        // If item.id exists, update the record
        response = await TravelRequestFormService.updateFormData(
          item.id,
          formattedData
        );
        // setMessage(`Successfully updated Id : ${response.data.id}`);
        showMessage(
          "success",
          "Success",
          `Successfully updated Id : ${response.data.travelRequestId}`
        );
        console.log("Navigating to MyList");
        setTimeout(() => {
          // navigate("/MyList");
          onBack();
        }, 1000);
      }
      // setOpen(true);
    } catch (error) {
      console.error("Error submitting form", error);
      // setMessage(`Error response : ${error.response.data.title}`);
      showMessage(
        "error",
        "Error",
        `Error response : ${error.response.data.title}`
      );
      // setOpen(true);
    } finally {
      setLoadingNew(false);
    }
  };

  const toast = useRef(null);

  const showMessage = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 10000 });
  };

  const OnwardJourneyLink = (rowData) => {
    console.log("url : ", rowData.contentUrl);
    let urlObj = new URL(rowData.contentUrl, `${process.env.REACT_APP_API_LIFERAY_BASE_URL}`);
    urlObj.searchParams.delete("download");
    let newUrl = urlObj.toString();
    console.log("new url : ", newUrl);

    return newUrl;
  };

  const formatPickList = (data) => {
    if (!data) return "";
    return data.name;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          Loading
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      </div>
    );
  }
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      // second: '2-digit',
      hour12: false, // You can set this to true if you want 12-hour time format
      timeZone: "Asia/Kolkata",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
  };

  const handleTransition = async (transitionName) => {
    console.log("current task", currentTask);
    if (!currentTask) {
      // alert('No task available to perform the action.');
      showMessage(
        "warn",
        "Warning",
        "No task available to perform the action."
      );
      return;
    }

    const { id: workflowTaskId } = currentTask;
    const payload = {
      comment: transitionName.charAt(0).toUpperCase() + transitionName.slice(1),
      transitionName,
      workflowTaskId,
    };

    setLoadingNew(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_LIFERAY_BASE_URL}/o/headless-admin-workflow/v1.0/workflow-tasks/${workflowTaskId}/change-transition`,
        payload,
        {
          headers: {
            'x-csrf-token': authHeader,
            "Content-Type": "application/json",
          },
        }
      );
      // alert(`${transitionName.charAt(0).toUpperCase() + transitionName.slice(1)} action successful.`);
      showMessage(
        "success",
        "Success",
        `${
          transitionName.charAt(0).toUpperCase() + transitionName.slice(1)
        } action successful.`
      );
      setIsTaskCompleted(true);
      setComment(""); // Clear comment after successful submission
      setIsDialogOpen(false); // Close the dialog
    } catch (err) {
      console.error(`Failed to ${transitionName} task:`, err);
      // alert(`Failed to ${transitionName} task.`);
      showMessage(
        "error",
        "Error",
        `Error response : ${err.response.data.title}`
      );
    } finally {
      setLoadingNew(false);
    }
  };

  const openDialog = (type) => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
    setComment("");
  };

  const handleDialogSubmit = () => {
    if (dialogType === "ok") {
      handleTransition("ok");
      item.approver1Comment = comment;
      TravelRequestFormServiceLayer.updatePatchFormData(item.id, {
        approver1Comment: comment,
      });
    } else if (dialogType === "reject") {
      handleTransition("reject");
      item.approver1Comment = comment;
      TravelRequestFormServiceLayer.updatePatchFormData(item.id, {
        approver1Comment: comment,
      });
    } else if (dialogType === "Approve") {
      handleTransition("Approve");
      item.approver1Comment = comment;
      TravelRequestFormServiceLayer.updatePatchFormData(item.id, {
        approver2Comment: comment,
      });
    } else if (dialogType === "REJECT") {
      handleTransition("REJECT");
      item.approver1Comment = comment;
      TravelRequestFormServiceLayer.updatePatchFormData(item.id, {
        approver2Comment: comment,
      });
    }
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    handleCancel();
  };

  const handleCancel = async () => {
    setLoadingNew(true);
    try {
      if (item.approveStatus?.key === "draft") {
        await TravelRequestFormServiceLayer.updatePatchFormData(item.id, {
          approveStatus: { key: "cancelled" },
        });
      } else if (item.approveStatus?.key === "pendingAtApprover1") {
        await TravelRequestFormServiceLayer.updatePatchFormData(item.id, {
          approveStatus: { key: "cancelled" },
        });
        const currentTask = await fetchWorkflowInstances();
        console.log(currentTask);
        console.log("work insta", currentTask.id);
        await axios.delete(
          `${process.env.REACT_APP_API_LIFERAY_BASE_URL}/o/headless-admin-workflow/v1.0/workflow-instances/${currentTask.id}`,
          {
            headers: {
              'x-csrf-token': authHeader,
              "Content-Type": "application/json",
            },
          }
        );
      }
      showMessage(
        "success",
        "Success",
        `Successfully Cancelled ${item.travelRequestId}`
      );
      setCancelFlag(false);
    } catch (error) {
      console.log("error while deleting : ", error);
      showMessage(
        "error",
        "Error",
        `Error response : ${error.response.data.title}`
      );
    } finally {
      setLoadingNew(false);
    }
  };

  // Determine button visibility
  const isPendingAtApprover1 = item.approveStatus?.key === "pendingAtApprover1";
  const isPendingAtApprover2 = item.approveStatus?.key === "pendingAtApprover2";

  return (
    <div className="summary-container">
      <Toast ref={toast} position="top-center" />
      <div className="summary-content">
        <div className="toolbar-summary">
          <span className="title">Issuer Details</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="summary-label">Issuer:</span>
              <span className="value">{item.issuer || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Issue Date:</span>
              <span className="value">
                {formatDate(item.issuerDate) || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Telephone Number:</span>
              <span className="value">{item.issuerNumber || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* <div className="toolbar-summary">
          <span className="title">Traveler Request</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Travel Request Id:</span>
              <span className="value">{item.travelRequestId || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Employee Name:</span>
              <span className="value">{item.firstName + " " + item.lastName || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Employee Number:</span>
              <span className="value">{item.employeeNumber || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Position Title:</span>
              <span className="value">{item.positionTitle || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Entity:</span>
              <span className="value">{item.entity || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Cost Center:</span>
              <span className="value">{item.costCenter || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Travel Purpose:</span>
              <span className="value">{item.travelPurpose || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Participants:</span>
              <span className="value">{item.participants || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Budget:</span>
              <span className="value">{item.travelBudget || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Approver 1:</span>
              <span className="value">{item.manager || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Approver 2:</span>
              <span className="value">{item.hod || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className="value">{item.approveStatus?.name || 'N/A'}</span>
            </div>
          </div>
        </div>
 */}

        <div className="toolbar-summary">
          <span className="title">Traveler Identification</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="summary-label">Email:</span>
              <span className="value">{item.email || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">First Name:</span>
              <span className="value">{item.firstName || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Last Name:</span>
              <span className="value">{item.lastName || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Employee Number:</span>
              <span className="value">{item.employeeNumber || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Position Title:</span>
              <span className="value">{item.positionTitle || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Entity:</span>
              <span className="value">{item.entity || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Cost Center:</span>
              <span className="value">{item.costCenter || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Travel details</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="summary-label">Travel Request Id:</span>
              <span className="value">{item.travelRequestId || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Travel Type:</span>
              <span className="value">{item.travelType || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Travel Purpose:</span>
              <span className="value">{item.travelPurpose || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Participants:</span>
              <span className="value">{item.participants || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Destination:</span>
              <span className="value">{item.destination || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Departure Date:</span>
              <span className="value">
                {formatDate(item.travelDepartureDate) || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Return Date:</span>
              <span className="value">
                {formatDate(item.travelArrivalDate) || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Estimated Duration:</span>
              <span className="value">
                {item.travelEstimatedDuration || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Currency:</span>
              <span className="value">
                {item.travelCurrency === null
                  ? "N/A"
                  : item.travelCurrency?.name || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Budget:</span>
              <span className="value">{item.travelBudget || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Remarks:</span>
              <span className="value">{item.travelNote || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Approvers</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="summary-label">Approver 1:</span>
              <span className="value">{item.manager || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Approver 2:</span>
              <span className="value">{item.hod || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Status:</span>
              <span className="value">{item.approveStatus?.name || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Hotel</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="summary-label">Location:</span>
              <span className="value">{item.hotelLocation || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Check In:</span>
              <span className="value">
                {" "}
                {formatDateTime(item.hotelCheckIn) || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Check Out:</span>
              <span className="value">
                {" "}
                {formatDateTime(item.hotelCheckOut) || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Number of Nights:</span>
              <span className="value">{item.hotelNumberOfNights || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Remarks:</span>
              <span className="value">{item.hotelNote || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Car Rental</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="summary-label">Category:</span>
              <span className="value">{item.carRentalCategory || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">From:</span>
              <span className="value">{item.carRentalFrom || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">To:</span>
              <span className="value">{item.carRentalTo || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">On:</span>
              <span className="value">
                {formatDate(item.carRentalOn) || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Until:</span>
              <span className="value">
                {formatDate(item.carRentalUntil) || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Birth Date:</span>
              <span className="value">
                {formatDate(item.carRentalBirthDate) || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Driving License:</span>
              <span className="value">{item.carDrivingLicense || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Remarks:</span>
              <span className="value">{item.carRentalNote || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Personal Car</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="summary-label">Car Registration Number:</span>
              <span className="value">
                {item.personalCarRegistrationNumber || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Driving License Number:</span>
              <span className="value">
                {item.personalCarDrivingLicenseNumber || "N/A"}
              </span>
            </div>
            <div className="detail-item">
              <span className="summary-label">Remarks:</span>
              <span className="value">{item.personalCarNote || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Travel Itinerary</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="summary-label">Flight Ticket Type:</span>
              <span className="value">
                {item.flightTicketType && item.flightTicketType.name
                  ? item.flightTicketType.name
                  : "N/A"}
              </span>
            </div>
            <div className="detail-item train-type">
              <span className="summary-label">Train Ticket Type:</span>
              <span className="value">
                {" "}
                {item.trainTicketType && item.trainTicketType.name
                  ? item.trainTicketType.name
                  : "N/A"}
              </span>
            </div>
            {/* <div className="detail-item">
              <span className="label">Reason:</span>
              <span className="value"> {item.flightTicketReason && item.flightTicketReason.name ? item.flightTicketReason.name :
                'N/A'}</span>
            </div> */}
          </div>
        </div>

        {/* <div className="toolbar-summary">
          <span className="title">Train Ticket</span>
        </div> */}
        {/* <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Ticket Type:</span>
              <span className="value"> {item.trainTicketType && item.trainTicketType.name ? item.trainTicketType.name :
                'N/A'}</span>
            </div>
          </div>
        </div> */}

        {/* <div className="toolbar-summary">
          <span className="title">Attachments</span>
        </div> */}
        <hr className="separator mb-2 mt-2" />

        <div className="summary-details">
          <span className="summary-label">Attachments:</span>
          {attachmentInfo.length > 0 ? (
            <ol>
              {attachmentInfo.map((task) => (
                <li key={task.id}>
                  <a
                    href={OnwardJourneyLink(task)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {task.title}
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <p>No available attachments</p>
          )}
        </div>

        <hr className="separator mb-2 mt-2" />

        {/* <div className="toolbar-summary">
          <span className="title">Itineraries</span>
        </div> */}
        <div className="summary-details">
          <DataTable
            value={travelInfo}
            showGridlines
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              sortable
              field="onwardJourney"
              header="Onward Journey (From - To)"
              headerClassName="preview-custom-header"
            />
            <Column
              sortable
              field="onwardDepartureDate"
              header="Departure Date"
              body={(rowData) => formatDate(rowData.onwardDepartureDate)}
              headerClassName="preview-custom-header"
            />
            <Column
              sortable
              field="onwardPreferredTime"
              header="Onward Preferred Time"
              body={(rowData) => formatPickList(rowData.onwardPreferredTime)}
              headerClassName="preview-custom-header"
            />
            <Column
              sortable
              field="onwardTransportNumber"
              header="Onward Flight/Train No"
              headerClassName="preview-custom-header"
            />
            <Column
              sortable
              field="returnJourney"
              header="Return Journey (From - To)"
              headerClassName="preview-custom-header"
            />
            <Column
              sortable
              field="returnArrivalDate"
              header="Arrival Date"
              body={(rowData) => formatDate(rowData.returnArrivalDate)}
              headerClassName="preview-custom-header"
            />
            <Column
              sortable
              field="returnPreferredTime"
              header="Return Preferred Time"
              body={(rowData) => formatPickList(rowData.returnPreferredTime)}
              headerClassName="preview-custom-header"
            />
            <Column
              sortable
              field="returnTransportNumber"
              header="Return Flight/Train No"
              headerClassName="preview-custom-header"
            />
            <Column
              sortable
              field="onwardJourneyNote"
              header="Remarks"
              headerClassName="preview-custom-header"
            />
          </DataTable>
        </div>

        <hr className="separator mb-2 mt-2" />

        <div className="summary-details">
          <div className="detail-item">
            <span className="summary-label">Reason:</span>
            <span className="value">
              {" "}
              {item.flightTicketReason && item.flightTicketReason.name
                ? item.flightTicketReason.name
                : "N/A"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "end" }}>
          <div className="gap-2" style={{ display: "flex" }}>
            <Button
              type="button"
              className="back-buttons"
              icon={<KeyboardDoubleArrowLeftIcon />}
              label="Back"
              rounded
              onClick={handleRefresh}
            />
            {item.approveStatus?.key === "draft" &&
              cancelFlag &&
              !isDashboardNavigate && (
                // <button className="back-button" onClick={handleCancel}>Cancel</button>
                <Button
                  type="button"
                  className="back-buttons"
                  disabled={loadingNew}
                  onClick={handleFormSubmit}
                  label="Submit"
                />
              )}
            {(item.approveStatus?.key === "draft" ||
              item.approveStatus?.key === "pendingAtApprover1") &&
              cancelFlag &&
              !isDashboardNavigate && (
                // <button className="back-button" onClick={handleCancel}>Cancel</button>
                <Button
                  className="back-buttons"
                  disabled={loadingNew}
                  onClick={() => setDialogOpen(true)}
                  label="Cancel"
                />
              )}
            {loadingNew && (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            )}
            <CancelDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onConfirm={handleConfirm}
            />
          </div>
          {/* </div> */}

          {isDashboardNavigate && (
            <div
              className="gap-3"
              style={{ display: "flex", justifyContent: "right" }}
            >
              {isPendingAtApprover1 &&
                currentEmailAddress === item.manager &&
                !isTaskCompleted && (
                  <>
                    <div>
                      <Button
                        className="back-button"
                        onClick={() => openDialog("ok")}
                        label="Approve"
                      />
                    </div>
                    <div>
                      <Button
                        className="back-button"
                        onClick={() => openDialog("reject")}
                        label="Reject"
                      />
                    </div>
                  </>
                )}
              {isPendingAtApprover2 &&
                currentEmailAddress === item.hod &&
                !isTaskCompleted && (
                  <>
                    <div>
                      <Button
                        className="back-button"
                        onClick={() => openDialog("Approve")}
                        label="Approve"
                      />
                    </div>
                    <div>
                      <Button
                        className="back-button"
                        onClick={() => openDialog("REJECT")}
                        label="Reject"
                      />
                    </div>
                  </>
                )}
            </div>
          )}
        </div>
        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h2>
                {dialogType === "ok" || dialogType === "Approve"
                  ? "Approve"
                  : "Reject"}
              </h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here..."
              />
              <div className="dialog-buttons">
                <button className="cancel-dialog" onClick={handleDialogCancel}>
                  Cancel
                </button>
                <button
                  className="done-dialog"
                  disabled={loadingNew}
                  onClick={handleDialogSubmit}
                >
                  Done
                </button>
                {loadingNew && (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSummary;

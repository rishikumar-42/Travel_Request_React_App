import React, { useState, useEffect, useRef } from 'react';
import "../assets/css/NewSummary.css";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import TravelRequestFormServiceLayer from '../service/TravelRequestFormService';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const NewSummary = ({ item = {}, travelInfo = [], attachmentInfo = [], onBack, isDashboardNavigate = false }) => {
  const [workflowTasks, setWorkflowTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [cancelFlag, setCancelFlag] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'approve' or 'reject'
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true); 


  const { auth, login } = useAuth(); // Access auth from context
  const { username, password } = auth;
  const authHeader = 'Basic ' + btoa(username + ':' + password);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword && (username !== storedUsername || password !== storedPassword)) {
      login(storedUsername, storedPassword);
    }
  }, [login, username, password]);

  useEffect(() => {
    const fetchWorkflowTasks = async () => {
      setLoading(true); 
      try {
        const response = await fetch('http://localhost:8080/o/headless-admin-workflow/v1.0/workflow-tasks/assigned-to-me', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': authHeader,
          },
        });
        const data = await response.json();
        console.log("data : ", data)
        const task = data.items.find(task => task.objectReviewed.id === item.id);
        console.log("task", task);
        setCurrentTask(task);
        setWorkflowTasks(data.items || []);
        setIsTaskCompleted(!!task && task.completed);
        return task;
      } catch (err) {
        console.error('Failed to fetch workflow tasks:', err);
      }
      finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchWorkflowTasks();
  }, [authHeader, item.id]);


  const fetchWorkflowInstances = async () => {
    try {
      const response = await fetch('http://localhost:8080/o/headless-admin-workflow/v1.0/workflow-instances', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader,
        },
      });
      const data = await response.json();
      console.log("data : ", data)
      const task = data.items.find(task => task.objectReviewed.id === item.id);
      console.log("task", task);
      // setCurrentTask(task);
      // setWorkflowTasks(data.items || []);
      // setIsTaskCompleted(!!task && task.completed);
      return task;
    } catch (err) {
      console.error('Failed to fetch workflow tasks:', err);
    }
  };



  const handleRefresh = () => {
    window.location.reload();
  };

  const toast = useRef(null);

  const showMessage = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 10000 });
  }


  const OnwardJourneyLink = (rowData) => {

    console.log("url : ", rowData.contentUrl)
    let urlObj = new URL(rowData.contentUrl, "http://localhost:8080");
    urlObj.searchParams.delete('download');
    let newUrl = urlObj.toString();
    console.log("new url : ", newUrl)

    return newUrl
  };

  const formatPickList = (data) => {
    if (!data) return '';
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
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false, // You can set this to true if you want 12-hour time format
      timeZone: 'Asia/Kolkata' 
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
  };

  const handleTransition = async (transitionName) => {
    console.log("current task",currentTask);
    if (!currentTask) {
      // alert('No task available to perform the action.');
      showMessage('warn', 'Warning', 'No task available to perform the action.');
      return;
    }

    const { id: workflowTaskId } = currentTask;
    const payload = {
      comment: transitionName.charAt(0).toUpperCase() + transitionName.slice(1),
      transitionName,
      workflowTaskId
    };

    try {
      await axios.post(`http://localhost:8080/o/headless-admin-workflow/v1.0/workflow-tasks/${workflowTaskId}/change-transition`, payload, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      // alert(`${transitionName.charAt(0).toUpperCase() + transitionName.slice(1)} action successful.`);
      showMessage('success', 'Success', `${transitionName.charAt(0).toUpperCase() + transitionName.slice(1)} action successful.`);
      setIsTaskCompleted(true);
      setComment(''); // Clear comment after successful submission
      setIsDialogOpen(false); // Close the dialog
    } catch (err) {
      console.error(`Failed to ${transitionName} task:`, err);
      // alert(`Failed to ${transitionName} task.`);
      showMessage('error', 'Error', `Error response : ${err.response.data.title}`)
    }
  };

  const openDialog = (type) => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
    setComment('');
  }

  const handleDialogSubmit = () => {
    if (dialogType === 'ok') {
      handleTransition('ok');
      item.approver1Comment = comment;
      TravelRequestFormServiceLayer.updatePatchFormData(item.id, { approver1Comment: comment });
    } else if (dialogType === 'reject') {
      handleTransition('reject');
      item.approver1Comment = comment;
      TravelRequestFormServiceLayer.updatePatchFormData(item.id, { approver1Comment: comment });
    }
    else if (dialogType === 'Approve') {
      handleTransition('Approve');
      item.approver1Comment = comment;
      TravelRequestFormServiceLayer.updatePatchFormData(item.id, { approver2Comment: comment });
    }
    else if (dialogType === 'REJECT') {
      handleTransition('REJECT');
      item.approver1Comment = comment;
      TravelRequestFormServiceLayer.updatePatchFormData(item.id, { approver2Comment: comment });
    }
  };

  const handleCancel = async () => {
    try {
      if (item.approveStatus?.key === 'draft') {
        await TravelRequestFormServiceLayer.updatePatchFormData(item.id, { approveStatus: { key: "cancelled" } });
      } else if (item.approveStatus?.key === 'pendingAtApprover1') {
        await TravelRequestFormServiceLayer.updatePatchFormData(item.id, { approveStatus: { key: "cancelled" } });
        const currentTask = await fetchWorkflowInstances();
        console.log(currentTask);
        console.log("work insta", currentTask.id)
        await axios.delete(`http://localhost:8080/o/headless-admin-workflow/v1.0/workflow-instances/${currentTask.id}`, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });
      }
      showMessage('success', 'Success', `Successfully Cancelled ${item.travelRequestId}`);
      setCancelFlag(false);
    } catch (error) {
      console.log("error while deleting : ", error)
      showMessage('error', 'Error', `Error response : ${error.response.data.title}`)
    }
  }

  // Determine button visibility
  const isPendingAtApprover1 = item.approveStatus?.key === 'pendingAtApprover1';
  const isPendingAtApprover2 = item.approveStatus?.key === 'pendingAtApprover2';
  const isCurrentUserApprover1 = isPendingAtApprover1 && auth.username === item.manager; // Assuming the current user is approver1
  const isCurrentUserApprover2 = isPendingAtApprover2 && auth.username === item.hod; // Assuming the current user is approver2

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
              <span className="label">Issuer:</span>
              <span className="value">{item.issuer || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Issue Date:</span>
              <span className="value">{formatDate(item.issuerDate) || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Telephone Number:</span>
              <span className="value">{item.issuerNumber || 'N/A'}</span>
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
              <span className="label">Email:</span>
              <span className="value">{item.email || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">First Name:</span>
              <span className="value">{item.firstName || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Last Name:</span>
              <span className="value">{item.lastName || 'N/A'}</span>
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
          </div>
        </div>



        <div className="toolbar-summary">
          <span className="title">Travel details</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Travel Request Id:</span>
              <span className="value">{item.travelRequestId || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Travel Type:</span>
              <span className="value">{item.travelType || 'N/A'}</span>
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
              <span className="label">Destination:</span>
              <span className="value">{item.destination || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Departure Date:</span>
              <span className="value">{formatDate(item.travelDepartureDate) || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Return Date:</span>
              <span className="value">{formatDate(item.travelArrivalDate) || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Estimated Duration:</span>
              <span className="value">{item.travelEstimatedDuration || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Currency:</span>
              <span className="value">{item.travelCurrency === null ? 'N/A' : item.travelCurrency?.key || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Budget:</span>
              <span className="value">{item.travelBudget || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Remarks:</span>
              <span className="value">{item.travelNote || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Approvers</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
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

        {/* <div className="toolbar-summary">
          <span className="title">Travel Details</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Flight Ticket:</span>
              <span className="value">
                {item.flightTicketType && item.flightTicketType.name ? item.flightTicketType.name : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Reason:</span>
              <span className="value"> {item.flightTicketReason && item.flightTicketReason.name ? item.flightTicketReason.name : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Hotel (Number of Nights):</span>
              <span className="value">{item.hotelNumberOfNights || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Train Ticket:</span>
              <span className="value"> {item.trainTicketType && item.trainTicketType.name ? item.trainTicketType.name : 'N/A'}</span>
            </div>
          </div>
        </div> */}
        <div className="toolbar-summary">
          <span className="title">Hotel</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">
                {item.hotelLocation || 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Check In:</span>
              <span className="value"> {formatDateTime(item.hotelCheckIn) || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Check Out:</span>
              <span className="value"> {formatDateTime(item.hotelCheckOut) || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Number of Nights:</span>
              <span className="value">{item.hotelNumberOfNights || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Remarks:</span>
              <span className="value">{item.hotelNote || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Car Rental</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Category:</span>
              <span className="value">{item.carRentalCategory || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">From:</span>
              <span className="value">{item.carRentalFrom || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">To:</span>
              <span className="value">{item.carRentalTo || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">On:</span>
              <span className="value">{formatDate(item.carRentalOn) || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Until:</span>
              <span className="value">{formatDate(item.carRentalUntil) || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Birth Date:</span>
              <span className="value">{formatDate(item.carRentalBirthDate) || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Driving License:</span>
              <span className="value">{item.carRentalDrivingLicense || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Remarks:</span>
              <span className="value">{item.carRentalNote || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Personal Car</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Car Registration Number:</span>
              <span className="value">{item.personalCarRegistrationNumber || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Driving License Number:</span>
              <span className="value">{item.personalCarDrivingLicenseNumber || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Remarks:</span>
              <span className="value">{item.personalCarNote || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Flight Ticket</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Ticket Type:</span>
              <span className="value">
                {item.flightTicketType && item.flightTicketType.name ? item.flightTicketType.name : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Reason:</span>
              <span className="value"> {item.flightTicketReason && item.flightTicketReason.name ? item.flightTicketReason.name :
                'N/A'}</span>
            </div>
          </div>
        </div>


        <div className="toolbar-summary">
          <span className="title">Train Ticket</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Ticket Type:</span>
              <span className="value"> {item.trainTicketType && item.trainTicketType.name ? item.trainTicketType.name :
                'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Attachments</span>
        </div>
        <div className="summary-details">
          {/* <ol> */}
          {/* {attachmentInfo.map(task => (
              <li key={task.id}>
                <a href={OnwardJourneyLink(task)} target="_blank" rel="noopener noreferrer">
                  {task.title}
                </a>
              </li>
            ))} */}
          {attachmentInfo.length > 0 ? <ol>
            {attachmentInfo.map(task => (
              <li key={task.id}>
                <a href={OnwardJourneyLink(task)} target="_blank" rel="noopener noreferrer">
                  {task.title}
                </a>
              </li>
            ))}
          </ol> : (
            <p>No available attachments</p>
          )}
          {/* </ol> */}
        </div>

        <div className="toolbar-summary">
          <span className="title">Itineraries</span>
        </div>
        <div className="summary-details">
          {/* <table className="table-summary">
            <thead className='thead'>
              <tr>
                <th className='table-header'>Onward Journey</th>
                <th className='table-header'>Departure Date</th>
                <th className='table-header'>Preferred Time</th>
                <th className='table-header'>Flight No/Train No</th>
                <th className='table-header'>Return Journey</th>
                <th className='table-header'>Return Arrival Date</th>
                <th className='table-header'>Return Preferred Time</th>
                <th className='table-header'>Return Flight No/Train No</th>
              </tr>
            </thead>
            {Array.isArray(travelInfo) && travelInfo.length > 0 ? (
              <tbody>
                {travelInfo.map((info, index) => (
                  <tr key={index}>
                    <td className='table-row'>{info.onwardJourney || 'N/A'}</td>
                    <td className='table-row'>{formatDate(info.onwardDepartureDate) || 'N/A'}</td>
                    <td className="table-row">{info.onwardPreferredTime && info.onwardPreferredTime.name ? info.onwardPreferredTime.name : 'N/A'}</td>
                    <td className='table-row'>{info.onwardTransportNumber || 'N/A'}</td>
                    <td className='table-row'>{info.returnJourney || 'N/A'}</td>
                    <td className='table-row'>{formatDate(info.returnArrivalDate) || 'N/A'}</td>
                    <td className="table-row">{info.returnPreferredTime && info.returnPreferredTime.name ? info.returnPreferredTime.name : 'N/A'}</td>
                    <td className='table-row'>{info.returnTransportNumber || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="8">No travel information available.</td>
                </tr>
              </tbody>
            )}
          </table> */}
          <DataTable value={travelInfo} showGridlines tableStyle={{ minWidth: '50rem' }}>
            <Column sortable field="onwardJourney" header="Onward Journey (From - To)" headerClassName="preview-custom-header" />
            <Column sortable field="onwardDepartureDate" header="Departure Date" body={(rowData) => formatDate(rowData.onwardDepartureDate)} headerClassName="preview-custom-header" />
            <Column sortable field="onwardPreferredTime" header="Onward Preferred Time" body={(rowData) => formatPickList(rowData.onwardPreferredTime)} headerClassName="preview-custom-header" />
            <Column sortable field="onwardTransportNumber" header="Onward Transport Number" headerClassName="preview-custom-header" />
            <Column sortable field="returnJourney" header="Return Journey (From - To)" headerClassName="preview-custom-header" />
            <Column sortable field="returnArrivalDate" header="Arrival Date" body={(rowData) => formatDate(rowData.returnArrivalDate)} headerClassName="preview-custom-header" />
            <Column sortable field="returnPreferredTime" header="Return Preferred Time" body={(rowData) => formatPickList(rowData.returnPreferredTime)} headerClassName="preview-custom-header" />
            <Column sortable field="returnTransportNumber" header="Return Transport Number" headerClassName="preview-custom-header" />
            <Column sortable field="onwardJourneyNote" header="Remarks" headerClassName="preview-custom-header" />
          </DataTable>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="gap-5" style={{ display: 'flex' }}>
            <button className="back-button" onClick={handleRefresh}>Back</button>
            {(item.approveStatus?.key === 'draft' || item.approveStatus?.key === 'pendingAtApprover1') && cancelFlag && !isDashboardNavigate &&
              <button className="back-button" onClick={handleCancel}>Cancel</button>
            }
          </div>
          {/* </div> */}

          {isDashboardNavigate && (
            <div className="gap-4" style={{ display: 'flex', justifyContent: 'right' }}>

              {(isPendingAtApprover1 && auth.username === item.manager) && !isTaskCompleted && (
                <>
                  <div>
                    <button className="back-button" onClick={() => openDialog('ok')}>Approve</button>
                  </div>
                  <div>
                    <button className="back-button" onClick={() => openDialog('reject')}>Reject</button>
                  </div>
                </>
              )}
              {(isPendingAtApprover2 && auth.username === item.hod) && !isTaskCompleted && (
                <>
                  <div>
                    <button className="back-button" onClick={() => openDialog('Approve')}>Approve</button>
                  </div>
                  <div>
                    <button className="back-button" onClick={() => openDialog('REJECT')}>Reject</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h2>{(dialogType === 'ok' || dialogType === 'Approve' ) ? 'Approve' : 'Reject'}</h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here..."
              />
              <div className="dialog-buttons">
                <button className='cancel-dialog' onClick={handleDialogCancel}>Cancel</button>
                <button className='done-dialog' onClick={handleDialogSubmit}>Done</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default NewSummary;

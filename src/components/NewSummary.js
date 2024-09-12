import React, { useState, useEffect } from 'react';
import "../assets/css/NewSummary.css";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const NewSummary = ({ item = {}, travelInfo = [], onBack, isDashboardNavigate = false }) => {
  const [workflowTasks, setWorkflowTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

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
      try {
        const response = await fetch('http://localhost:8080/o/headless-admin-workflow/v1.0/workflow-tasks/assigned-to-me', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': authHeader,
          },
        });
        const data = await response.json();
        const task = data.items.find(task => task.objectReviewed.id === item.id);
        console.log("task", task);
        setCurrentTask(task);
        setWorkflowTasks(data.items || []);
        setIsTaskCompleted(!!task && task.completed);
      } catch (err) {
        console.error('Failed to fetch workflow tasks:', err);
      }
    };

    fetchWorkflowTasks();
  }, [authHeader, item.id]);

  const handleTransition = async (transitionName) => {
    if (!currentTask) {
      alert('No task available to perform the action.');
      return;
    }

    const {  id: workflowTaskId  } = currentTask;
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
      alert(`${transitionName.charAt(0).toUpperCase() + transitionName.slice(1)} action successful.`);
      setIsTaskCompleted(true);
      // Optionally refresh the tasks or redirect
    } catch (err) {
      console.error(`Failed to ${transitionName} task:`, err);
      alert(`Failed to ${transitionName} task.`);
    }
  };

  // Determine button visibility
  const isPendingAtApprover1 = item.approveStatus?.key === 'pendingAtApprover1';
  const isPendingAtApprover2 = item.approveStatus?.key === 'pendingAtApprover2';
  const isCurrentUserApprover1 = isPendingAtApprover1 && auth.username === item.manager; // Assuming the current user is approver1
  const isCurrentUserApprover2 = isPendingAtApprover2 && auth.username === item.hod; // Assuming the current user is approver2

  return (
    <div className="summary-container">
      <div className="summary-content">
        <div className="toolbar-summary">
          <span className="title">Traveler Request</span>
        </div>
        <div className="summary-details">
          <div className="details-grid">
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

        <div className="toolbar-summary">
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
        </div>

        <div className="toolbar-summary">
          <span className="title">Car Rental Details</span>
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
              <span className="value">{item.carRentalOn || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Until:</span>
              <span className="value">{item.carRentalUntil || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Birth Date:</span>
              <span className="value">{item.carRentalBirthDate || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Driving License:</span>
              <span className="value">{item.carRentalDrivingLicense || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-summary">
          <span className="title">Personal Car Details</span>
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
           </div>
         </div>

        <div className="summary-details">
          <table className="table-summary">
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
                    <td className='table-row'>{info.onwardDepartureDate || 'N/A'}</td>
                    <td className="table-row">{info.onwardPreferredTime && info.onwardPreferredTime.name ? info.onwardPreferredTime.name : 'N/A'}</td>
                    <td className='table-row'>{info.onwardTransportNumber || 'N/A'}</td>
                    <td className='table-row'>{info.returnJourney || 'N/A'}</td>
                    <td className='table-row'>{info.returnArrivalDate || 'N/A'}</td>
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
          </table>
        </div>

        <button className="back-button" onClick={onBack}>Back</button>

        {isDashboardNavigate && (
          <div className="action-buttons">
          
            {(isPendingAtApprover1 && auth.username === item.manager ) && !isTaskCompleted &&(
              <>
                <div>
                <button className="approve-button" onClick={() => handleTransition('ok')}>Approver1</button>
                </div>
                <div className='Rejectbtn'>
                <button className="reject-button" onClick={() => handleTransition('reject')}>Reject</button>
                </div>
              </>
            )}
            {(isPendingAtApprover2 && auth.username === item.hod) && !isTaskCompleted &&(
              <>
               <div>
                <button className="approve-button" onClick={() => handleTransition('Approve')}>Approver2</button>
                </div>
                <div className='Rejectbtn'>
                <button className="reject-button" onClick={() => handleTransition('REJECT')}>Reject</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSummary;

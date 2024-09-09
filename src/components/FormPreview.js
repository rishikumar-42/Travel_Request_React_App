
import React from 'react';
import "../assets/css/FormPreview.css";
// import Divider from '@mui/joy/Divider';

const FormPreview = ({ item, travelInfo }) => {

    const formatDate = (date) => {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
    };

    const formatDateTime = (date) => {
        if (!date) return '';
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // You can set this to true if you want 12-hour time format
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
    };

    return (
        <div className="summary-container">
            <div className="summary-content">
                <div className="toolbar">
                    <span className="title">Issuer</span>
                </div>
                <div className="summary-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Issuer Name:</span>
                            <span className="value">{item.issuer || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Issuer Date:</span>
                            <span className="value">{formatDate(item.issuerDate) || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Issuer Number:</span>
                            <span className="value">{item.issuerNumber || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="toolbar">
                    <span className="title">Traveler Identification</span>
                </div>
                <div className="summary-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Employee First Name:</span>
                            <span className="value">{item.firstName || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Employee Last Name:</span>
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

                <div className="toolbar">
                    <span className="title">Travel details</span>
                </div>
                <div className="summary-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Travel Type:</span>
                            <span className="value">{item.travelType || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Travel Purpose:</span>
                            <span className="value">{item.travelPurpose || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Travel Participants:</span>
                            <span className="value">{item.participants || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Travel Destination:</span>
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
                            <span className="value">{item.travelCurrency === null ? 'N/A' : item.travelCurrency.key}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Budget Amount:</span>
                            <span className="value">{item.travelBudget || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Travel Note:</span>
                            <span className="value">{item.travelNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="toolbar">
                    <span className="title">Approvers</span>
                </div>
                <div className="summary-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Manager:</span>
                            <span className="value">{item.manager || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Head Of Department/GM/VP:</span>
                            <span className="value">{item.hod || 'N/A'}</span>
                        </div>
                    </div>
                </div>


                <div className="toolbar">
                    <span className="title">Hotel</span>
                </div>
                <div className="summary-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Location:</span>
                            <span className="value">{item.hotelLocation || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Check In:</span>
                            <span className="value">{formatDateTime(item.hotelCheckIn) || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Check Out:</span>
                            <span className="value">{formatDateTime(item.hotelCheckOut) || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Number of Nights:</span>
                            <span className="value">{item.hotelNumberOfNights || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Note:</span>
                            <span className="value">{item.hotelNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="toolbar">
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
                            <span className="value">{item.carRentalOn || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Until:</span>
                            <span className="value">{item.carRentalUntil || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">BirthDate:</span>
                            <span className="value">{formatDate(item.carRentalBirthDate) || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Driving License:</span>
                            <span className="value">{item.carDrivingLicense || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Note:</span>
                            <span className="value">{item.carRentalNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="toolbar">
                    <span className="title">Personal Car</span>
                </div>
                <div className="summary-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Registration Number:</span>
                            <span className="value">{item.personalCarRegistrationNumber || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Driving License:</span>
                            <span className="value">{item.personalCarDrivingLicenseNumber || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Note:</span>
                            <span className="value">{item.personalCarNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="toolbar">
                    <span className="title">Flight Ticket</span>
                </div>
                <div className="summary-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Flight Ticket:</span>
                            <span className="value">
                                {item.flightTicketType !== null ? item.flightTicketType.key : 'N/A'}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Reason:</span>
                            <span className="value"> {item.flightTicketReason !== null ? item.flightTicketReason.key : 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="toolbar">
                    <span className="title">Train Ticket</span>
                </div>
                <div className="summary-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Train Ticket:</span>
                            <span className="value"> {item.trainTicketType !== null ? item.trainTicketType.key : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="toolbar">
                    <span className="title">Itineraries</span>
                </div>
                <div className="summary-details">
                    <table className="table">
                        <thead className='thead'>
                            <tr>
                                <th className='table-header'>Onward Journey</th>
                                <th className='table-header'>Departure Date</th>
                                <th className='table-header'>Onward Preferred Time</th>
                                <th className='table-header'>Onward Transport Number</th>
                                <th className='table-header'>Return Journey</th>
                                <th className='table-header'>Arrival Date</th>
                                <th className='table-header'>Return Preferred Time</th>
                                <th className='table-header'>Return Transport Number</th>
                                <th className='table-header'>Note</th>
                            </tr>
                        </thead>
                        {Array.isArray(travelInfo) && travelInfo.length > 0 ? (
                            <tbody>
                                {travelInfo.map((info, index) => (
                                    <tr key={index}>
                                        <td className='table-row'>{info.onwardJourney || 'N/A'}</td>
                                        <td className='table-row'>{formatDate(info.onwardDepartureDate) || 'N/A'}</td>
                                        <td className='table-row'>{info.onwardPreferredTime !== '' ? info.onwardPreferredTime.name : 'N/A'}</td>
                                        <td className='table-row'>{info.onwardTransportNumber || 'N/A'}</td>
                                        <td className='table-row'>{info.returnJourney || 'N/A'}</td>
                                        <td className='table-row'>{formatDate(info.returnArrivalDate) || 'N/A'}</td>
                                        <td className='table-row'>{info.returnPreferredTime !== '' ? info.returnPreferredTime.name : 'N/A'}</td>
                                        <td className='table-row'>{info.returnTransportNumber || 'N/A'}</td>
                                        <td className='table-row'>{info.onwardJourneyNote || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <div>No travel information available.</div>
                        )}
                    </table>
                </div>
            </div>
            {/* <button className="back-button" onClick={onBack}>
        &larr; Back
      </button> */}
            {/* {isPending && (
              <>
                <button className="approve-button">
                  Approve
                </button>

                <button className="reject-button">
                  Reject
                </button>
              </>
            )} */}
        </div>
    );
};

export default FormPreview;
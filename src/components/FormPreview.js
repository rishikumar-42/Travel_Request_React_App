
import React from 'react';
import "../assets/css/FormPreview.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import Divider from '@mui/joy/Divider';

const FormPreview = ({ item, travelInfo, attachments }) => {

    console.log("item : ", item)
    const OnwardJourneyLink = (rowData) => {

        console.log("url : ", rowData.contentUrl)
        let urlObj = new URL(rowData.contentUrl, "http://localhost:8080");
        urlObj.searchParams.delete('download');
        let newUrl = urlObj.toString();
        console.log("new url : ", newUrl)

        return newUrl
    };

    const formatDate = (date) => {
        if (!date) return '';
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
    };
    const formatPickList = (data) => {
        if (!data) return '';
        return data.name;
    };

    const formatDateTime = (date) => {
        if (!date) return '';
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            // second: '2-digit',
            hour12: false, // You can set this to true if you want 12-hour time format
            timeZone: 'Asia/Kolkata'
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
    };

    return (
        <div className="preview-summary-container">
            <div className="preview-summary-content">
                <div className="preview-toolbar">
                    <span className="preview-title">Issuer Details</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Issuer:</span>
                            <span className="preview-value">{item.issuer || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Issue Date:</span>
                            <span className="preview-value">{formatDate(item.issuerDate) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Telephone Number:</span>
                            <span className="preview-value">{item.issuerNumber || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="preview-toolbar">
                    <span className="preview-title">Traveler Identification</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Email:</span>
                            <span className="preview-value">{item.email || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">First Name:</span>
                            <span className="preview-value">{item.firstName || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Last Name:</span>
                            <span className="preview-value">{item.lastName || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Employee Number:</span>
                            <span className="preview-value">{item.employeeNumber || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Position Title:</span>
                            <span className="preview-value">{item.positionTitle || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Entity:</span>
                            <span className="preview-value">{item.entity || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Cost Center:</span>
                            <span className="preview-value">{item.costCenter || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="preview-toolbar">
                    <span className="preview-title">Travel details</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Travel Type:</span>
                            <span className="preview-value">{item.travelType || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Travel Purpose:</span>
                            <span className="preview-value">{item.travelPurpose || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Travel Participants:</span>
                            <span className="preview-value">{item.participants || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Travel Destination:</span>
                            <span className="preview-value">{item.destination || 'N/A'}</span>
                        </div>
                        {/* <div className="preview-detail-item">
                            <span className="preview-label">Departure Date:</span>
                            <span className="preview-value">{formatDate(item.travelDepartureDate) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Return Date:</span>
                            <span className="preview-value">{formatDate(item.travelArrivalDate) || 'N/A'}</span>
                        </div> */}
                        <div className="preview-detail-item">
                            <span className="preview-label">Estimated Duration:</span>
                            <span className="preview-value">{item.travelEstimatedDuration || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Currency:</span>
                            <span className="preview-value">{item.travelCurrency === null ? 'N/A' : item.travelCurrency.name}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Budget Amount:</span>
                            <span className="preview-value">{item.travelBudget || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Remarks:</span>
                            <span className="preview-value">{item.travelNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="preview-toolbar">
                    <span className="preview-title">Approvers</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Manager:</span>
                            <span className="preview-value">{item.manager || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Head Of Department/GM/VP:</span>
                            <span className="preview-value">{item.hod || 'N/A'}</span>
                        </div>
                    </div>
                </div>


                <div className="preview-toolbar">
                    <span className="preview-title">Hotel</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Location:</span>
                            <span className="preview-value">{item.hotelLocation || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Check In:</span>
                            <span className="preview-value">{item.hotelCheckIn !== null ? formatDateTime(item.hotelCheckIn) : 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Check Out:</span>
                            <span className="preview-value">{item.hotelCheckOut !== null ? formatDateTime(item.hotelCheckOut) : 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Number of Nights:</span>
                            <span className="preview-value">{item.hotelNumberOfNights || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Remarks:</span>
                            <span className="preview-value">{item.hotelNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="preview-toolbar">
                    <span className="preview-title">Car Rental</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Category:</span>
                            <span className="preview-value">{item.carRentalCategory || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">From:</span>
                            <span className="preview-value">{item.carRentalFrom || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">To:</span>
                            <span className="preview-value">{item.carRentalTo || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">On:</span>
                            <span className="preview-value">{item.carRentalOn instanceof Date && !isNaN(item.carRentalOn) ? formatDate(item.carRentalOn) : 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Until:</span>
                            <span className="preview-value">{item.carRentalUntil instanceof Date && !isNaN(item.carRentalUntil) ? formatDate(item.carRentalUntil) : 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">BirthDate:</span>
                            <span className="preview-value">{item.carRentalBirthDate instanceof Date && !isNaN(item.carRentalBirthDate) ? formatDate(item.carRentalBirthDate) : 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Driving License:</span>
                            <span className="preview-value">{item.carDrivingLicense || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Remarks:</span>
                            <span className="preview-value">{item.carRentalNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="preview-toolbar">
                    <span className="preview-title">Personal Car</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Registration Number:</span>
                            <span className="preview-value">{item.personalCarRegistrationNumber || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Driving License:</span>
                            <span className="preview-value">{item.personalCarDrivingLicenseNumber || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Remarks:</span>
                            <span className="preview-value">{item.personalCarNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="preview-toolbar">
                    <span className="preview-title">Travel Itinerary</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Flight Ticket Type:</span>
                            <span className="preview-value">
                                {item.flightTicketType !== null && item.flightTicketType !== undefined ? (typeof item.flightTicketType === 'object' ? item.flightTicketType.name : item.flightTicketType) : 'N/A'}
                            </span>
                        </div>
                        <div className="detail-item preview-train-type" >
                            <span className="preview-label">Train Ticket Type:</span>
                            <span className="preview-value"> {item.trainTicketType && item.trainTicketType !== undefined ? (typeof item.trainTicketType === 'object' ? item.trainTicketType.name : item.trainTicketType) : 'N/A'}</span>
                        </div>
                        {/* <div className="preview-detail-item">
                            <span className="preview-label">Reason:</span>
                            <span className="preview-value"> {item.flightTicketReason !== null ? item.flightTicketReason.name : 'N/A'}</span>
                        </div> */}
                    </div>
                </div>
                {/* <div className="preview-toolbar">
                    <span className="preview-title">Train Ticket</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Ticket Type:</span>
                            <span className="preview-value"> {item.trainTicketType !== null ? item.trainTicketType.name : 'N/A'}</span>
                        </div>
                    </div>
                </div> */}

                {/* <div className="preview-toolbar">
                    <span className="preview-title">Attachments</span>
                </div> */}
                <hr className="separator mb-2 mt-2" />

                <div className="preview-summary-details">
                    <span className="preview-label">Attachments:</span>
                    {attachments.length > 0 ? <ol>
                        {attachments.map(task => (
                            <li key={task.id}>
                                {/* {task.title} */}
                                <a href={OnwardJourneyLink(task)} target="_blank" rel="noopener noreferrer">
                                    {task.title}
                                </a>
                            </li>
                        ))}
                    </ol> : (
                        <p>No available attachments</p>
                    )}
                </div>
                {/* <div className="preview-toolbar">
                    <span className="preview-title">Itineraries</span>
                </div> */}
                <hr className="separator mb-2 mt-2" />


                <div className="preview-summary-details">
                    <DataTable value={travelInfo} className='previewDataTable' showGridlines tableStyle={{ minWidth: '50rem' }}>
                        <Column sortable field="onwardJourney" header="Onward Journey (From - To)" headerClassName="preview-custom-header" />
                        <Column sortable field="onwardDepartureDate" header="Departure Date" body={(rowData) => formatDate(rowData.onwardDepartureDate)} headerClassName="preview-custom-header" />
                        <Column sortable field="onwardPreferredTime" header="Onward Preferred Time" body={(rowData) => formatPickList(rowData.onwardPreferredTime)} headerClassName="preview-custom-header" />
                        <Column sortable field="onwardTransportNumber" header="Onward Flight/Train No" headerClassName="preview-custom-header" />
                        <Column sortable field="returnJourney" header="Return Journey (From - To)" headerClassName="preview-custom-header" />
                        <Column sortable field="returnArrivalDate" header="Arrival Date" body={(rowData) => formatDate(rowData.returnArrivalDate)} headerClassName="preview-custom-header" />
                        <Column sortable field="returnPreferredTime" header="Return Preferred Time" body={(rowData) => formatPickList(rowData.returnPreferredTime)} headerClassName="preview-custom-header" />
                        <Column sortable field="returnTransportNumber" header="Return Flight/Train No" headerClassName="preview-custom-header" />
                        <Column sortable field="onwardJourneyNote" header="Remarks" headerClassName="preview-custom-header" />
                    </DataTable>
                </div>
                <hr className="separator mb-2 mt-2" />

                <div className="summary-details">
                    <div className="detail-item">
                        <span className="preview-label">Reason:</span>
                        <span className="preview-value"> {item.flightTicketReason && item.flightTicketReason !== undefined ? (typeof item.flightTicketReason === 'object' ? item.flightTicketReason.name : item.flightTicketReason) : 'N/A'}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FormPreview;
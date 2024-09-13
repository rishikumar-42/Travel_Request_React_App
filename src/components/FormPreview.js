
import React from 'react';
import "../assets/css/FormPreview.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import Divider from '@mui/joy/Divider';

const FormPreview = ({ item, travelInfo, attachments }) => {

    const formatDate = (date) => {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
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
        <div className="preview-summary-container">
            <div className="preview-summary-content">
                <div className="preview-toolbar">
                    <span className="preview-title">Issuer</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Issuer Name:</span>
                            <span className="preview-value">{item.issuer || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Issuer Date:</span>
                            <span className="preview-value">{formatDate(item.issuerDate) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Issuer Number:</span>
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
                            <span className="preview-label">Employee First Name:</span>
                            <span className="preview-value">{item.firstName || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Employee Last Name:</span>
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
                        <div className="preview-detail-item">
                            <span className="preview-label">Departure Date:</span>
                            <span className="preview-value">{formatDate(item.travelDepartureDate) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Return Date:</span>
                            <span className="preview-value">{formatDate(item.travelArrivalDate) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Estimated Duration:</span>
                            <span className="preview-value">{item.travelEstimatedDuration || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Currency:</span>
                            <span className="preview-value">{item.travelCurrency === null ? 'N/A' : item.travelCurrency.key}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Budget Amount:</span>
                            <span className="preview-value">{item.travelBudget || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Travel Note:</span>
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
                            <span className="preview-value">{formatDateTime(item.hotelCheckIn) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Check Out:</span>
                            <span className="preview-value">{formatDateTime(item.hotelCheckOut) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Number of Nights:</span>
                            <span className="preview-value">{item.hotelNumberOfNights || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Note:</span>
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
                            <span className="preview-value">{formatDate(item.carRentalOn) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Until:</span>
                            <span className="preview-value">{formatDate(item.carRentalUntil) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">BirthDate:</span>
                            <span className="preview-value">{formatDate(item.carRentalBirthDate) || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Driving License:</span>
                            <span className="preview-value">{item.carDrivingLicense || 'N/A'}</span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Note:</span>
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
                            <span className="preview-label">Note:</span>
                            <span className="preview-value">{item.personalCarNote || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="preview-toolbar">
                    <span className="preview-title">Flight Ticket</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Flight Ticket:</span>
                            <span className="preview-value">
                                {item.flightTicketType !== null ? item.flightTicketType.key : 'N/A'}
                            </span>
                        </div>
                        <div className="preview-detail-item">
                            <span className="preview-label">Reason:</span>
                            <span className="preview-value"> {item.flightTicketReason !== null ? item.flightTicketReason.key : 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="preview-toolbar">
                    <span className="preview-title">Train Ticket</span>
                </div>
                <div className="preview-summary-details">
                    <div className="preview-details-grid">
                        <div className="preview-detail-item">
                            <span className="preview-label">Train Ticket:</span>
                            <span className="preview-value"> {item.trainTicketType !== null ? item.trainTicketType.key : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="preview-toolbar">
                    <span className="preview-title">Attachments</span>
                </div>
                <div className="preview-summary-details">
                    <ol>
                        {attachments.map(task => (
                            <li key={task.id}>
                                {task.title}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="preview-toolbar">
                    <span className="preview-title">Itineraries</span>
                </div>
                <div className="preview-summary-details">
                    <DataTable value={travelInfo} showGridlines tableStyle={{ minWidth: '50rem' }}>
                        {/*<Column sortable field="price" header="Price incl. VAT" /> */}
                        <Column sortable field="onwardJourney" header="Onward Journey" headerClassName="preview-custom-header" />
                        <Column sortable field="onwardDepartureDate" header="Departure Date" body={(rowData) => formatDate(rowData.onwardDepartureDate)} headerClassName="preview-custom-header" />
                        <Column sortable field="onwardPreferredTime" header="Onward Preferred Time" body={(rowData) => formatPickList(rowData.onwardPreferredTime)} headerClassName="preview-custom-header" />
                        <Column sortable field="onwardTransportNumber" header="Onward Transport Number" headerClassName="preview-custom-header" />
                        <Column sortable field="returnJourney" header="Return Journey" headerClassName="preview-custom-header" />
                        <Column sortable field="returnArrivalDate" header="Arrival Date" body={(rowData) => formatDate(rowData.returnArrivalDate)} headerClassName="preview-custom-header" />
                        <Column sortable field="returnPreferredTime" header="Return Preferred Time" body={(rowData) => formatPickList(rowData.returnPreferredTime)} headerClassName="preview-custom-header" />
                        <Column sortable field="returnTransportNumber" header="Return Transport Number" headerClassName="preview-custom-header" />
                        <Column sortable field="onwardJourneyNote" header="Note" headerClassName="preview-custom-header" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default FormPreview;
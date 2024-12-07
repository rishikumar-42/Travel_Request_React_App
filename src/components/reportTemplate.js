// ReportTemplate.js
import React, { useState, useEffect, useRef } from "react";
import '../assets/css/reportTemplate.css'
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const ReportTemplate = ({
  item = {},
  travelInfo = [],
  attachmentInfo = [],
}) => {
  console.log("Itinerary : " + travelInfo)
  const [itineraries, setItineraries] = useState(
    Array.isArray(travelInfo) ? travelInfo : []
  );
  console.log("Itineraries : " + JSON.stringify(itineraries))


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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
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

  return (
    <div id='report' className="report-container">
      <h2>Amphenol</h2>
      <div className="section">
        <span style={{ float: 'right' }}>Travel Request Id : {item.travelRequestId}</span>
        <div className="field-row" ><div className="field-group"/></div>
      </div>

      {/* Part 1 */}
      <div className="section">
        <div className="section-header">Traveler Identification</div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Email</label>
            <span className="field-value" id="field1">{item.email}</span>
          </div>
          <div className="field-group">
            <label className="field-label">First Name</label>
            <span className="field-value" id="field2">{item.firstName}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Last Name</label>
            <span className="field-value" id="field3">{item.lastName}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Emp No.</label>
            <span className="field-value" id="field4">{item.employeeNumber}</span>
          </div>
        </div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Position Titlte</label>
            <span className="field-value" id="field1">{item.positionTitle}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Entity</label>
            <span className="field-value" id="field2">{item.entity}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Cost Center</label>
            <span className="field-value" id="field3">{item.costCenter}</span>
          </div>
        </div>
      </div>
      {/* Part 2 */}
      <div className="section">
        <div className="section-header">Travel details</div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Travel Type</label>
            <span className="field-value" id="part2field1">{item.travelType}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Travel Purpose</label>
            <span className="field-value" id="part2field2">{item.travelPurpose}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Participants</label>
            <span className="field-value" id="part2field3">{item.participants || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Destination</label>
            <span className="field-value" id="part2field4">{item.destination || "N/A"}</span>
          </div>
        </div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Departure Date</label>
            <span className="field-value" id="part2field5">{formatDate(item.travelDepartureDate) || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Return Date</label>
            <span className="field-value" id="part2field5">{formatDate(item.travelArrivalDate) || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Estimated Duration</label>
            <span className="field-value" id="part2field5">{item.travelEstimatedDuration || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Currency</label>
            <span className="field-value" id="part2field5">{item.travelCurrency === null
              ? "N/A"
              : item.travelCurrency?.name || "N/A"}</span>
          </div>
        </div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Budget</label>
            <span className="field-value" id="part2field5">{item.travelBudget || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Remarks</label>
            <span className="field-value" id="part2field5">{item.travelNote || "N/A"}</span>
          </div>
        </div>
      </div>
      {/* Part 3 */}
      <div className="section">
        <div className="section-header">Hotel</div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Location</label>
            <span className="field-value" id="part3field1">{item.hotelLocation || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Check In</label>
            <span className="field-value" id="part3field2">{formatDateTime(item.hotelCheckIn) || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Check Out</label>
            <span className="field-value" id="part3field3">{formatDateTime(item.hotelCheckOut) || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Number Of Nights</label>
            <span className="field-value" id="part3field4">{item.hotelNumberOfNights || "N/A"}</span>
          </div>
        </div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Remarks</label>
            <span className="field-value" id="part3field1">{item.hotelNote || "N/A"}</span>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-header">Car Rental</div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Category</label>
            <span className="field-value" id="part3field1">{item.carRentalCategory || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">From</label>
            <span className="field-value" id="part3field2">{item.carRentalFrom || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">To</label>
            <span className="field-value" id="part3field3">{item.carRentalTo || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">On</label>
            <span className="field-value" id="part3field4">{formatDate(item.carRentalOn) || "N/A"}</span>
          </div>
        </div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Until</label>
            <span className="field-value" id="part3field1">{formatDate(item.carRentalUntil) || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Birth Date</label>
            <span className="field-value" id="part3field1">{formatDate(item.carRentalBirthDate) || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Driving License No.</label>
            <span className="field-value" id="part3field1">{item.carDrivingLicense || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Remarks</label>
            <span className="field-value" id="part3field1">{item.carRentalNote || "N/A"}</span>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-header">Personal Car</div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Registration No.</label>
            <span className="field-value" id="part3field1">{item.personalCarRegistrationNumber || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Driving License No.</label>
            <span className="field-value" id="part3field2">{item.personalCarDrivingLicenseNumber || "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Remarks</label>
            <span className="field-value" id="part3field3">{item.personalCarNote || "N/A"}</span>
          </div>
        </div>
      </div>
      {/* Part 4 */}
      <div class="page-break"></div>
      <div className="section">
        <div className="section-header">Travel Itinerary</div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Flight Ticket Type</label>
            <span className="field-value" id="part3field1">{item.flightTicketType && item.flightTicketType.name
              ? item.flightTicketType.name
              : "N/A"}</span>
          </div>
          <div className="field-group">
            <label className="field-label">Train Ticket Type</label>
            <span className="field-value" id="part3field2">{item.trainTicketType && item.trainTicketType.name
              ? item.trainTicketType.name
              : "N/A"}</span>
          </div>
        </div>
        <div className="field-row">
          <span className="summary-label">Attachments:</span>
        </div>
        <div className="field-row">
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

        <div className="field-row">
          <DataTable className="exportTable"
            value={travelInfo}
            showGridlines
            tableStyle={{ width: "100%", paddingBottom: "5px" }}
          >
            <Column
              field="onwardJourney"
              header="Onward Journey (From - To)"
              headerClassName="itinerary-custom-header"
            />
            <Column
              field="onwardDepartureDate"
              header="Departure Date"
              body={(rowData) => formatDate(rowData.onwardDepartureDate)}
              headerClassName="itinerary-custom-header"
            />
            <Column
              field="onwardPreferredTime"
              header="Onward Preferred Time"
              body={(rowData) => formatPickList(rowData.onwardPreferredTime)}
              headerClassName="itinerary-custom-header"
            />
            <Column
              field="onwardTransportNumber"
              header="Onward Flight/Train No"
              headerClassName="itinerary-custom-header"
            />
            <Column
              field="returnJourney"
              header="Return Journey (From - To)"
              headerClassName="itinerary-custom-header"
            />
            <Column
              field="returnArrivalDate"
              header="Arrival Date"
              body={(rowData) => formatDate(rowData.returnArrivalDate)}
              headerClassName="itinerary-custom-header"
            />
            <Column
              field="returnPreferredTime"
              header="Return Preferred Time"
              body={(rowData) => formatPickList(rowData.returnPreferredTime)}
              headerClassName="itinerary-custom-header"
            />
            <Column
              field="returnTransportNumber"
              header="Return Flight/Train No"
              headerClassName="itinerary-custom-header"
            />
            <Column
              field="onwardJourneyNote"
              header="Remarks"
              headerClassName="itinerary-custom-header"
            />
          </DataTable>
        </div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Reason</label>
            <span className="field-value" id="part3field1">{item.flightTicketReason && item.flightTicketReason.name
              ? item.flightTicketReason.name
              : "N/A"}</span>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-header">Approval History</div>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Status</label>
            <span className="field-value" id="field1">{item.approveStatus?.name || "N/A"}</span>
          </div>
        </div>
        <div className="field-row">
          <table id="approversTable">
            <thead>
              <tr>
                <th>Role</th>
                <th>Approver</th>
                <th>Comment</th>
                <th>Approved On</th>
              </tr>
            </thead>
            <tbody id="table-body">
              <tr>
                <td>Manager</td>
                <td>{item.manager || 'N/A'}</td>
                <td>{item.approver1Comment || 'N/A'}</td>
                <td>{formatDateTime(item.managerActionTime)}</td>
              </tr>
              <tr>
                <td>HOD</td>
                <td>{item.hod || 'N/A'}</td>
                <td>{item.approver2Comment || 'N/A'}</td>
                <td>{formatDateTime(item.hodActionTime)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default ReportTemplate;

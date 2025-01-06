import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePDF = (item = {}, travelInfo = [], attachmentInfo = [],) => {

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

    const documentDefinition = {
        pageMargins: [40, 40, 40, 40],
        background: [
            {
                canvas: [
                    {
                        type: 'rect',
                        x: 40,         // Start drawing from the top-left corner of the page
                        y: 40,         // Start drawing from the top-left corner of the page
                        w: 515,       // Width of the page (adjust for your page size, 515 is typical for A4)
                        h: 750,       // Height of the page (adjust for your page size)
                        lineWidth: 1,  // Border thickness
                        lineColor: '#cccccc', // Border color (black)
                        fillColor: 'white', // Fill color (white to leave the area inside the border clear)
                    }
                ]
            }
        ],
        content: [
            {
                canvas: [
                    {
                        type: 'rect',
                        x: 0,
                        y: 0,
                        w: 515,
                        h: 30,
                        color: '#004085',
                    }
                ],
                // absolutePosition: { x: 0, y: 10 }
            },
            {
                text: 'Travel Requisition',
                style: 'mainHeader',
                alignment: 'center',
                absolutePosition: { x: 0, y: 48 },
                lineHeight: 1.5
            },
            {
                table: {
                    widths: ['*'],
                    dontBreakRows: true,
                    body: [
                        [{
                            text: 'Traveler Identification',
                            style: 'sectionHeader',
                            alignment: 'left',
                            margin: [10, 10, 0, 5],
                            // decoration: 'underline'
                        }],
                        [
                            {
                                columns: [
                                    {
                                        width: 150,
                                        stack: [
                                            { text: 'Email', bold: true, style: 'smallTextHeader' },
                                            { text: `${item.email || 'N/A'}`, style: 'smallText', noWrap: false }
                                        ],
                                        margin: [10, 0, 0, 0]
                                    },
                                    {
                                        width: 150,
                                        stack: [
                                            { text: 'Name', bold: true, style: 'smallTextHeader' },
                                            { text: `${item.name || 'N/A'}`, style: 'smallText', noWrap: false }
                                        ],
                                        margin: [10, 0, 0, 0]
                                    },
                                    {
                                        width: 150,
                                        stack: [
                                            { text: 'Emp No.', bold: true, style: 'smallTextHeader' },
                                            { text: `${item.employeeNumber || 'N/A'}`, style: 'smallText', noWrap: false }
                                        ],
                                        margin: [10, 0, 0, 0]
                                    }
                                ],
                                columnGap: 5, // Adds spacing between columns
                                margin: [0, 5, 0, 5]
                            }
                        ],
                        [
                            {
                                columns: [
                                    {
                                        width: 150,
                                        stack: [
                                            { text: 'Entity', bold: true, style: 'smallTextHeader' },
                                            { text: `${item.entity || 'N/A'}`, style: 'smallText', noWrap: false }
                                        ],
                                        margin: [10, 0, 0, 0] // Left margin added
                                    },
                                    {
                                        width: 150,
                                        stack: [
                                            { text: 'Cost Center:', bold: true, style: 'smallTextHeader' },
                                            { text: `${item.costCenter || 'N/A'}`, style: 'smallText', noWrap: false }
                                        ],
                                        margin: [10, 0, 0, 0] // Left margin added
                                    },
                                    {
                                        width: 150,
                                        stack: [
                                            { text: 'Postion Title', bold: true, style: 'smallTextHeader' },
                                            { text: `${item.positionTitle || 'N/A'}`, style: 'smallText', noWrap: false }
                                        ],
                                        margin: [10, 0, 0, 0] // Left margin added
                                    }
                                ],
                                columnGap: 5, // Adds spacing between columns
                                margin: [0, 5, 0, 5]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
                    vLineWidth: () => 1,
                    hLineColor: () => '#cccccc',
                    vLineColor: () => '#cccccc',
                    paddingLeft: () => 2,
                    paddingRight: () => 2,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                },
                margin: [0, 5, 0, 5]
            },
            {
                table: {
                    widths: ['*'],
                    dontBreakRows: true,
                    body: [
                        [{
                            text: 'Travel Details',
                            style: 'sectionHeader',
                            margin: [10, 10, 0, 5],
                            alignment: 'left',
                            // decoration: 'underline'
                        }],
                        [{
                            columns: [
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Travel Id', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.travelRequestId || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Travel Type', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.travelType || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Participants', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.participants || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Destination', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.destination || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }],
                        [{
                            columns: [
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Travel Purpose', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.travelPurpose || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Departure Date', bold: true, style: 'smallTextHeader' },
                                        { text: `${formatDate(item.travelDepartureDate) || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Return Date', bold: true, style: 'smallTextHeader' },
                                        { text: `${formatDate(item.travelArrivalDate) || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Est Duration', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.travelEstimatedDuration || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }],
                        [{
                            columns: [
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Currency', bold: true, style: 'smallTextHeader' },
                                        {
                                            text: `${item.travelCurrency === null
                                                ? "N/A"
                                                : item.travelCurrency?.name || "N/A"}`, style: 'smallText', noWrap: false
                                        },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Budget', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.travelBudget || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Remarks', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.travelNote || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }]
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
                    vLineWidth: () => 1,
                    hLineColor: () => '#cccccc',
                    vLineColor: () => '#cccccc',
                    paddingLeft: () => 2,
                    paddingRight: () => 2,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                },
                margin: [0, 5, 0, 5]
            },
            item.hotelLocation ? {
                table: {
                    widths: ['*'],
                    dontBreakRows: true,
                    body: [
                        [{
                            text: 'Hotel',
                            style: 'sectionHeader',
                            margin: [10, 10, 0, 5],
                            alignment: 'left',
                            // decoration: 'underline'
                        }],
                        [{
                            columns: [
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Location', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.hotelLocation || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Check In', bold: true, style: 'smallTextHeader' },
                                        { text: `${formatDateTime(item.hotelCheckIn) || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Check Out', bold: true, style: 'smallTextHeader' },
                                        { text: `${formatDateTime(item.hotelCheckOut) || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Number Of Nights', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.hotelNumberOfNights || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }],
                        [{
                            columns: [
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Remarks', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.hotelNote || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }]
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
                    vLineWidth: () => 1,
                    hLineColor: () => '#cccccc',
                    vLineColor: () => '#cccccc',
                    paddingLeft: () => 2,
                    paddingRight: () => 2,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                },
                margin: [0, 5, 0, 5]
            } : [],
            item.carRentalCategory ? {
                table: {
                    widths: ['*'],
                    dontBreakRows: true,
                    body: [
                        [{
                            text: 'Car Rental',
                            style: 'sectionHeader',
                            margin: [10, 10, 0, 5],
                            alignment: 'left',
                            // decoration: 'underline'
                        }],
                        [{
                            columns: [
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Category', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.carRentalCategory || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'From', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.carRentalFrom || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'To', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.carRentalTo || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'On', bold: true, style: 'smallTextHeader' },
                                        { text: `${formatDate(item.carRentalOn) || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }],
                        [{
                            columns: [
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Until', bold: true, style: 'smallTextHeader' },
                                        { text: `${formatDate(item.carRentalUntil) || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Birth Date', bold: true, style: 'smallTextHeader' },
                                        { text: `${formatDate(item.carRentalBirthDate) || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Driving License No.', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.carDrivingLicense || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Remarks', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.carRentalNote || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }]
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
                    vLineWidth: () => 1,
                    hLineColor: () => '#cccccc',
                    vLineColor: () => '#cccccc',
                    paddingLeft: () => 2,
                    paddingRight: () => 2,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                },
                margin: [0, 5, 0, 5]
            } : [],
            item.personalCarRegistrationNumber ? {
                table: {
                    widths: ['*'],
                    dontBreakRows: true,
                    body: [
                        [{
                            text: 'Personal Car',
                            style: 'sectionHeader',
                            margin: [10, 10, 0, 5],
                            alignment: 'left',
                            // decoration: 'underline'
                        }],
                        [{
                            columns: [
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Registration No.', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.personalCarRegistrationNumber || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Driving License No.', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.personalCarDrivingLicenseNumber || 'N/A'}`, style: 'smallText', noWrap: false },
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                },
                                {
                                    width: 112,
                                    stack: [
                                        { text: 'Remarks', bold: true, style: 'smallTextHeader' },
                                        { text: `${item.personalCarNote || 'N/A'}`, style: 'smallText', noWrap: false }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }]
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
                    vLineWidth: () => 1,
                    hLineColor: () => '#cccccc',
                    vLineColor: () => '#cccccc',
                    paddingLeft: () => 2,
                    paddingRight: () => 2,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                },
                margin: [0, 5, 0, 5]
            } : [],
            item.flightTicketType && item.flightTicketType.name ? {
                table: {
                    widths: ['*'],
                    dontBreakRows: true,
                    body: [
                        [{
                            table: {
                                widths: ['*'],
                                dontBreakRows: true,
                                body: [
                                    [{
                                        text: 'Travel Itinerary',
                                        style: 'sectionHeader',
                                        margin: [10, 10, 0, 5],
                                        alignment: 'left',
                                    }],
                                    [{
                                        columns: [
                                            {
                                                width: 130,
                                                stack: [
                                                    { text: 'Flight Ticket Type', bold: true, style: 'smallTextHeader' },
                                                    {
                                                        text: item.flightTicketType && item.flightTicketType.name
                                                            ? item.flightTicketType.name
                                                            : "N/A", style: 'smallText', noWrap: false
                                                    }
                                                ],
                                                margin: [10, 0, 0, 0]
                                            },
                                            {
                                                width: 130,
                                                stack: [
                                                    { text: 'Train Ticket Type', bold: true, style: 'smallTextHeader' },
                                                    {
                                                        text: item.trainTicketType && item.trainTicketType.name
                                                            ? item.trainTicketType.name
                                                            : "N/A", style: 'smallText', noWrap: false
                                                    },
                                                ],
                                                margin: [10, 0, 0, 0]
                                            }
                                        ],
                                        columnGap: 5,
                                        margin: [0, 5, 0, 5]
                                    }]
                                ]
                            },
                            layout: {
                                hLineWidth: () => 0,
                                vLineWidth: () => 0, // Ensure this is a function that returns a value
                                hLineColor: () => '#cccccc',
                                vLineColor: () => '#cccccc',
                                paddingLeft: () => 2,
                                paddingRight: () => 2,
                                paddingTop: () => 2,
                                paddingBottom: () => 2
                            },
                            margin: [0, 5, 0, 5]
                        }],
                        attachmentInfo.length > 0 ? [{
                            table: {
                                widths: ['*'],
                                dontBreakRows: true,
                                body: [
                                    [{
                                        text: 'Attachments',
                                        style: 'sectionTextHeader',
                                        margin: [10, 0, 0, 0],
                                        alignment: 'left',
                                    }],
                                    ...attachmentInfo.map((attachment) => [{
                                        text: `* ${attachment.title || "No Title"}`,
                                        link: OnwardJourneyLink(attachment),
                                        style: 'smallTextHeader',
                                        decoration: 'underline',
                                        color: '#0000EE',
                                        margin: [15, 5, 0, 5],
                                    }])
                                ]
                            },
                            layout: {
                                hLineWidth: () => 0,
                                vLineWidth: () => 0,
                                hLineColor: () => '#cccccc',
                                vLineColor: () => '#cccccc',
                                paddingLeft: () => 2,
                                paddingRight: () => 2,
                                paddingTop: () => 2,
                                paddingBottom: () => 2
                            },
                            margin: [0, 5, 0, 5]
                        }] : [],
                        travelInfo.length > 0 ? [{
                            table: {
                                headerRows: 1,
                                dontBreakRows: true,
                                widths: [45, 45, 45, 45, 45, 45, 45, 45, 45],
                                body: [
                                    [
                                        { text: 'Onward Journey (From - To)', style: 'tableHeader' },
                                        { text: 'Departure Date', style: 'tableHeader' },
                                        { text: 'Onward Preferred Time', style: 'tableHeader' },
                                        { text: 'Onward Flight/Train No', style: 'tableHeader' },
                                        { text: 'Return Journey (From - To)', style: 'tableHeader' },
                                        { text: 'Arrival Date', style: 'tableHeader' },
                                        { text: 'Return Preferred Time', style: 'tableHeader' },
                                        { text: 'Return Flight/Train No', style: 'tableHeader' },
                                        { text: 'Remarks', style: 'tableHeader' }
                                    ],
                                    ...travelInfo.map((item) => [
                                        { text: item.onwardJourney || 'N/A', style: 'tableData' },
                                        { text: formatDate(item.onwardDepartureDate) || 'N/A', style: 'tableData' },
                                        { text: formatPickList(item.onwardPreferredTime) || 'N/A', style: 'tableData' },
                                        { text: item.onwardTransportNumber || 'N/A', style: 'tableData' },
                                        { text: item.returnJourney || 'N/A', style: 'tableData' },
                                        { text: formatDate(item.returnArrivalDate) || 'N/A', style: 'tableData' },
                                        { text: formatPickList(item.returnPreferredTime) || 'N/A', style: 'tableData' },
                                        { text: item.returnTransportNumber || 'N/A', style: 'tableData' },
                                        { text: item.onwardJourneyNote || 'N/A', style: 'tableData' },
                                    ])
                                ]
                            },
                            layout: {
                                hLineWidth: () => 0.5,
                                vLineWidth: () => 0.5,
                                hLineColor: () => '#004085',
                                vLineColor: () => '#004085',
                                fillColor: (rowIndex) => rowIndex === 0 ? '#004085' : null,
                                paddingLeft: () => 5,
                                paddingRight: () => 5,
                                paddingTop: () => 5,
                                paddingBottom: () => 5,
                            },
                            margin: [10, 0, 0, 0]
                        }] : [],
                        item.flightTicketReason && item.flightTicketReason.name ? [{
                            columns: [
                                {
                                    width: 120,
                                    stack: [
                                        { text: 'Reason:', bold: true, style: 'smallTextHeader' },
                                        {
                                            text: item.flightTicketReason && item.flightTicketReason.name
                                                ? item.flightTicketReason.name
                                                : "N/A", style: 'smallText', noWrap: false
                                        }
                                    ],
                                    margin: [10, 0, 0, 0]
                                },
                            ],
                            columnGap: 5,
                            margin: [0, 5, 0, 5]
                        }] : [],
                    ],                    
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#cccccc',
                    vLineColor: () => '#cccccc',
                    // fillColor: (rowIndex) => rowIndex === 0 ? '#004085' : null,
                    paddingLeft: () => 2,
                    paddingRight: () => 2,
                    paddingTop: () => 2,
                    paddingBottom: () => 2,
                },
                margin: [0, 5, 0, 5]
            } : [],            
            {
                table: {
                    widths: ['*'],
                    body: [
                        [{
                            text: 'Approval History',
                            style: 'sectionHeader',
                            margin: [10, 10, 0, 5],
                            alignment: 'left',
                            // decoration: 'underline'
                        }],
                        [{
                            columns: [
                                {
                                    width: 140,
                                    stack: [
                                        { text: 'Status', bold: true, style: 'smallTextHeader' },
                                        {
                                            text: `${item.approveStatus?.name || "N/A"}`, style: 'smallText', noWrap: false
                                        }
                                    ],
                                    margin: [10, 0, 0, 0] // Left margin added
                                }
                            ],
                            columnGap: 5, // Adds spacing between columns
                            margin: [0, 5, 0, 5]
                        }],
                        [
                            {
                                table: {
                                    headerRows: 1,
                                    dontBreakRows: true,
                                    widths: [100, 100, 100, 100],
                                    alignment: 'center',
                                    body: [
                                        [
                                            { text: 'Role', style: 'tableHeader' },
                                            { text: 'Approver', style: 'tableHeader' },
                                            { text: 'Comment', style: 'tableHeader' },
                                            { text: 'Approved On', style: 'tableHeader' }
                                        ],
                                        [
                                            { text: 'Manager', style: 'tableData' },
                                            { text: item.manager || 'N/A', style: 'tableData' },
                                            { text: item.approver1Comment || 'N/A', style: 'tableData' },
                                            { text: formatDateTime(item.managerActionTime) || 'N/A', style: 'tableData' },
                                        ],
                                        [
                                            { text: 'HOD', style: 'tableData' },
                                            { text: item.hod || 'N/A', style: 'tableData' },
                                            { text: item.approver2Comment || 'N/A', style: 'tableData' },
                                            { text: formatDateTime(item.hodActionTime) || 'N/A', style: 'tableData' },
                                        ]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 0.5,
                                    vLineWidth: () => 0.5,
                                    hLineColor: () => '#004085',
                                    vLineColor: () => '#004085',
                                    fillColor: (rowIndex) => rowIndex === 0 ? '#004085' : null,
                                    paddingLeft: () => 5,
                                    paddingRight: () => 5,
                                    paddingTop: () => 5,
                                    paddingBottom: () => 5,
                                },
                                margin: [10, 0, 0, 20]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
                    vLineWidth: () => 1,
                    hLineColor: () => '#cccccc',
                    vLineColor: () => '#cccccc',
                    paddingLeft: () => 2,
                    paddingRight: () => 2,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                },
                margin: [0, 5, 0, 5]
            },
        ],
        styles: {
            mainHeader: { fontSize: 13, bold: true, color: 'white', margin: [0, 0, 0, 0], lineHeight: 1.5 },
            sectionHeader: { fontSize: 12, color: '#004085', margin: [0, 5, 0, 5] },
            sectionTextHeader: { fontSize: 12, alignment: 'left'},
            tableHeader: { fontSize: 8, bold: true, color: 'white', fillColor: '#004085', alignment: 'center' },
            tableData: { fontSize: 8, alignment: 'center' },
            smallText: { fontSize: 9, alignment: 'left' },
            smallTextHeader: { fontSize: 10, alignment: 'left' },
            grandTotal: { fontSize: 10, bold: true }
        },
        defaultStyle: { font: 'Roboto' }
    };


    const fileName = `${item.travelRequestId}.pdf`;

    // Generate the PDF
    pdfMake.createPdf(documentDefinition).download(fileName);
};
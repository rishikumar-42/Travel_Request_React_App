import React, { useEffect, useState } from "react";
import TravelRequestFormService from "../service/TravelRequestFormService.js";
import "../assets/css/TravelRequestForm.css";
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from "primereact/radiobutton";

function TravelRequestForm() {
    const [showNights, setShowNights] = useState(false);
    const [showCarDetails, setCarDetails] = useState(false);
    const [showPerCarDetails, setPerCarDetails] = useState(false);
    const [showTrainDetails, setTrainDetails] = useState(false);
    const [showItinerary, setShowItinerary] = useState(false);
    const [showFlightTicket, setFlightTicket] = useState(false);
    // const [firstName, setFirstName] = useState("");
    // const [suggestions, setSuggestions] = useState([]);
    const [userList, setUserList] = useState([]);
    const [reasonList, setReasonList] = useState([]);
    const [flightTypeList, setFlightTypeList] = useState([]);
    const [flightTypeValue, setFlightTypeValue] = useState({});
    const [trainTypeList, setTrainTypeList] = useState([]);
    const [trainTypeValue, setTrainTypeValue] = useState({});
    const [reasonValue, setReasonValue] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [newItinerary, setNewItinerary] = useState({
        itFrom: '',
        itTo: '',
        departure: '',
        arrival: '',
        itrDate: '',
        flightNumber: '',
        price: ''
    });

    const [dropDownSuggestions, setdropDownSuggestions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dropDownSuggestions2, setdropDownSuggestions2] = useState([]);
    const [selectedItem2, setSelectedItem2] = useState(null);
    const [employeeDropDownSuggestions, setEmployeeDropDownSuggestions] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const searchEmployee = (event) => {
        const query = event.query.toLowerCase();
        setEmployeeDropDownSuggestions(
            userList.filter(item => item.email.toLowerCase().includes(query))
        );
    };

    const searchItem = (event) => {
        const query = event.query.toLowerCase();
        setdropDownSuggestions(
            userList.filter(item => item.email.toLowerCase().includes(query) && (item.email.toLowerCase() !== selectedEmployee.email.toLowerCase()))
        );
    };
    const searchItem2 = (event) => {
        const query = event.query.toLowerCase();
        setdropDownSuggestions2(
            userList.filter(item => item.email.toLowerCase().includes(query) && (item.email.toLowerCase() !== selectedItem.email.toLowerCase()) && (item.email.toLowerCase() !== selectedEmployee.email.toLowerCase()))
        );
    };

    const itemTemplate = (item) => {
        return (
            <div className="p-d-flex p-ai-center">
                <div className="p-mr-2">{item.email}</div>
            </div>
        );
    };

    // const employeeTemplate = (item) => {
    //     return (
    //         <div className="p-d-flex p-ai-center">
    //             <div className="p-mr-2">{item.firstName}</div>
    //         </div>
    //     );
    // };

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const usersList = await TravelRequestFormService.fetchUsers();
                setUserList(usersList);
                console.log("User List:", usersList);
            } catch (error) {
                console.error("Error fetching suggestions", error);
            }
        };

        getAllUsers();
    }, []);

    useEffect(() => {
        const getAllReasons = async () => {
            try {
                const reasonList = await TravelRequestFormService.fetchReasonPicklist();
                setReasonList(reasonList);
                console.log("reasons :", reasonList);
            } catch (error) {
                console.error("Error fetching reason", error);
            }
        };

        getAllReasons();
    }, []);

    useEffect(() => {
        const getAllFlightTypes = async () => {
            try {
                const flightTypes = await TravelRequestFormService.fetchFlightTypePicklist();
                setFlightTypeList(flightTypes);
                console.log("flight types :", flightTypes);
            } catch (error) {
                console.error("Error fetching flight ", error);
            }
        };

        getAllFlightTypes();
    }, []);

    useEffect(() => {
        const getAllTrainTypes = async () => {
            try {
                const trainTypes = await TravelRequestFormService.fetchTrainTicketTypePicklist();
                setTrainTypeList(trainTypes);
                console.log("train types :", trainTypes);
            } catch (error) {
                console.error("Error fetching train ", error);
            }
        };

        getAllTrainTypes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItinerary({
            ...newItinerary,
            [name]: value
        });
    };

    const handleSaveItinerary = () => {
        setItineraries([...itineraries, newItinerary]);
        setNewItinerary({
            itFrom: '',
            itTo: '',
            departure: '',
            arrival: '',
            itrDate: '',
            flightNumber: '',
            price: ''
        });
        setShowItinerary(false);
    };

    const calculateTotalPrice = () => {
        return itineraries.reduce((total, itinerary) => {
            return total + parseFloat(itinerary.price || 0);
        }, 0).toFixed(2);
    };

    const handleHotelToggleChange = (event) => {
        setShowNights(event.target.checked);
        if (!event.target.checked) {
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                hotelNumberOfNights: 0
            }))
        }
    };

    const handleCarToggleChange = (event) => {
        setCarDetails(event.target.checked);
        if (!event.target.checked) {
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                carRentalFrom: "",
                carRentalTo: "",
                carRentalOn: "",
                carRentalUntil: "",
                carRentalBirthDate: null,
                carDrivingLicense: "",
                carRentalCategory: "",
            }))
        }
    };

    const handlePerCarToggleChange = (event) => {
        setPerCarDetails(event.target.checked);
        if (!event.target.checked) {
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                personalCarDrivingLicenseNumber: "",
                personalCarRegistrationNumber: ""
            }))
        }
    };

    useEffect(() => {

    }, [])

    const initialFlightTicket = () => {
        console.log("trainTypeList data : ", trainTypeList);
        const firstFlightType = flightTypeList[0];
        console.log("firstTrainType data : ", firstFlightType);
        setFlightTypeValue(firstFlightType);
        setFormData(prevFormData => ({
            ...prevFormData, // Spread the existing formData
            flightTicketType: {
                key: firstFlightType.key,
                name: firstFlightType.name // Update the trainTicketType properties
            }
        }));
    };

    const handleflightToggleChange = (event) => {
        const isChecked = event.target.checked;
        setFlightTicket(event.target.checked);
        if (isChecked) {
            initialFlightTicket();
        } else {
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                flightTicketType: {},
                flightTicketReason: {}
            }));
            setReasonValue([]);
        }
    };

    const handleAddItineraryClick = () => {
        setShowItinerary(true);
    };

    const handleCloseItineraryClick = () => {
        setShowItinerary(false);
    };

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        employeeNumber: "",
        costCenter: "",
        entity: "",
        positionTitle: "",
        travelPurpose: "",
        participants: "",
        placesVisited: "",
        flightTicketReason: {},
        flightTicketType: {},
        carRentalFrom: "",
        carRentalTo: "",
        carRentalOn: "",
        carRentalUntil: "",
        carRentalBirthDate: null,
        carDrivingLicense: "",
        carRentalCategory: "",
        personalCarDrivingLicenseNumber: "",
        personalCarRegistrationNumber: "",
        trainTicketType: {},
        hotelNumberOfNights: 0,
        itineraryTotal: "",
        approver1: {},
        approver2: {},
    });

    // const initialTrainTicket = () => {
    //     console.log("trainTypeList data : ", trainTypeList);
    //     const firstTrainType = trainTypeList[0];
    //     console.log("firstTrainType data : ", firstTrainType);
    //     setTrainTypeValue(firstTrainType);
    //     setFormData(formData => ({
    //         ...formData, // Spread the existing formData
    //         trainTicketType: {
    //             key: firstTrainType.key,
    //             name: firstTrainType.name // Update only the firstName property
    //         }
    //     }));
    //     console.log("form data : ", JSON.stringify(formData));
    // };

    // const handleTrainToggleChange = async (event) => {
    //     setTrainDetails(event.target.checked);
    //     if (event.target.checked) {
    //         initialTrainTicket();
    //     }
    // };

    const initialTrainTicket = () => {
        console.log("trainTypeList data : ", trainTypeList);
        const firstTrainType = trainTypeList[0];
        console.log("firstTrainType data : ", firstTrainType);
        setTrainTypeValue(firstTrainType);
        setFormData(prevFormData => ({
            ...prevFormData, // Spread the existing formData
            trainTicketType: {
                key: firstTrainType.key,
                name: firstTrainType.name // Update the trainTicketType properties
            }
        }));
    };

    // Handle toggling of train details
    const handleTrainToggleChange = async (event) => {
        const isChecked = event.target.checked;
        setTrainDetails(isChecked);
        if (isChecked) {
            initialTrainTicket();
        } else {
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                trainTicketType: {}
            }));
        }
    };

    useEffect(() => {
        console.log("Updated formData: ", JSON.stringify(formData));
    }, [formData]);

    // Handle form submission
    const handleFormSubmit = async (e) => {
        console.log("Form submission started");
        e.preventDefault();
        try {
            await TravelRequestFormService.submitFormData(formData);
            // Handle success (e.g., show a message or redirect)
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    return (
        <div className="form-container">
            <form className="travel-form" onSubmit={handleFormSubmit}>
                <div className="form-single">
                    <label htmlFor="issuer">Issuer:</label>
                    <input type="text" id="issuer" name="issuer"  />
                </div>
                <div className="form-single">
                    <label htmlFor="issuerDate">Issue Date:</label>
                    <input type="date" id="issuerDate" name="issuerDate"  />
                </div>
                <div className="form-single">
                    <label htmlFor="telephoneNumber">Telephone Number</label>
                    <input type="text" id="telephoneNumber" name="telephoneNumber"  />
                </div>
                <hr className="separator" />
                <h2 className="form-heading">Traveller Identification</h2>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="employeeEmail">Email:</label>
                        <AutoComplete
                            value={selectedEmployee}
                            suggestions={employeeDropDownSuggestions}
                            completeMethod={searchEmployee}
                            field="email"
                            onChange={(e) => setSelectedEmployee(e.value)}
                            onSelect={(e) => {
                                setSelectedEmployee(e.value);
                                setFormData({
                                    ...formData, // Spread the existing formData
                                    firstName: e.value.firstName, // Update only the firstName property
                                    lastName: e.value.lastName,
                                    employeeNumber: e.value.employeeNumber,
                                    costCenter: e.value.costCenter,
                                    entity: e.value.entity,
                                    positionTitle: e.value.positionTitle
                                });
                                console.log("value : " + JSON.stringify(formData));
                            }}
                            itemTemplate={itemTemplate}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} required readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} required readOnly />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="employeeNumber">Employee Number:</label>
                        <input type="text" id="employeeNumber" name="employeeNumber" value={formData.employeeNumber} required readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="costCenter">Cost Centre:</label>
                        <input type="text" id="costCenter" name="costCenter" value={formData.costCenter} required readOnly />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="entity">Entity:</label>
                        <input type="text" id="entity" name="entity" value={formData.entity} required readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="positionTitle">Position Title:</label>
                        <input type="text" id="positionTitle" name="positionTitle" value={formData.positionTitle} required readOnly />
                    </div>
                </div>
                <div className="form-longtext">
                    <label htmlFor="travelPurpose">Travel Purpose</label>
                    <textarea id="travelPurpose" name="travelPurpose"
                        value={formData.travelPurpose}
                        onChange={(e) => setFormData({
                            ...formData, // Spread the existing formData
                            travelPurpose: e.target.value // Update only the firstName property
                        })}
                        rows="1">
                    </textarea>
                </div>

                <div className="form-longtext">
                    <label htmlFor="placeVisited">Place Visited</label>
                    <input type="text" id="placeVisited" name="placeVisited" required
                        value={formData.placesVisited}
                        onChange={(e) => setFormData({
                            ...formData, // Spread the existing formData
                            placesVisited: e.target.value // Update only the firstName property
                        })}
                    />
                </div>

                <div className="form-longtext">
                    <label htmlFor="participants">Participants (ACS, customer, supplier …)</label>
                    <textarea id="participants" name="participants" rows="1"
                        value={formData.participants}
                        onChange={(e) => setFormData({
                            ...formData, // Spread the existing formData
                            participants: e.target.value // Update only the firstName property
                        })}></textarea>
                </div>
                <hr className="separator" />

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="entity">Manager</label>
                        <AutoComplete
                            value={selectedItem}
                            suggestions={dropDownSuggestions}
                            completeMethod={searchItem}
                            field="email"
                            onChange={(e) => setSelectedItem(e.value)}
                            onSelect={(e) => {
                                setSelectedItem(e.value);
                                setFormData({
                                    ...formData, // Spread the existing formData
                                    approver1: {
                                        key: e.value.firstName,
                                        name: e.value.firstName // Update only the firstName property
                                    }
                                });
                                console.log("value : " + JSON.stringify(e.value.email));
                            }}
                            itemTemplate={itemTemplate}
                            disabled={selectedEmployee === null}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="positionTitle">Head Of Department/GM/VP</label>
                        <AutoComplete
                            value={selectedItem2}
                            suggestions={dropDownSuggestions2}
                            completeMethod={searchItem2}
                            field="email"
                            onChange={(e) => setSelectedItem2(e.value)}
                            onSelect={(e) => {
                                setSelectedItem2(e.value);
                                console.log("value : " + JSON.stringify(e.value.email));
                            }}
                            itemTemplate={itemTemplate}
                            disabled={selectedItem === null}
                        />
                    </div>
                </div>
                <hr className="separator" />

                <div className="form-row-toggle">
                    <label className="toggle-label" htmlFor="flightToggle">Flight Ticket</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="flightToggle"
                            name="flightToggle"
                            onChange={handleflightToggleChange}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                {showFlightTicket && (
                    <div>
                        <div className="card flex justify-content-center">
                            <div className="flex flex-column gap-3">
                                {flightTypeList.map((category) => {
                                    return (
                                        <div key={category.key} className="flex align-items-center">
                                            <RadioButton inputId={category.key} name="category" value={category}
                                                // onChange={(e) => set(e.value)} 
                                                onChange={(e) => {
                                                    setFlightTypeValue(e.value)
                                                    setFormData({
                                                        ...formData, // Spread the existing formData
                                                        flightTicketType: {
                                                            key: e.value.key,
                                                            name: e.value.name // Update only the firstName property
                                                        }
                                                    });
                                                    console.log("radio : ", formData)
                                                }
                                                }
                                                checked={flightTypeValue.key === category.key} />
                                            <label htmlFor={category.key} className="ml-2">{category.name}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* <div className="form-row-checkbox">
                            <div className="half-width">
                                <label htmlFor="businessClass">Business Class</label>
                                <input type="checkbox" id="businessClass" name="class" required />
                            </div>
                            <div className="half-width">
                                <label htmlFor="economyClass">Economy Class</label>
                                <input type="checkbox" id="economyClass" name="class" required />
                            </div>
                        </div> */}
                        <p>Note: Kindly attach the 3 quotes/routes provided by Travel Agent for comparison. If the least cost-saving route is not taken, kindly provide the reason below.</p>
                        <div className="form-dropdown-container">
                            <label htmlFor="reason">Reason</label>
                            <Dropdown inputId="dd-city" value={reasonValue} onChange={(e) => {
                                setReasonValue(e.value);
                                setFormData({
                                    ...formData, // Spread the existing formData
                                    flightTicketReason: {
                                        key: e.value.key,
                                        name: e.value.name // Update only the firstName property
                                    }
                                });
                            }} options={reasonList} optionLabel="name" className="w-full" />

                        </div>
                    </div>
                )}
                <hr className="separator" />
                <div className="form-row-toggle">
                    <label className="toggle-label" htmlFor="hotelToggle">Hotel</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="hotelToggle"
                            name="hotelToggle"
                            onChange={handleHotelToggleChange}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                {showNights && (
                    <div className="form-single" id="nightsContainer">
                        <label htmlFor="nights">Number of Nights</label>
                        <input type="number" id="nights" name="nights" required
                            value={formData.hotelNumberOfNights}
                            onChange={(e) => setFormData({
                                ...formData, // Spread the existing formData
                                hotelNumberOfNights: e.target.value // Update only the firstName property
                            })} />
                    </div>
                )}

                <hr className="separator" />

                <div className="form-row-toggle">
                    <label className="toggle-label" htmlFor="carRentalToggle">Car Rental</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="carRentalToggle"
                            name="carRentalToggle"
                            onChange={handleCarToggleChange}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                {showCarDetails && (
                    <div>
                        <div className="form-single">
                            <label htmlFor="category">Category</label>
                            <input type="text" id="category" name="category" required
                                value={formData.carRentalCategory}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    carRentalCategory: e.target.value
                                })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group-car">
                                <label htmlFor="from">From:</label>
                                <input type="text" id="from" name="from" required
                                    value={formData.carRentalFrom}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        carRentalFrom: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group-car">
                                <label htmlFor="on">On:</label>
                                <input type="text" id="on" name="on" required
                                    value={formData.carRentalOn}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        carRentalOn: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group-car">
                                <label htmlFor="to">To:</label>
                                <input type="text" id="to" name="to" required
                                    value={formData.carRentalTo}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        carRentalTo: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group-car">
                                <label htmlFor="until">Until:</label>
                                <input type="text" id="until" name="until" required
                                    value={formData.carRentalUntil}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        carRentalUntil: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group-car">
                                <label htmlFor="birthDate">Birth Date</label>
                                <input type="date" id="birthDate" name="birthDate" required
                                    value={formData.carRentalBirthDate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        carRentalBirthDate: e.target.value
                                    })} />
                            </div>
                            <div className="form-group-car">
                                <label htmlFor="drivingLicense">Driving License</label>
                                <input type="text" id="drivingLicense" name="drivingLicense" required
                                    value={formData.carDrivingLicense}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        carDrivingLicense: e.target.value
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <hr className="separator" />
                <div className="form-row-toggle">
                    <label className="toggle-label" htmlFor="perCarToggle">Personal Car</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="perCarToggle"
                            name="perCarToggle"
                            onChange={handlePerCarToggleChange}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
                {showPerCarDetails && (
                    <div>
                        <div className="form-row">
                            <div className="form-group-car">
                                <label htmlFor="carRegNum">Car Registration Number</label>
                                <input type="text" id="carRegNum" name="carRegNum" required
                                    value={formData.personalCarRegistrationNumber}
                                    onChange={(e) => setFormData({
                                        ...formData, // Spread the existing formData
                                        personalCarRegistrationNumber: e.target.value // Update only the firstName property
                                    })}
                                />
                            </div>
                            <div className="form-group-car">
                                <label htmlFor="drivingLicenseNum">Driving License Number</label>
                                <input type="text" id="drivingLicenseNum" name="drivingLicenseNum" required
                                    value={formData.personalCarDrivingLicenseNumber}
                                    onChange={(e) => setFormData({
                                        ...formData, // Spread the existing formData
                                        personalCarDrivingLicenseNumber: e.target.value // Update only the firstName property
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <hr className="separator" />
                <div className="form-row-toggle">
                    <label className="toggle-label" htmlFor="trainToggle">Train Ticket</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="trainToggle"
                            name="trainToggle"
                            onChange={handleTrainToggleChange}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
                {showTrainDetails && (
                    <div className="card flex justify-content-center">
                        <div className="flex flex-column gap-3">
                            {trainTypeList.map((category) => {
                                return (
                                    <div key={category.key} className="flex align-items-center">
                                        <RadioButton inputId={category.key} name="category" value={category}
                                            // onChange={(e) => set(e.value)} 
                                            onChange={(e) => {
                                                setTrainTypeValue(e.value)
                                                setFormData({
                                                    ...formData, // Spread the existing formData
                                                    trainTicketType: {
                                                        key: e.value.key,
                                                        name: e.value.name // Update only the firstName property
                                                    }
                                                });
                                                console.log("radio : ", formData)
                                            }
                                            }
                                            checked={trainTypeValue.key === category.key} />
                                        <label htmlFor={category.key} className="ml-2">{category.name}</label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <hr className="separator" />
                <div className="addbutton">
                    <button type="button" onClick={handleAddItineraryClick}>
                        {showItinerary ? "Hide Itinerary" : "Add Itinerary"}
                    </button>
                </div>

                {showItinerary && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseItineraryClick}>&times;</span>
                            <div className="itinerary-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="itFrom">From</label>
                                        <input
                                            type="text"
                                            id="itFrom"
                                            name="itFrom"
                                            value={newItinerary.itFrom}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="itTo">To</label>
                                        <input
                                            type="text"
                                            id="itTo"
                                            name="itTo"
                                            value={newItinerary.itTo}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="departure">Departure</label>
                                        <input
                                            type="text"
                                            id="departure"
                                            name="departure"
                                            value={newItinerary.departure}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="arrival">Arrival</label>
                                        <input
                                            type="text"
                                            id="arrival"
                                            name="arrival"
                                            value={newItinerary.arrival}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="itrDate">Date and Time</label>
                                        <input
                                            type="date"
                                            id="itrDate"
                                            name="itrDate"
                                            value={newItinerary.itrDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="flightNumber">Flight Number</label>
                                        <input
                                            type="text"
                                            id="flightNumber"
                                            name="flightNumber"
                                            value={newItinerary.flightNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-single">
                                    <label htmlFor="price">Price incl. VAT</label>
                                    <input
                                        type="text"
                                        id="price"
                                        name="price"
                                        value={newItinerary.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <button type="button" onClick={handleSaveItinerary}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {itineraries.length > 0 && (
                    <div className="itinerary-table">
                        <h3>Saved Itineraries</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Departure</th>
                                    <th>Arrival</th>
                                    <th>Date and Time</th>
                                    <th>Flight Number</th>
                                    <th>Price incl. VAT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itineraries.map((itinerary, index) => (
                                    <tr key={index}>
                                        <td>{itinerary.itFrom}</td>
                                        <td>{itinerary.itTo}</td>
                                        <td>{itinerary.departure}</td>
                                        <td>{itinerary.arrival}</td>
                                        <td>{itinerary.itrDate}</td>
                                        <td>{itinerary.flightNumber}</td>
                                        <td>{itinerary.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="total-price">
                            <strong>Total Price incl. VAT:</strong> {calculateTotalPrice()}
                        </div>
                    </div>
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default TravelRequestForm;

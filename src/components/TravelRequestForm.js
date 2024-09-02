import React, { useEffect, useState } from "react";
import TravelRequestFormService from "../service/TravelRequestFormService.js";
import "../assets/css/TravelRequestForm.css";
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from "primereact/radiobutton";
import { Button } from 'primereact/button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FloatLabel } from 'primereact/floatlabel';
import 'primeicons/primeicons.css';
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from "primereact/inputswitch";

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
    const [currencyList, setCurrencyList] = useState([]);
    const [currencyValue, setCurrencyValue] = useState({});
    const [preferredTimeList, setPreferredTimeList] = useState([]);
    const [reasonValue, setReasonValue] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [isEmployeeEmailValid, setIsEmployeeEmailValid] = useState(true);
    const [isManagerEmailValid, setIsManagerEmailValid] = useState(true);
    const [isHODEmailValid, setIsHODEmailValid] = useState(true);
    // const [newItinerary, setNewItinerary] = useState({
    //     itFrom: '',
    //     itTo: '',
    //     departure: null,
    //     arrival: null,
    //     // itrDate: '',
    //     flightNumber: '',
    //     returnFrom: '',
    //     returnTo: '',
    //     returnDeparture: null,
    //     returnArrival: null,
    //     returnFlightNumber: '',
    //     price: ''
    // });
    const [newItinerary, setNewItinerary] = useState({
        onwardJourney: '',
        onwardDepartureDate: null,
        onwardPreferredTime: '',
        onwardJourneyNote: '',
        onwardTransportNumber: '',
        returnJourney: '',
        returnArrivalDate: null,
        returnPreferredTime: '',
        returnTransportNumber: '',
        // r_itineraryRelation_c_travelInfoERC: ""
    });
    const [editingItinerary, setEditingItinerary] = useState(null);

    const [dropDownSuggestions, setdropDownSuggestions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dropDownSuggestions2, setdropDownSuggestions2] = useState([]);
    const [selectedItem2, setSelectedItem2] = useState(null);
    const [employeeDropDownSuggestions, setEmployeeDropDownSuggestions] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const [showReturnFields, setShowReturnFields] = useState(false);
    const [saveItineraryFlag, setSaveItineraryFlag] = useState(true);

    const searchEmployee = (event) => {
        const query = event.query.toLowerCase();
        setEmployeeDropDownSuggestions(
            userList.filter(item => item.email.toLowerCase().includes(query))
        );
    };
    // const [selectedPhoneCode, setSelectedPhoneCode] = useState(null);
    const handleEditItinerary = (index) => {
        const itineraryToEdit = { ...itineraries[index] }; // Create a copy to avoid direct mutation
        setNewItinerary(itineraryToEdit);
        setEditingItinerary(index); // Store the index, not the itinerary itself
        setShowItinerary(true);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
    };

    const formatPickList = (data) => {
        if (!data) return '';
        return data.name;
    };


    const handleSaveItinerary = () => {
        if (editingItinerary !== null) {
            // Update existing itinerary
            setItineraries(itineraries.map((it, i) =>
                i === editingItinerary ? newItinerary : it
            ));
            setEditingItinerary(null);
        } else {
            // Add new itinerary
            setItineraries([...itineraries, newItinerary]);


        }
        setNewItinerary({
            // itFrom: '',
            // itTo: '',
            // departure: null,
            // arrival: null,
            // // itrDate: '',
            // flightNumber: '',
            // returnFrom: '',
            // returnTo: '',
            // returnDeparture: null,
            // returnArrival: null,
            // returnFlightNumber: '',
            // price: ''
            onwardJourney: '',
            onwardDepartureDate: null,
            onwardPreferredTime: '',
            onwardTransportNumber: '',
            onwardJourneyNote: '',
            returnJourney: '',
            returnArrivalDate: null,
            returnPreferredTime: '',
            returnTransportNumber: '',
            // r_itineraryRelation_c_travelInfoERC: ""
        });
        setShowItinerary(false);
        setShowReturnFields(false);
    };

    const handleRemoveItinerary = (index) => {
        setItineraries(itineraries.filter((_, i) => i !== index));
    };


    // const PhoneNumberInput = () => {
    //     const phoneCodes = [
    //         { code: "91", country: "India" },
    //         { code: "966", country: "Saudi Arabia" },
    //         { code: "98", country: "Iran" }
    //     ];

    //     return (
    //         <div className="p-inputgroup flex-1">
    //             <FloatLabel>
    //                 <span className="p-inputgroup-addon">+</span>
    //                 <Dropdown
    //                     // autoWidth={false}
    //                     value={selectedPhoneCode}
    //                     onChange={(e) => setSelectedPhoneCode(e.value)}
    //                     options={phoneCodes}
    //                     optionLabel="code"
    //                     placeholder="Select Code"
    //                     className="p-mr-2 w-full md:w-14rem"
    //                 />
    //                 <InputNumber id="telephoneNumber" placeholder="Telephone Number" />
    //             </FloatLabel>
    //         </div>
    //     );
    // };
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
        const getAllCurrency = async () => {
            try {
                const currencyList = await TravelRequestFormService.fetchCurrencyPicklist();
                setCurrencyList(currencyList);
                console.log("Currency List:", currencyList);
            } catch (error) {
                console.error("Error fetching suggestions", error);
            }
        };

        getAllCurrency();
    }, []);

    useEffect(() => {
        const getAllPreferredTime = async () => {
            try {
                const preferredTimeList = await TravelRequestFormService.fetchPreferredTimePicklist();
                setPreferredTimeList(preferredTimeList);
                console.log("Preferred Time List:", preferredTimeList);
            } catch (error) {
                console.error("Error fetching preferred time ", error);
            }
        };

        getAllPreferredTime();
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

    const calculateEstimatedDuration = (departureDate, arrivalDate) => {
        if (departureDate !== null && arrivalDate !== null) {
            const timeDiff = arrivalDate - departureDate;
            const millisecondsPerDay = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiff / millisecondsPerDay);
            console.log(dayDiff); // Output will be the number of days between the two dates
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                travelEstimatedDuration: dayDiff
            }))
        }
    }

    const calculateEstimatedNights = (departureDate, arrivalDate) => {
        if (departureDate !== null && arrivalDate !== null) {
            const timeDiff = arrivalDate - departureDate;
            const millisecondsPerDay = 1000 * 60 * 60 * 24;
            const nightDiff = Math.ceil(timeDiff / millisecondsPerDay);
            console.log(nightDiff); // Output will be the number of days between the two dates
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                hotelNumberOfNights: nightDiff
            }))
        }
    }
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setNewItinerary({
    //         ...newItinerary,
    //         [name]: value
    //     });
    // };

    const handleInputChange = (name, e) => {
        const { value } = e.target;
        console.log(name, " : ", value);
        setNewItinerary({
            ...newItinerary,
            [name]: value
        });
    };

    // const handleSaveItinerary = () => {
    //     setItineraries([...itineraries, newItinerary]);
    //     setNewItinerary({
    //         itFrom: '',
    //         itTo: '',
    //         departure: '',
    //         arrival: '',
    //         itrDate: '',
    //         flightNumber: '',
    //         price: ''
    //     });
    //     setShowItinerary(false);
    // };

    // const calculateTotalPrice = () => {
    //     return itineraries.reduce((total, itinerary) => {
    //         return total + parseFloat(itinerary.price || 0);
    //     }, 0).toFixed(2);
    // };

    const handleHotelToggleChange = (event) => {
        setShowNights(event.target.checked);
        if (!event.target.checked) {
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                hotelNumberOfNights: null
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

    // const handleAddItineraryClick = () => {
    //     setShowItinerary(true);
    // };

    const handleCloseItineraryClick = () => {
        setShowItinerary(false);
        setEditingItinerary(null);
        setNewItinerary({
            onwardJourney: '',
            onwardDepartureDate: null,
            onwardPreferredTime: '',
            onwardJourneyNote: '',
            onwardTransportNumber: '',
            returnJourney: '',
            returnArrivalDate: null,
            returnPreferredTime: '',
            returnTransportNumber: '',
        });
        setShowReturnFields(false);
    };

    const [formData, setFormData] = useState({
        travelRequestId : "",
        issuer: "",
        issuerDate: null,
        issuerNumber: null,
        firstName: "",
        lastName: "",
        employeeNumber: "",
        costCenter: "",
        entity: "",
        positionTitle: "",
        travelType: "",
        travelPurpose: "",
        participants: "",
        destination: "",
        travelDepartureDate: null,
        travelArrivalDate: null,
        travelEstimatedDuration: null,
        travelCurrency: {},
        travelNote: null,
        travelBudget: null,
        flightTicketReason: {},
        flightTicketType: {},
        carRentalFrom: "",
        carRentalTo: "",
        carRentalOn: "",
        carRentalUntil: "",
        carRentalBirthDate: null,
        carDrivingLicense: "",
        carRentalCategory: "",
        carRentalNote: "",
        personalCarDrivingLicenseNumber: "",
        personalCarRegistrationNumber: "",
        personalCarNote: "",
        trainTicketType: {},
        hotelLocation: "",
        hotelNumberOfNights: null,
        hotelCheckIn: null,
        hotelCheckOut: null,
        hotelNote: "",
        // itineraryTotal: "",
        approver1: {},
        approver2: {},
        itineraryRelation: []
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
    const createUniqueId = async () => {
        const count = (await TravelRequestFormService.fetchCount()).data.totalCount;
        const now = new Date();
        const year = String(now.getFullYear()).slice(-2); // Last two digits of the year
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month, zero-padded
        const seq = String(count).padStart(4, '0');
        const uniqId = `TR${year}${month}${seq}`;
        setFormData(prevFormData => ({
            ...prevFormData, // Spread the existing formData
            travelRequestId : uniqId
        }));
        return uniqId;
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

    useEffect(() => {
        setFormData({
            ...formData,
            itineraryRelation: itineraries
        })
    }, [itineraries]);


    // handle save button
    useEffect(() => {
        console.log("Itenarary : ", newItinerary);
        console.log("show ", showReturnFields);
        if (newItinerary.onwardJourney !== '' && newItinerary.onwardDepartureDate !== null && newItinerary.onwardPreferredTime !== null && newItinerary.onwardTransportNumber !== '' && !showReturnFields) {
            setSaveItineraryFlag(false)
        } else if (newItinerary.onwardJourney !== '' && newItinerary.onwardDepartureDate !== null && newItinerary.onwardPreferredTime !== null && newItinerary.onwardTransportNumber !== '' && showReturnFields && newItinerary.returnJourney !== '' && newItinerary.returnArrivalDate !== null && newItinerary.returnPreferredTime !== null && newItinerary.returnTransportNumber !== '') {
            setSaveItineraryFlag(false)
        } else {
            setSaveItineraryFlag(true)
        }

    }, [newItinerary, showReturnFields]);

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submission started");
        const uniqId = await createUniqueId();
        console.log("unique Id : " , uniqId);
        try {
            const response = await TravelRequestFormService.submitFormData(formData);
            setMessage(`Successfully created Id : ${response.data.id}`);
            setOpen(true);
        } catch (error) {
            console.error("Error submitting form", error);
            setMessage(`Error response : ${error.response.data.title}`);
            setOpen(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default action (form submission)
        }
    };


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const validateEmployeeEmail = () => {
        return userList.some(user => {
            if( user.email.toLowerCase() ===  ( typeof selectedEmployee === 'object' ? selectedEmployee.email.toLowerCase() : selectedEmployee.toLowerCase()) ){
                setFormData({
                    ...formData, // Spread the existing formData
                    firstName: user.firstName, // Update only the firstName property
                    lastName: user.lastName,
                    employeeNumber: user.employeeNumber,
                    costCenter: user.costCenter,
                    entity: user.entity,
                    positionTitle: user.positionTitle
                });
                return true;
            }
            return false;
            });
      };
    
      // Function to handle blur event for validation
      const handleBlur = () => {
        if (selectedEmployee === null)
            setIsEmployeeEmailValid(true)
        else
            setIsEmployeeEmailValid(validateEmployeeEmail());
      };

    const validateManagerEmail = () => {
        return userList.some(user => {
            if( user.email.toLowerCase() ===  ( typeof selectedItem === 'object' ? selectedItem.email.toLowerCase() : selectedItem.toLowerCase()) ){
                setFormData({
                    ...formData, // Spread the existing formData
                    approver1: {
                        key : user.firstName
                    }
                });
                return true;
            }
            return false;
            });
      };
    
      // Function to handle blur event for validation
      const handleBlur2 = () => {
        if (selectedItem === null)
            setIsManagerEmailValid(true)
        else
            setIsManagerEmailValid(validateManagerEmail());
      };
    const validateHODEmail = () => {
        return userList.some(user => {
            if( user.email.toLowerCase() ===  ( typeof selectedItem2 === 'object' ? selectedItem2.email.toLowerCase() : selectedItem2.toLowerCase()) ){
                setFormData({
                    ...formData, // Spread the existing formData
                    approver2: {
                        key : user.firstName
                    }
                });
                return true;
            }
            return false;
            });
      };
    
      // Function to handle blur event for validation
      const handleBlur3 = () => {
        if (selectedItem === null)
            setIsHODEmailValid(true)
        else
            setIsHODEmailValid(validateHODEmail());
      };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div className="form-container">
            <form className="travel-form" onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
                <div className="header-strip">
                    <h2 className="header-text">Travel Request Form </h2>
                </div>
                <div className="form-row-first-parentblock">
                    <div className="p-inputgroup flex-1">
                        <FloatLabel>
                            <InputText id="issuer" value={formData.issuer}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    issuer: e.target.value
                                })} />
                            <label htmlFor="issuer"><strong>Issuer</strong></label>
                        </FloatLabel>
                    </div>
                    <div className="p-inputgroup flex-1">
                        <FloatLabel>
                            <Calendar id="issuerDate" dateFormat="dd/mm/yy" value={formData.issuerDate}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    issuerDate: e.value
                                })} showIcon />
                            <label htmlFor="issuerDate">Issuer Date</label>
                        </FloatLabel>
                    </div>
                    <div className="p-inputgroup flex-1">
                        <FloatLabel>
                            <InputNumber id="number-input" value={formData.issuerNumber}
                                onValueChange={(e) => setFormData({
                                    ...formData,
                                    issuerNumber: e.target.value
                                })} />
                            <label htmlFor="number-input">Number</label>
                        </FloatLabel>
                    </div>
                    {/* </FloatLabel> */}
                    {/* <div className="form-single">
                        <label htmlFor="telephoneNumber"><strong>Telephone Number</strong></label>
                        <input type="text" id="telephoneNumber" name="telephoneNumber" />
                    </div> */}
                    {/* <PhoneNumberInput /> */}
                    {/* <span className="p-inputgroup-addon">.00</span> */}
                </div>
                <h2 className="form-heading"><strong>Traveller Identification</strong></h2>
                <hr className="separator" />
                <div className="form-row">
                    <div className="form-group">
                        <div className="form-row-travellerID">
                            <div className="form-single">
                                <FloatLabel>
                                    <AutoComplete
                                        id="employeeEmail"
                                        value={selectedEmployee}
                                        suggestions={employeeDropDownSuggestions}
                                        completeMethod={searchEmployee}
                                        field="email"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setSelectedEmployee(e.value);
                                            setFormData({
                                                ...formData, // Spread the existing formData
                                                firstName: '', // Update only the firstName property
                                                lastName: '',
                                                employeeNumber: '',
                                                costCenter: '',
                                                entity: '',
                                                positionTitle: ''
                                            });
                                            setSelectedItem('');
                                            setSelectedItem2('');
                                        }}
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
                                        required
                                    />
                                    <label htmlFor="employeeEmail">{!isEmployeeEmailValid && <strong style={{ color: 'red' }}>Email not in the list</strong>} {isEmployeeEmailValid && <strong>Email</strong>}</label>
                                    
                                </FloatLabel>
                            </div>
                            <div className="form-single-special">
                                <FloatLabel>
                                    <InputText type="text" id="firstName" name="firstName" value={formData.firstName} required readOnly />
                                    <label htmlFor="firstName"><strong>First Name</strong></label>
                                </FloatLabel>
                            </div>

                            <div className="form-single-special">
                                <FloatLabel>
                                    <InputText type="text" id="lastName" name="lastName" value={formData.lastName} required readOnly />
                                    <label htmlFor="lastName"><strong>Last Name</strong></label>
                                </FloatLabel>
                            </div>
                            <div className="form-single-special">
                                <FloatLabel>
                                    <InputText type="text" id="employeeNumber" name="employeeNumber" value={formData.employeeNumber} required readOnly />
                                    <label htmlFor="employeeNumber"><strong>Employee Number</strong></label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="form-row-travellerID-row2">
                    <div className="form-single-special">
                        <FloatLabel>
                            <InputText type="text" id="costCenter" name="costCenter" value={formData.costCenter} required readOnly />
                            <label htmlFor="costCenter"><strong>Cost Centre</strong></label>
                        </FloatLabel>
                    </div>
                    <div className="form-single-special">
                        <FloatLabel>
                            <InputText type="text" id="entity" name="entity" value={formData.entity} required readOnly />
                            <label htmlFor="entity"><strong>Entity</strong></label>
                        </FloatLabel>
                    </div>
                    <div className="form-single-special">
                        <FloatLabel>
                            <InputText type="text" id="positionTitle" name="positionTitle" value={formData.positionTitle} required readOnly />
                            <label htmlFor="positionTitle"><strong>Position Title</strong></label>
                        </FloatLabel>
                    </div>

                </div>
                <h2 className="form-heading"><strong>Travel Details</strong></h2>
                <hr className="separator" />
                <div className="travel-type">
                    <label htmlFor="travelType" className="mr-2">Travel Type:</label>
                    <div className="radio-group">
                        <RadioButton inputId="domestic" name="travelType" value="domestic"
                            onChange={(e) => setFormData({
                                ...formData,
                                travelType: e.value
                            })}
                            checked={formData.travelType === 'domestic'} required />
                        <label htmlFor="domestic" className="mr-2">Domestic</label>

                        <RadioButton inputId="international" name="travelType" value="international"
                            onChange={(e) => setFormData({
                                ...formData,
                                travelType: e.value
                            })}
                            checked={formData.travelType === 'international'} required />
                        <label htmlFor="international" className="mr-2">International</label>
                    </div>
                </div>


                <FloatLabel>
                    <InputTextarea id="travelPurpose" className="full-width-textarea" value={formData.travelPurpose}
                        onChange={(e) => setFormData({
                            ...formData,
                            travelPurpose: e.target.value
                        })} rows={3} cols={30} required />
                    <label htmlFor="travelPurpose">Travel Purpose</label>
                </FloatLabel>

                <FloatLabel>
                    <InputText id="destination" className="full-width-textarea" value={formData.destination}
                        onChange={(e) => setFormData({
                            ...formData,
                            destination: e.target.value
                        })} rows={3} cols={30} required />
                    <label htmlFor="destination">Destination </label>
                </FloatLabel>
                <div className="calendar-container">
                    <div className="calendar-item">
                        <FloatLabel>
                            <Calendar id="departureDate" dateFormat="dd/mm/yy" value={formData.travelDepartureDate}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        travelDepartureDate: e.value
                                    })
                                    calculateEstimatedDuration(e.value, formData.travelArrivalDate)
                                }} required showIcon />
                            <label htmlFor="departureDate" className="mr-2">Departure Date</label>
                        </FloatLabel>
                    </div>
                    <div className="calendar-item">
                        <FloatLabel>
                            <Calendar id="returnDate" dateFormat="dd/mm/yy" value={formData.travelArrivalDate}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        travelArrivalDate: e.value
                                    })
                                    calculateEstimatedDuration(formData.travelDepartureDate, e.value)
                                }}
                                showIcon
                                required />
                            <label htmlFor="returnDate" className="mr-2">Return Date</label>
                        </FloatLabel>
                    </div>
                    <div className="calendar-item">
                        <FloatLabel>
                            <label htmlFor="estimatedduration" className="mr-2">Estimated Duration </label>
                            <InputText id="estimatedduration" value={formData.travelEstimatedDuration} readOnly />
                        </FloatLabel>
                    </div>
                </div>

                <FloatLabel>
                    <InputTextarea id="participants" className="full-width-textarea" value={formData.participants}
                        onChange={(e) => setFormData({
                            ...formData,
                            participants: e.target.value
                        })} rows={3} cols={30} />
                    <label htmlFor="participants">Participants</label>
                </FloatLabel>
                <div className="currency">
                    <div className="currencybug">
                        <Dropdown placeholder="Currency" value={currencyValue} onChange={(e) => {
                            setCurrencyValue(e.value);
                            setFormData({
                                ...formData,
                                travelCurrency: {
                                    key: e.value.key,
                                }
                            });
                        }} options={currencyList} optionLabel="name" required />
                    </div>
                    <div className="currencybug">
                        <FloatLabel>
                            <InputNumber id="budgetAmount" value={formData.travelBudget}
                                onValueChange={(e) => setFormData({
                                    ...formData,
                                    travelBudget: e.target.value
                                })} required />
                            <label htmlFor="budgetAmount">Budget Amount</label>
                        </FloatLabel>
                    </div>
                    <div className="currencybug">
                        <FloatLabel>
                            <InputText id="Note" value={formData.travelNote}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    travelNote: e.target.value
                                })} />
                            <label htmlFor="Note">Note: </label>
                        </FloatLabel>
                    </div>
                </div>

                <hr className="separator" />

                <div className="form-row">
                    <div className="form-group">
                        <FloatLabel>
                            <AutoComplete
                                id="manager"
                                value={selectedItem}
                                suggestions={dropDownSuggestions}
                                completeMethod={searchItem}
                                field="email"
                                onBlur={handleBlur2}
                                onChange={(e) => {
                                    setSelectedItem(e.value);
                                    setFormData({
                                        ...formData, // Spread the existing formData
                                        approver2: {}
                                    });
                                    setSelectedItem2('');
                                }}
                                onSelect={(e) => {
                                    setSelectedItem(e.value);
                                    setFormData({
                                        ...formData, // Spread the existing formData
                                        approver1: {
                                            key: e.value.firstName,
                                        }
                                    });
                                    console.log("value : " + JSON.stringify(e.value.email));
                                }}
                                itemTemplate={itemTemplate}
                                disabled={selectedEmployee === null || selectedEmployee === ''}
                                required
                            />
                            <label htmlFor="manager">{!isManagerEmailValid && <strong style={{ color: 'red' }}>Email not in the list</strong>} {isManagerEmailValid && <strong>Manager</strong>}</label>
                        </FloatLabel>
                    </div>
                    <div className="form-group">
                        <FloatLabel>
                            <AutoComplete
                                id="hod"
                                value={selectedItem2}
                                suggestions={dropDownSuggestions2}
                                completeMethod={searchItem2}
                                field="email"
                                onBlur={handleBlur3}
                                onChange={(e) => setSelectedItem2(e.value)}
                                onSelect={(e) => {
                                    setSelectedItem2(e.value);
                                    setFormData({
                                        ...formData, // Spread the existing formData
                                        approver2: {
                                            key: e.value.firstName,
                                        }
                                    });
                                    console.log("value : " + JSON.stringify(e.value.email));
                                }}
                                itemTemplate={itemTemplate}
                                disabled={selectedItem === null || selectedItem === ''}
                            />
                            <label htmlFor="hod">{!isHODEmailValid && <strong style={{ color: 'red' }}>Email not in the list</strong>} {isHODEmailValid && <strong>HOD/GM/VP</strong>}</label>
                        </FloatLabel>
                    </div>
                </div>
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
                    // <div className="form-single" id="nightsContainer">
                    <div className="calendar-container">
                        <div className="calendar-item">
                            <FloatLabel>
                                <label htmlFor="location">Location</label>
                                <InputText id="location" name="location" required
                                    value={formData.hotelLocation}
                                    onChange={(e) => setFormData({
                                        ...formData, // Spread the existing formData
                                        hotelLocation: e.target.value // Update only the firstName property
                                    })} />
                            </FloatLabel>
                        </div>
                        <div className="calendar-item">
                            <FloatLabel>
                                <Calendar id="checkIn" dateFormat="dd/mm/yy" value={formData.hotelCheckIn}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            hotelCheckIn: e.value
                                        });
                                        calculateEstimatedNights(e.value, formData.hotelCheckOut);
                                    }} showTime hourFormat="24" showIcon />
                                <label htmlFor="checkIn" className="mr-2">Check In</label>
                            </FloatLabel>
                        </div>
                        <div className="calendar-item">
                            <FloatLabel>
                                <Calendar id="checkOut" dateFormat="dd/mm/yy" value={formData.hotelCheckOut}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            hotelCheckOut: e.value
                                        });
                                        calculateEstimatedNights(formData.hotelCheckIn, e.value);
                                    }} showTime hourFormat="24" showIcon />
                                <label htmlFor="checkOut" className="mr-2">Check Out</label>
                            </FloatLabel>
                        </div>
                        <div className="calendar-item">
                            <FloatLabel>
                                <label htmlFor="nights">Number of Nights</label>
                                <InputNumber id="nights" name="nights" required
                                    value={formData.hotelNumberOfNights}
                                    // onChange={(e) => setFormData({
                                    //     ...formData, // Spread the existing formData
                                    //     hotelNumberOfNights: e.target.value // Update only the firstName property
                                    // })} 
                                    readOnly />
                            </FloatLabel>
                        </div>
                        <div className="calendar-item">
                            <FloatLabel>
                                <label htmlFor="hotelNote">Note</label>
                                <InputText id="hotelNote" name="hotelNote" required
                                    value={formData.hotelNote}
                                    onChange={(e) => setFormData({
                                        ...formData, // Spread the existing formData
                                        hotelNote: e.target.value // Update only the firstName property
                                    })} />
                            </FloatLabel>
                        </div>
                    </div>
                    // </div>
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
                        <div className="calendar-container">
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="category">Category</label>
                                    <InputText type="text" id="category" name="category" required
                                        value={formData.carRentalCategory}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            carRentalCategory: e.target.value
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                            {/* <div className="form-row"> */}
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="from">From:</label>
                                    <InputText type="text" id="from" name="from" required
                                        value={formData.carRentalFrom}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            carRentalFrom: e.target.value
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="on">On:</label>
                                    <InputText type="text" id="on" name="on" required
                                        value={formData.carRentalOn}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            carRentalOn: e.target.value
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="to">To:</label>
                                    <InputText type="text" id="to" name="to" required
                                        value={formData.carRentalTo}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            carRentalTo: e.target.value
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="until">Until:</label>
                                    <InputText type="text" id="until" name="until" required
                                        value={formData.carRentalUntil}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            carRentalUntil: e.target.value
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                        </div>
                        <br></br>
                        <div className="calendar-container">
                            <div className="calendar-item">
                                {/* <label htmlFor="birthDate">Birth Date</label>
                                <input type="date" id="birthDate" name="birthDate" required
                                    value={formData.carRentalBirthDate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        carRentalBirthDate: e.target.value
                                    })} /> */}
                                <FloatLabel>
                                    <Calendar id="issuerDate" dateFormat="dd/mm/yy" value={formData.carRentalBirthDate}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            carRentalBirthDate: e.value
                                        })} showIcon />
                                    <label htmlFor="issuerDate">Issuer Date</label>
                                </FloatLabel>
                            </div>
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="drivingLicense">Driving License</label>
                                    <InputText type="text" id="drivingLicense" name="drivingLicense" required
                                        value={formData.carDrivingLicense}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            carDrivingLicense: e.target.value
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="carRentalNote">Note</label>
                                    <InputText id="carRentalNote" name="carRentalNote"
                                        value={formData.carRentalNote}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            carRentalNote: e.target.value
                                        })}
                                    />
                                </FloatLabel>
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
                        <div className="calendar-container">
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="carRegNum">Car Registration Number</label>
                                    <InputText type="text" id="carRegNum" name="carRegNum" required
                                        value={formData.personalCarRegistrationNumber}
                                        onChange={(e) => setFormData({
                                            ...formData, // Spread the existing formData
                                            personalCarRegistrationNumber: e.target.value // Update only the firstName property
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="drivingLicenseNum">Driving License Number</label>
                                    <InputText type="text" id="drivingLicenseNum" name="drivingLicenseNum" required
                                        value={formData.personalCarDrivingLicenseNumber}
                                        onChange={(e) => setFormData({
                                            ...formData, // Spread the existing formData
                                            personalCarDrivingLicenseNumber: e.target.value // Update only the firstName property
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                            <div className="calendar-item">
                                <FloatLabel>
                                    <label htmlFor="personalCarNote">Note</label>
                                    <InputText id="personalCarNote" name="personalCarNote"
                                        value={formData.personalCarNote}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            personalCarNote: e.target.value
                                        })}
                                    />
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                )}
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
                                                onChange={(e) => {
                                                    setFlightTypeValue(e.value)
                                                    setFormData({
                                                        ...formData,
                                                        flightTicketType: {
                                                            key: e.value.key,
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
                        <p>Note: Kindly attach the 3 quotes/routes provided by Travel Agent htmlFor comparison. If the least cost-saving route is not taken, kindly provide the reason below.</p>
                        <div className="form-dropdown-container">
                            <label htmlFor="reason">Reason</label>
                            <Dropdown inputId="dd-city" value={reasonValue} onChange={(e) => {
                                setReasonValue(e.value);
                                setFormData({
                                    ...formData, // Spread the existing formData
                                    flightTicketReason: {
                                        key: e.value.key,
                                        // name: e.value.name // Update only the firstName property
                                    }
                                });
                            }} options={reasonList} optionLabel="name" className="w-full" />

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
                    {/* <button type="button" onClick={handleAddItineraryClick}>
                        {showItinerary ? "Hide Itinerary" : "Add Itinerary"}
                    </button> */}
                    <Button onClick={() => {
                        setShowItinerary(!showItinerary);
                    }}
                        type="button" label="Add Itinerary" badge={itineraries.length} />
                </div>

                {showItinerary && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseItineraryClick}>&times;</span>
                            {/* <div className="itinerary-form">
                                <div className="form-row">
                                    <div className="form-group">

                                        <FloatLabel>
                                            <InputText id="itFrom" value={newItinerary.itFrom} onChange={e => handleInputChange('itFrom', e)} />
                                            <label htmlFor="itFrom">From</label>
                                        </FloatLabel>
                                    </div>
                                    <div className="form-group">

                                        <FloatLabel>
                                            <InputText id="itTo" value={newItinerary.itTo} onChange={e => handleInputChange('itTo', e)} />
                                            <label htmlFor="itTo">To</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="departure">Departure</label>

                                        <Calendar id="departure" dateFormat="dd/mm/yy" value={newItinerary.departure} onChange={(e) => handleInputChange('departure', e)} showIcon />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="arrival">Arrival</label>
                                        <Calendar id="arrival" dateFormat="dd/mm/yy" value={newItinerary.arrival} onChange={(e) => handleInputChange('arrival', e)} showIcon />
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="form-group">
                                        <FloatLabel>
                                            <InputText id="flightNumber" value={newItinerary.flightNumber} onChange={e => handleInputChange('flightNumber', e)} />
                                            <label htmlFor="flightNumber">Flight Number</label>
                                        </FloatLabel>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="showReturnFields">Show Return Trip</label>
                                        <InputSwitch checked={showReturnFields} onChange={(e) => setShowReturnFields(e.value)} />
                                    </div>
                                </div>

                                {showReturnFields && (
                                    <>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <FloatLabel>
                                                    <InputText id="returnFrom" value={newItinerary.returnFrom} onChange={e => handleInputChange('returnFrom', e)} />
                                                    <label htmlFor="returnFrom">Return From</label>
                                                </FloatLabel>
                                            </div>
                                            <div className="form-group">
                                                <FloatLabel>
                                                    <InputText id="returnTo" value={newItinerary.returnTo} onChange={e => handleInputChange('returnTo', e)} />
                                                    <label htmlFor="returnTo">Return To</label>
                                                </FloatLabel>
                                            </div>
                                        </div><div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="returnDeparture">Return Departure</label>
                                                <Calendar id="returnDeparture" dateFormat="dd/mm/yy" value={newItinerary.returnDeparture} onChange={(e) => handleInputChange('returnDeparture', e)} showIcon />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="returnArrival">Return Arrival</label>
                                                <Calendar id="returnArrival" dateFormat="dd/mm/yy" value={newItinerary.returnArrival} onChange={(e) => handleInputChange('returnArrival', e)} showIcon />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <FloatLabel>
                                                    <InputText id="returnFlightNumber" value={newItinerary.returnFlightNumber} onChange={e => handleInputChange('returnFlightNumber', e)} />
                                                    <label htmlFor="returnFlightNumber">Return Flight Number</label>
                                                </FloatLabel>
                                            </div></div>
                                    </>
                                )}
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
                            </div> */}
                            <div className="itinerary-form">
                                <div className="form-row">
                                    <div >
                                        <FloatLabel>
                                            <InputText id="onwardJourney" value={newItinerary.onwardJourney} onChange={e => handleInputChange('onwardJourney', e)} />
                                            <label htmlFor="onwardJourney">Onward Journey</label>
                                        </FloatLabel>
                                    </div>
                                    <div >
                                        <FloatLabel>
                                            <Calendar id="onwardDepartureDate" dateFormat="dd/mm/yy" value={newItinerary.onwardDepartureDate} onChange={(e) => handleInputChange('onwardDepartureDate', e)} showIcon />
                                            <label htmlFor="onwardDepartureDate">Departure Date</label>
                                        </FloatLabel>
                                    </div>
                                    <div >
                                        <FloatLabel>
                                            <Dropdown id="onwardPreferredTime" className="onwardDepartureDate"
                                                value={newItinerary.onwardPreferredTime}
                                                onChange={e => handleInputChange('onwardPreferredTime', e)} options={preferredTimeList} optionLabel="name" />
                                            <label htmlFor="onwardPreferredTime">Preferred Time</label>
                                        </FloatLabel>
                                    </div>
                                    <div >
                                        <FloatLabel>
                                            <InputText id="onwardTransportNumber" value={newItinerary.onwardTransportNumber} onChange={e => handleInputChange('onwardTransportNumber', e)} />
                                            <label htmlFor="onwardTransportNumber"> Flight/Train Number</label>
                                        </FloatLabel>
                                    </div>
                                    <div >
                                        <FloatLabel>
                                            <InputText id="onwardJourneyNote" value={newItinerary.onwardJourneyNote} onChange={e => handleInputChange('onwardJourneyNote', e)} />
                                            <label htmlFor="onwardJourneyNote">Onward Journey Note</label>
                                        </FloatLabel>
                                    </div>

                                </div>
                                <div className="form-row">
                                    <div className="form-group SRT">
                                        <label htmlFor="showReturnFields">Show Return Trip</label>
                                        <InputSwitch checked={showReturnFields} onChange={(e) => setShowReturnFields(e.value)} />
                                    </div>
                                </div>

                                {showReturnFields && (
                                    <>
                                        <div className="form-row2">
                                            <div >
                                                <FloatLabel>
                                                    <InputText id="returnJourney" value={newItinerary.returnJourney} onChange={e => handleInputChange('returnJourney', e)} />
                                                    <label htmlFor="returnJourney">Return Journey</label>
                                                </FloatLabel>
                                            </div>
                                            <div >
                                                <FloatLabel>
                                                    <Calendar id="returnArrivalDate" dateFormat="dd/mm/yy" value={newItinerary.returnArrivalDate} onChange={(e) => handleInputChange('returnArrivalDate', e)} showIcon />
                                                    <label htmlFor="returnArrivalDate">Arrival Date</label>
                                                </FloatLabel>
                                            </div>
                                            <div className="returnpreferredTime">
                                                <FloatLabel>
                                                    <Dropdown id="returnpreferredTime" className="onwardDepartureDate"
                                                        value={newItinerary.returnPreferredTime}
                                                        onChange={e => handleInputChange('returnPreferredTime', e)} options={preferredTimeList} optionLabel="name" />
                                                    <label htmlFor="returnpreferredTime">Preferred Time</label>
                                                </FloatLabel>
                                            </div>
                                            <div >
                                                <FloatLabel>
                                                    <InputText id="returnTransportNumber" value={newItinerary.returnTransportNumber} onChange={e => handleInputChange('returnTransportNumber', e)} />
                                                    <label htmlFor="returnTransportNumber"> Flight/Train Number</label>
                                                </FloatLabel>
                                            </div>
                                        </div> </>)}

                                <div className="savebtn">
                                    <Button onClick={handleSaveItinerary} label="Save" disabled={saveItineraryFlag} />
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {itineraries.length > 0 && (
                    <div className="itinerary-table">
                        <h3>Saved Itineraries</h3>
                        {/* <table>
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
                        </table> */}
                        <DataTable value={itineraries} showGridlines tableStyle={{ minWidth: '50rem' }}>
                            {/*<Column sortable field="price" header="Price incl. VAT" /> */}
                            <Column sortable field="onwardJourney" header="Onward Journey" headerClassName="custom-header" />
                            <Column sortable field="onwardDepartureDate" header="Departure Date" body={(rowData) => formatDate(rowData.onwardDepartureDate)} headerClassName="custom-header" />
                            <Column sortable field="onwardPreferredTime" header="Onward Preferred Time" body={(rowData) => formatPickList(rowData.onwardPreferredTime)} headerClassName="custom-header" />
                            <Column sortable field="onwardTransportNumber" header="Onward Transport Number" headerClassName="custom-header" />
                            <Column sortable field="onwardJourneyNote" header="Note" headerClassName="custom-header" />
                            <Column sortable field="returnJourney" header="Return Journey" headerClassName="custom-header" />
                            <Column sortable field="returnArrivalDate" header="Arrival Date" body={(rowData) => formatDate(rowData.returnArrivalDate)} headerClassName="custom-header" />
                            <Column sortable field="returnPreferredTime" header="Return Preferred Time" body={(rowData) => formatPickList(rowData.returnPreferredTime)} headerClassName="custom-header" />
                            <Column sortable field="returnTransportNumber" header="Return Transport Number" headerClassName="custom-header" />
                            <Column header="Actions" headerClassName="custom-header"
                                body={(rowData, { rowIndex }) => (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button type="button" icon="pi pi-pencil" style={{ marginRight: '0.5rem' }}
                                            onClick={() => handleEditItinerary(rowIndex)} />
                                        <Button type="button" severity="danger" icon="pi pi-trash"
                                            onClick={() => handleRemoveItinerary(rowIndex)} />
                                    </div>
                                )}
                            />
                        </DataTable>
                        {/* <div className="total-price">
                            <strong>Total Price incl. VAT:</strong> {calculateTotalPrice()}
                        </div> */}
                    </div>
                )}

                {/* <button type="submit">Submit</button> */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        style={{
                            border: 'none', // Remove border
                            borderRadius: '4px', // Set a small border radius (adjust as needed)
                            backgroundColor: '#1679AB',
                            padding: '0.5rem 1rem', // Adjust padding to control button size
                            width: '15%', // Set the width of the button (e.g., 25% of the container)
                            fontWeight: 'bold'
                        }}
                        type="submit"
                        label="Submit"
                    />
                </div>

            </form>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={action}
            ></Snackbar>
        </div>
    );
}

export default TravelRequestForm;

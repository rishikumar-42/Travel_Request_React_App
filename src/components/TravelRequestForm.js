import React, { useEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import TravelRequestFormService from "../service/TravelRequestFormService.js";
import "../assets/css/TravelRequestForm.css";
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';
import { AutoComplete } from "primereact/autocomplete";
import { Toast } from 'primereact/toast';
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
import { Tooltip } from 'primereact/tooltip';
import HelpIcon from '@mui/icons-material/Help';
import { Dialog } from 'primereact/dialog';
import "../assets/css/Style.css";
import FormPreview from "./FormPreview.js";

function TravelRequestForm() {
    const primary = "#fff"; // #f44336
    const [visible, setVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
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
    const [isEmailValidSubmit, setIsEmailValidSubmit] = useState(true);
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
    const [selectedItem, setSelectedItem] = useState('');
    const [dropDownSuggestions2, setdropDownSuggestions2] = useState([]);
    const [selectedItem2, setSelectedItem2] = useState('');
    const [employeeDropDownSuggestions, setEmployeeDropDownSuggestions] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const [showReturnFields, setShowReturnFields] = useState(false);
    const [saveItineraryFlag, setSaveItineraryFlag] = useState(true);
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    // const [fileError, setFileError] = useState('');

    const toast = useRef(null);

    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 10000 });
    }

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 100000) {
                // setFileError('File size exceeds the maximum limit.');
                showMessage('error', 'Error', 'File size exceeds the maximum limit')
                return;
            }
            setFile(selectedFile);
        }
    };
    const handleRemovefiles = async (rowIndex) => {
        const selectedFile = files[rowIndex];
        console.log("selected file : ", selectedFile)
        try {
            await TravelRequestFormService.deleteDocuments(selectedFile.id)
            showMessage('success', 'Success', `Successfully removed ${selectedFile.title}`)
            setFiles(files.filter((_, i) => i !== rowIndex));
        } catch (error) {
            console.log("error while deleting : ", error)
            showMessage('error', 'Error', `Error response : ${error.response.data.title}`)
            // setFileError(error)
        }
    };

    const onFileUpload = async () => {
        if (!file) {
            // setFileError('No file selected.');
            showMessage('error', 'Error', 'No file selected.')
            return;
        }

        try {
            const fileResponse = await TravelRequestFormService.addDocuments(file);
            const tempFile = {
                id: fileResponse.id,
                title: fileResponse.title,
                contentUrl: fileResponse.contentUrl
            };
            setFiles([...files, tempFile]);
            setFile(null)
            showMessage('success', 'Success', `Successfully uploaded ${fileResponse.title}`)
        } catch (error) {
            // setFileError(error.title)
            showMessage('error', 'Error', `Error response : ${error.response.data.title}`)

        }

        // const formData = new FormData();
        // formData.append('file', file);

        // axios.post(url, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     },
        // })
        //     .then((response) => {
        //         console.log(response.data);
        //     })
        //     .catch((error) => {
        //         console.error('Error uploading file:', error);
        //         setFileError('Error uploading file.');
        //     });
    };

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

    //const calculateTotalPrice = () => {
    //    return itineraries.reduce((total, itinerary) => {
    //        return total + parseFloat(itinerary.price || 0);
    //    }, 0).toFixed(2);
    //};

    const handleHotelToggleChange = (event) => {
        setShowNights(event.target.checked);
        if (!event.target.checked) {
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                hotelNumberOfNights: null,
                hotelCheckIn: null,
                hotelCheckOut: null,
                hotelLocation: '',
                hotelNote: '',
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
                carRentalNote: ""
            }))
        }
    };

    const handlePerCarToggleChange = (event) => {
        setPerCarDetails(event.target.checked);
        if (!event.target.checked) {
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                personalCarDrivingLicenseNumber: "",
                personalCarRegistrationNumber: "",
                personalCarNote: ""
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
                // name: firstFlightType.name // Update the trainTicketType properties
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
        travelRequestId: "",
        issuer: "",
        issuerDate: null,
        issuerNumber: null,
        email: "",
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
        //itineraryTotal: "",
        //approver1: {},
        //approver2: {},
        manager: '',
        hod: '',
        itineraryRelation: [],
        attachmentRelation: []
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
                // name: firstTrainType.name // Update the trainTicketType properties
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
    useEffect(() => {
        setFormData({
            ...formData,
            attachmentRelation: files
        })
    }, [files]);


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
        setPreviewVisible(false)
        console.log("Form submission started");
        const uniqId = await createUniqueId();
        console.log("unique Id : ", uniqId);
        setFormData({
            ...formData,
            travelRequestId: uniqId
        });
        console.log('form submit :', formData)
        try {
            const response = await TravelRequestFormService.submitFormData({
                ...formData,
                travelRequestId: uniqId
            });
            // setMessage(`Successfully created Id : ${response.data.travelRequestId}`);
            showMessage('success', 'Success', `Successfully created Id : ${response.data.travelRequestId}`)
            setTimeout(() => {
                window.location.reload();
            }, 5000);
            // setOpen(true);
        } catch (error) {
            console.error("Error submitting form", error);
            // setMessage(`Error response : ${error.response.data.title}`);
            showMessage('error', 'Error', `Error response : ${error.response.data.title}`)
            // setOpen(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default action (form submission)
        }
    };

    // const handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpen(false);
    //     window.location.reload();
    // };

    const validateEmployeeEmail = () => {
        return userList.some(user => {
            if (user.email.toLowerCase() === (typeof selectedEmployee === 'object' ? selectedEmployee.email.toLowerCase() : selectedEmployee.toLowerCase())) {
                setFormData({
                    ...formData, // Spread the existing formData
                    email: user.email,
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
            setIsEmployeeEmailValid(false)
        else
            setIsEmployeeEmailValid(validateEmployeeEmail());
    };

    const validateManagerEmail = () => {
        return userList.some(user => {
            if (user.email.toLowerCase() === (typeof selectedItem === 'object' ? selectedItem.email.toLowerCase() : selectedItem.toLowerCase())) {
                setFormData({
                    ...formData, // Spread the existing formData
                    // approver1: {
                    //     key : user.firstName
                    // }
                    manager: user.email
                });
                return true;
            }
            return false;
        });
    };

    // Function to handle blur event for validation
    const handleBlur2 = () => {
        if (selectedItem === null)
            setIsManagerEmailValid(false)
        else
            setIsManagerEmailValid(validateManagerEmail());
    };
    const validateHODEmail = () => {
        return userList.some(user => {
            if (user.email.toLowerCase() === (typeof selectedItem2 === 'object' ? selectedItem2.email.toLowerCase() : selectedItem2.toLowerCase())) {
                setFormData({
                    ...formData, // Spread the existing formData
                    // approver2: {
                    //     key : user.firstName
                    // }
                    hod: user.email
                });
                return true;
            }
            return false;
        });
    };

    // Function to handle blur event for validation
    const handleBlur3 = () => {
        if (selectedItem2 === '')
            setIsHODEmailValid(true)
        else
            setIsHODEmailValid(validateHODEmail());
    };

    useEffect(() => {
        console.log("status :", (!isManagerEmailValid || !isHODEmailValid))
        setIsEmailValidSubmit((!isManagerEmailValid || selectedItem === '') || !isHODEmailValid);
    }, [isHODEmailValid, isManagerEmailValid]);



    // const emailSubmitValidation = () => {
    //     const employeeValid = !isEmployeeEmailValid || (typeof selectedEmployee === 'object' ? selectedEmployee.email : selectedEmployee)==='';
    //     const managerValid = !isManagerEmailValid || (typeof selectedItem === 'object' ? selectedItem.email : selectedItem)==='';
    //     const hodValid = !isHODEmailValid && (typeof selectedItem2 === 'object' ? selectedItem2.email : selectedItem2)==='';
    //     console.log(isManagerEmailValid , " :-- " ,isHODEmailValid)
    //     return (!isManagerEmailValid && !isHODEmailValid)
    // };

    // const action = (
    //     <React.Fragment>
    //         <Button color="secondary" size="small" onClick={handleClose}>
    //             UNDO
    //         </Button>
    //         <IconButton
    //             size="small"
    //             aria-label="close"
    //             color="inherit"
    //             onClick={handleClose}
    //         >
    //             <CloseIcon fontSize="small" />
    //         </IconButton>
    //     </React.Fragment>
    // );

    return (
        <div className="form-container mx-5">
            <div className="bg-white align-items-start px-3 rounded-bottom-2 mb-3 pt-3 pb-3 shadow-sm">
                <Toast ref={toast} position="top-center" />
                <form className="travel-form p-0" onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
                    <div className="bg-color px-3 py-1 rounded-top-2 d-flex justify-content-between align-items-center w-100">
                        <div className="align-items-start"><h5 className="text-white text-left mt-2">Travel Request</h5></div>
                        <div className="align-items-end">
                            <HelpIcon onClick={() => setVisible(true)} sx={{ color: primary }} />
                            <Dialog header="Helps" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                                <p className="m-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </Dialog>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between gap-3 px-3 pt-3">
                        <div className="p-inputgroup flex-1">
                            <FloatLabel>
                                <InputText id="issuer" value={formData.issuer}
                                    maxLength={250}
                                    required
                                    tooltip="Enter your issuer" tooltipOptions={{ position: 'bottom' }}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        issuer: e.target.value
                                    })} />
                                <label htmlFor="issuer" className="small">Issuer<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                        <div className="p-inputgroup flex-1">
                            <FloatLabel>
                                <Calendar id="issuerDate" dateFormat="dd/mm/yy" value={formData.issuerDate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        issuerDate: e.value
                                    })} showIcon />
                                <label htmlFor="issuerDate" className="small">Issue Date<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                        <div className="p-inputgroup flex-1">
                            <FloatLabel>
                                <InputNumber id="number-input" value={formData.issuerNumber}
                                    onValueChange={(e) => setFormData({
                                        ...formData,
                                        issuerNumber: e.target.value
                                    })} />
                                <label htmlFor="number-input" className="small">Telephone Number<span className="text-danger px-1">*</span></label>
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
                    <div className="px-3 pt-3">
                        <div className="py-1 mb-2">
                            <h6 className="text-left">Traveler Identification</h6>
                            <hr className="separator mt-2" />
                        </div>
                        <div className="tr_identification">
                            <div className="d-flex justify-content-between align-items-stretch gap-3 mt-4">
                                <div className="form-single">
                                    <FloatLabel>
                                        <AutoComplete
                                            id="employeeEmail"
                                            className="d-flex"
                                            value={selectedEmployee}
                                            suggestions={employeeDropDownSuggestions}
                                            completeMethod={searchEmployee}
                                            field="email"
                                            onBlur={handleBlur}

                                            onChange={(e) => {
                                                setSelectedEmployee(e.value);
                                                setFormData({
                                                    ...formData, // Spread the existing formData
                                                    email: '',
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
                                                    email: e.value.email,
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
                                        <label htmlFor="employeeEmail" className="small"><strong>Email <span className="text-danger px-1">*</span></strong></label>
                                        {!isEmployeeEmailValid && <span htmlFor="employeeEmail" className="small mt-1"><strong style={{ color: 'red' }}>Email not in the list</strong></span>}
                                    </FloatLabel>
                                </div>
                                <div className="form-single">
                                    <FloatLabel>
                                        <InputText type="text" maxLength={250} id="firstName" name="firstName" value={formData.firstName} required readOnly />
                                        <label htmlFor="firstName" className="small">First Name<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                                <div className="form-single">
                                    <FloatLabel>
                                        <InputText type="text" maxLength={250} id="lastName" name="lastName" value={formData.lastName} required readOnly />
                                        <label htmlFor="lastName" className="small">Last Name<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                                <div className="form-single">
                                    <FloatLabel>
                                        <InputText type="text" maxLength={250} id="employeeNumber" name="employeeNumber" value={formData.employeeNumber} required readOnly />
                                        <label htmlFor="employeeNumber" className="small">Employee Number<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-stretch gap-3 mt-3">
                        <div className="form-single-special">
                            <FloatLabel>
                                <InputText type="text" maxLength={250} id="costCenter" name="costCenter" value={formData.costCenter} required readOnly />
                                <label htmlFor="costCenter" className="small">Cost Centre<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                        <div className="form-single-special">
                            <FloatLabel>
                                <InputText type="text" maxLength={250} id="entity" name="entity" value={formData.entity} required readOnly />
                                <label htmlFor="entity" className="small">Entity<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                        <div className="form-single-special">
                            <FloatLabel>
                                <InputText type="text" maxLength={250} id="positionTitle" name="positionTitle" value={formData.positionTitle} required readOnly />
                                <label htmlFor="positionTitle" className="small">Position Title<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="travel-details-container gap-3 px-3 pt-3">
                        <div className="py-1 mb-3">
                            <h6 className="text-left">Travel Details</h6>
                            <hr className="separator mt-2" />
                        </div>
                        <div className="travel-type mb-3">
                            <label htmlFor="travelType" className="mr-2">Travel Type<span className="text-danger px-1">*</span></label>
                            <div className="radio-group">
                                <RadioButton inputId="domestic" name="travelType" value="domestic"
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        travelType: e.value
                                    })}
                                    checked={formData.travelType === 'domestic'} required />
                                <label htmlFor="domestic" className="mr-1 small">Domestic</label>
                                <RadioButton inputId="international" name="travelType" value="international"
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        travelType: e.value
                                    })}
                                    checked={formData.travelType === 'international'} required />
                                <label htmlFor="international" className="mr-1 small">International</label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-stretch gap-3 my-4">
                            <FloatLabel className="w-50">
                                <InputTextarea id="travelPurpose" maxLength={2000} className="full-width-textarea" value={formData.travelPurpose}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        travelPurpose: e.target.value
                                    })} rows={2} cols={30} required />
                                <label htmlFor="travelPurpose" className="small">Travel Purpose<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            <FloatLabel className="w-50">
                                <InputTextarea id="participants" maxLength={2000} className="full-width-textarea" value={formData.participants}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        participants: e.target.value
                                    })} rows={2} cols={30} />
                                <label htmlFor="participants" className="small">Participants</label>
                            </FloatLabel>
                        </div>
                        <div className="d-flex justify-content-between align-items-stretch gap-3 my-4">
                            <FloatLabel className="w-25">
                                <InputText id="destination" maxLength={250} className="full-width-textarea w-100" value={formData.destination}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        destination: e.target.value
                                    })} rows={3} cols={30} required />
                                <label htmlFor="destination" className="small">Destination<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            <FloatLabel className="w-25 ">
                                <Calendar id="departureDate" dateFormat="dd/mm/yy" className="w-100" value={formData.travelDepartureDate}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            travelDepartureDate: e.value
                                        })
                                        calculateEstimatedDuration(e.value, formData.travelArrivalDate)
                                    }} showIcon />
                                <label htmlFor="departureDate" className="mr-2 small">Departure Date<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            <FloatLabel className="w-25">
                                <Calendar id="returnDate" dateFormat="dd/mm/yy" className="w-100" value={formData.travelArrivalDate}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            travelArrivalDate: e.value
                                        })
                                        calculateEstimatedDuration(formData.travelDepartureDate, e.value)
                                    }}
                                    showIcon />
                                <label htmlFor="returnDate" className="mr-2 small">Return Date<span className="text-danger px-1">*</span></label>
                            </FloatLabel >
                            <FloatLabel className="w-25">
                                <label htmlFor="estimatedduration" className="mr-2 small">Estimated Duration<span className="text-danger px-1">*</span></label>
                                <InputText id="estimatedduration" className="w-100" value={formData.travelEstimatedDuration} readOnly />
                            </FloatLabel>
                        </div>
                        <div className="d-flex align-items-stretch gap-3 my-4">
                            <FloatLabel>
                                <Dropdown id="currency" value={currencyValue} style={{ width: '10vw' }} onChange={(e) => {
                                    setCurrencyValue(e.value);
                                    setFormData({
                                        ...formData,
                                        travelCurrency: {
                                            key: e.value.key,
                                        }
                                    });
                                }} options={currencyList} optionLabel="name" required />
                                <label htmlFor="currency" className="small">Currency<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputNumber id="budgetAmount" value={formData.travelBudget}
                                    onValueChange={(e) => setFormData({
                                        ...formData,
                                        travelBudget: e.target.value
                                    })} required />
                                <label htmlFor="budgetAmount" className="small">Budget Amount<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            <FloatLabel className="flex-grow-1">
                                <InputText id="Note" maxLength={250} className="w-100" value={formData.travelNote}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        travelNote: e.target.value
                                    })} />
                                <label htmlFor="Note" className="small">Remarks</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="approvers-container gap-3 px-3 pt-3">
                        <div className="py-1 mb-3">
                            <h6 className="text-left">Approvers</h6>
                            <hr className="separator mt-2" />
                        </div>
                        <div className="d-flex justify-content-between align-items-stretch gap-3 my-4">
                            <div className="w-50">
                                <FloatLabel className="w-100">
                                    <AutoComplete
                                        id="manager"
                                        value={selectedItem}
                                        suggestions={dropDownSuggestions}
                                        completeMethod={searchItem}
                                        field="email"
                                        className="w-100 d-flex"
                                        onBlur={handleBlur2}
                                        onChange={(e) => {
                                            setSelectedItem(e.value);
                                            setFormData({
                                                ...formData, // Spread the existing formData
                                                // approver2: {}
                                                hod: ''
                                            });
                                            setSelectedItem2('');
                                        }}
                                        onSelect={(e) => {
                                            setSelectedItem(e.value);
                                            setFormData({
                                                ...formData, // Spread the existing formData
                                                // approver1: {
                                                //     key: e.value.firstName,
                                                // }
                                                manager: e.value.email
                                            });
                                            console.log("value : " + JSON.stringify(e.value.email));
                                        }}
                                        itemTemplate={itemTemplate}
                                        disabled={selectedEmployee === null}
                                        required
                                        tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
                                        tooltip="Disabled"
                                    />
                                    <label htmlFor="manager" className="small">Manager<span className="text-danger px-1">*</span></label>
                                    {!isManagerEmailValid && <span htmlFor="manager" className="small"> <strong style={{ color: 'red' }}>Email not in the list</strong></span>}
                                </FloatLabel>
                            </div>
                            <div className="w-50">
                                <FloatLabel className="w-100">
                                    {/* <label htmlFor="positionTitle" className="small">Head Of Department/GM/VP<span className="text-danger px-1">*</span></label> */}
                                    <AutoComplete
                                        id="hod"
                                        value={selectedItem2}
                                        suggestions={dropDownSuggestions2}
                                        completeMethod={searchItem2}
                                        field="email"
                                        onBlur={handleBlur3}
                                        className="w-100"
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
                                        disabled={selectedItem === null}
                                        tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
                                        tooltip="Disabled"
                                    />
                                    <label htmlFor="hod" className="small">Head Of Department/GM/VP</label>

                                    {!isHODEmailValid && <span htmlFor="hod" className="small"> <strong style={{ color: 'red' }}>Email not in the list</strong></span>}
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                    <div className="hotel-container">
                        <hr className="separator mb-2" />
                        <div className="form-row-toggle mx-2">
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
                            <div className="d-flex align-items-stretch gap-3 my-4 mx-2">
                                <div className="calendar-item">
                                    <FloatLabel>
                                        <label htmlFor="location">Location<span className="text-danger px-1">*</span></label>
                                        <InputText id="location" maxLength={250} name="location" required
                                            value={formData.hotelLocation}
                                            onChange={(e) => setFormData({
                                                ...formData, // Spread the existing formData
                                                hotelLocation: e.target.value // Update only the firstName property
                                            })} />
                                    </FloatLabel>
                                </div>
                                <div className="calendar-item col-width">
                                    <FloatLabel>
                                        <Calendar id="checkIn" dateFormat="dd/mm/yy" value={formData.hotelCheckIn}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    hotelCheckIn: e.value
                                                });
                                                calculateEstimatedNights(e.value, formData.hotelCheckOut);
                                            }} showTime hourFormat="24" showIcon required />
                                        <label htmlFor="checkIn" className="mr-2">Check In<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                                <div className="calendar-item col-width">
                                    <FloatLabel>
                                        <Calendar id="checkOut" dateFormat="dd/mm/yy" value={formData.hotelCheckOut}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    hotelCheckOut: e.value
                                                });
                                                calculateEstimatedNights(formData.hotelCheckIn, e.value);
                                            }} showTime hourFormat="24" showIcon required />
                                        <label htmlFor="checkOut" className="mr-2">Check Out<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                                <div className="calendar-item">
                                    <FloatLabel>
                                        <label htmlFor="nights">No of Nights</label>
                                        <InputNumber id="nights" name="nights" required
                                            value={formData.hotelNumberOfNights}
                                            readOnly />
                                    </FloatLabel>
                                </div>
                                <div className="calendar-item flex-shrink-1 flex-grow-1">
                                    <FloatLabel className="w-100">
                                        <label htmlFor="hotelNote">Remarks</label>
                                        <InputText id="hotelNote" maxLength={250} name="hotelNote" className="w-100"
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
                    </div>
                    <div className="car-container">
                        <hr className="separator mb-2" />
                        <div className="form-row-toggle mx-2">
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
                            <div className="">
                                <div className="calendar-container d-flex justify-content-between gap-3 my-4 mx-2">
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <label htmlFor="category">Category<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" maxLength={250} id="category" name="category" required
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
                                            <label htmlFor="from">From:<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" maxLength={250} id="from" name="from" required
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
                                            <label htmlFor="to">To:<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" maxLength={250} id="to" name="to" required
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
                                            <label htmlFor="on">On:<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" maxLength={250} id="on" name="on" required
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
                                            <label htmlFor="until">Until:<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" maxLength={250} id="until" name="until" required
                                                value={formData.carRentalUntil}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalUntil: e.target.value
                                                })}
                                            />
                                        </FloatLabel>
                                    </div>
                                </div>
                                <div className="calendar-container d-flex align-items-stretch gap-3 my-4 mx-2">
                                    <div className="calendar-item">
                                        {/* <label htmlFor="birthDate">Birth Date</label>
                                            <input type="date" id="birthDate" name="birthDate" required
                                                value={formData.carRentalBirthDate}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalBirthDate: e.target.value
                                                })} /> */}
                                        <FloatLabel>
                                            <Calendar id="birthDate" dateFormat="dd/mm/yy" value={formData.carRentalBirthDate}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalBirthDate: e.value
                                                })} showIcon required />
                                            <label for="birthDate">Birth Date<span className="text-danger px-1">*</span></label>
                                        </FloatLabel>
                                    </div>
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <label htmlFor="drivingLicense">Driving License<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" maxLength={250} id="drivingLicense" name="drivingLicense" required
                                                value={formData.carDrivingLicense}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carDrivingLicense: e.target.value
                                                })}
                                            />
                                        </FloatLabel>
                                    </div>
                                    <div className="calendar-item flex-grow-1">
                                        <FloatLabel className="w-100 car-note">
                                            <label htmlFor="carRentalNote">Remarks</label>
                                            <InputText id="carRentalNote" maxLength={250} className="w-100" name="carRentalNote"
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
                    </div>
                    <div className="personalcar-container">
                        <hr className="separator mb-2" />
                        <div className="form-row-toggle mx-2">
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
                            <div className="calendar-container d-flex align-items-stretch gap-3 my-4 mx-2">
                                <div className="calendar-item">
                                    <FloatLabel>
                                        <label htmlFor="carRegNum">Car Registration Number<span className="text-danger px-1">*</span></label>
                                        <InputText type="text" maxLength={250} id="carRegNum" name="carRegNum" required
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
                                        <label htmlFor="drivingLicenseNum">Driving License Number<span className="text-danger px-1">*</span></label>
                                        <InputText type="text" id="drivingLicenseNum" maxLength={250} name="drivingLicenseNum" required
                                            value={formData.personalCarDrivingLicenseNumber}
                                            onChange={(e) => setFormData({
                                                ...formData, // Spread the existing formData
                                                personalCarDrivingLicenseNumber: e.target.value // Update only the firstName property
                                            })}
                                        />
                                    </FloatLabel>
                                </div>
                                <div className="calendar-item flex-grow-1">
                                    <FloatLabel className="w-100 car-note">
                                        <label htmlFor="personalCarNote">Remarks</label>
                                        <InputText id="personalCarNote" maxLength={250} className="w-100" name="personalCarNote"
                                            value={formData.personalCarNote}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                personalCarNote: e.target.value
                                            })}
                                        />
                                    </FloatLabel>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flightticket-container">
                        <hr className="separator mb-2" />
                        <div className="form-row-toggle mx-2">
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
                                <div className="d-flex flight-ticket-container mb-3">
                                    <div className="d-flex gap-3 mt-3 mx-2">
                                        <label htmlFor="travelType" className="mr-2">Ticket Type<span className="text-danger px-1">*</span></label>
                                        {flightTypeList.map((category) => {
                                            return (
                                                <div key={category.key} className="d-flex align-items-center">
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
                                                        checked={flightTypeValue.key === category.key} required />
                                                    <label htmlFor={category.key} className="ps-1 px-2">{category.name}</label>
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
                                <p className="mx-2">Note: Kindly attach the 3 quotes/routes provided by Travel Agent for comparison. If the least cost-saving route is not taken, kindly provide the reason below.</p>
                                <div className="form-dropdown-container d-flex gap-3 mx-2 reason-dropdown align-items-center mt-4">
                                    <label htmlFor="reason">Reason<span className="text-danger px-1 mt-2">*</span></label>
                                    <Dropdown inputId="dd-city" value={reasonValue} onChange={(e) => {
                                        setReasonValue(e.value);
                                        setFormData({
                                            ...formData, // Spread the existing formData
                                            flightTicketReason: {
                                                key: e.value.key,
                                                // name: e.value.name // Update only the firstName property
                                            }
                                        });
                                    }} options={reasonList} optionLabel="name" className="w-full" required />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="trainticket-container">
                        <hr className="separator mb-2" />
                        <div className="form-row-toggle mx-2">
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
                            <div className="flex justify-content mx-2 mb-2">
                                <div className="d-flex gap-3">
                                    <label htmlFor="travelType" className="mr-2">Ticket Type<span className="text-danger px-1">*</span></label>
                                    {trainTypeList.map((category) => {
                                        return (
                                            <div key={category.key} className="d-flex align-items-center">
                                                <RadioButton inputId={category.key} name="category" value={category}
                                                    // onChange={(e) => set(e.value)} 
                                                    onChange={(e) => {
                                                        setTrainTypeValue(e.value)
                                                        setFormData({
                                                            ...formData, // Spread the existing formData
                                                            trainTicketType: {
                                                                key: e.value.key,
                                                                // name: e.value.name // Update only the firstName property
                                                            }
                                                        });
                                                        console.log("radio : ", formData)
                                                    }
                                                    }
                                                    checked={trainTypeValue.key === category.key} />
                                                <label htmlFor={category.key} className="ml-2 px-2">{category.name}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="separator " />
                    <div className="px-3 pt-3">
                        <div className="py-1 mb-1">
                            <h6 className="text-left">Attachments</h6>
                        </div>
                        <div className="d-flex">
                            <input
                                type="file"
                                // accept={accept}
                                onChange={onFileChange}
                            />
                            <button className="btn-sm px-2 py-2 bg-gradients border-0" style={{ color: 'white' }} type="button" onClick={onFileUpload}>Upload</button>
                            {/* {fileError && <p style={{ color: 'red' }}>{fileError}</p>} */}
                        </div>

                        {files.length > 0 &&
                            <DataTable value={files} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                <Column sortable field="title" header="Title" headerClassName="custom-header" />
                                <Column header="Actions" headerClassName="custom-header"
                                    body={(rowData, { rowIndex }) => (
                                        <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}>
                                            <Button severity="danger" type="button" icon="pi pi-trash"
                                                onClick={() => handleRemovefiles(rowIndex)} />
                                        </div>
                                    )}
                                />
                            </DataTable>}
                    </div>

                    <hr className="separator mb-2" />
                    <div className="addbutton mx-2">
                        {/* <button type="button" onClick={handleAddItineraryClick}>
                            {showItinerary ? "Hide Itinerary" : "Add Itinerary"}
                        </button> */}
                        <Button onClick={() => {
                            setShowItinerary(!showItinerary);
                        }}
                            className="btn-sm px-2 py-2 bg-gradients border-0" type="button" label="Add Itinerary" badge={itineraries.length} />
                    </div>

                    {showItinerary && (
                        <div className="modal small">
                            <div className="modal-content">
                                <div className="savebn text-right d-flex justify-content-between align-items-center mt-2 d-flex gap-2">
                                    <span className="text-left justify-content-start">
                                        <label className="toggle-label h4" htmlFor="flightToggle">Add Itinerary</label>
                                    </span>
                                    <span className="close text-right justify-content-end " onClick={handleCloseItineraryClick}>&times;</span>
                                </div>
                                <hr class="my-1" />
                                {/* <div className="itinerary-form">
                                    <div className="form-row">
                                        <div className="form-group">

                                            <FloatLabel>
                                                <InputText id="itFrom" value={newItinerary.itFrom} onChange={e => handleInputChange('itFrom', e)} />
                                                <label for="itFrom">From</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="form-group">

                                            <FloatLabel>
                                                <InputText id="itTo" value={newItinerary.itTo} onChange={e => handleInputChange('itTo', e)} />
                                                <label for="itTo">To</label>
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
                                                <label for="flightNumber">Flight Number</label>
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
                                                        <label for="returnFrom">Return From</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className="form-group">
                                                    <FloatLabel>
                                                        <InputText id="returnTo" value={newItinerary.returnTo} onChange={e => handleInputChange('returnTo', e)} />
                                                        <label for="returnTo">Return To</label>
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
                                                        <label for="returnFlightNumber">Return Flight Number</label>
                                                    </FloatLabel>
                                                </div>
                                            </div>
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
                                    <div className="form-row d-flex align-content-stretch gap-3">
                                        <div className="calendar-item">
                                            <FloatLabel>
                                                <InputText id="onwardJourney" maxLength={250} value={newItinerary.onwardJourney} onChange={e => handleInputChange('onwardJourney', e)} />
                                                <label htmlFor="onwardJourney">Onward Journey</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="calendar-item col-width">
                                            <FloatLabel >
                                                <Calendar id="onwardDepartureDate" dateFormat="dd/mm/yy" value={newItinerary.onwardDepartureDate} onChange={(e) => handleInputChange('onwardDepartureDate', e)} showIcon />
                                                <label htmlFor="onwardDepartureDate">Departure Date</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="calendar-item">
                                            <FloatLabel>
                                                <Dropdown id="onwardPreferredTime" className="onwardDepartureDate"
                                                    value={newItinerary.onwardPreferredTime}
                                                    style={{ width: '9vw' }}
                                                    onChange={e => handleInputChange('onwardPreferredTime', e)} options={preferredTimeList} optionLabel="name" />
                                                <label htmlFor="onwardPreferredTime">Preferred Time</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="calendar-item">
                                            <FloatLabel>
                                                <InputText id="onwardTransportNumber" maxLength={250} value={newItinerary.onwardTransportNumber} onChange={e => handleInputChange('onwardTransportNumber', e)} />
                                                <label htmlFor="onwardTransportNumber"> Flight/Train Number</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="calendar-item flex-grow-1">
                                            <FloatLabel className="w-100 car-note">
                                                <InputText id="onwardJourneyNote" maxLength={250} className="w-100" value={newItinerary.onwardJourneyNote} onChange={e => handleInputChange('onwardJourneyNote', e)} />
                                                <label htmlFor="onwardJourneyNote">Onward Journey Note</label>
                                            </FloatLabel>
                                        </div>

                                    </div>
                                    <div className="form-row">
                                        <div className="form-group SRT d-flex">
                                            <label htmlFor="showReturnFields mr-2">Show Return Trip</label>
                                            <InputSwitch checked={showReturnFields} className="mx-2" onChange={(e) => setShowReturnFields(e.value)} />
                                        </div>
                                    </div>

                                    {showReturnFields && (
                                        <>
                                            <div className="form-row2 gap-3">
                                                <div >
                                                    <FloatLabel>
                                                        <InputText id="returnJourney" maxLength={250} value={newItinerary.returnJourney} onChange={e => handleInputChange('returnJourney', e)} />
                                                        <label htmlFor="returnJourney">Return Journey</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className="col-width">
                                                    <FloatLabel>
                                                        <Calendar id="returnArrivalDate" dateFormat="dd/mm/yy" value={newItinerary.returnArrivalDate} onChange={(e) => handleInputChange('returnArrivalDate', e)} showIcon />
                                                        <label htmlFor="returnArrivalDate">Arrival Date</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className="returnpreferredTime">
                                                    <FloatLabel>
                                                        <Dropdown id="returnpreferredTime" className="onwardDepartureDate"
                                                            style={{ width: '9vw' }}
                                                            value={newItinerary.returnPreferredTime}
                                                            onChange={e => handleInputChange('returnPreferredTime', e)} options={preferredTimeList} optionLabel="name" />
                                                        <label htmlFor="returnpreferredTime">Preferred Time</label>
                                                    </FloatLabel>
                                                </div>
                                                <div >
                                                    <FloatLabel>
                                                        <InputText id="returnTransportNumber" maxLength={250} value={newItinerary.returnTransportNumber} onChange={e => handleInputChange('returnTransportNumber', e)} />
                                                        <label htmlFor="returnTransportNumber"> Flight/Train Number</label>
                                                    </FloatLabel>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="savebn text-right d-flex mt-2 d-flex justify-content-end gap-2">
                                        <Button onClick={handleCloseItineraryClick} className="bg-danger border-0" label="Cancel" />
                                        <Button onClick={handleSaveItinerary} className="border-0" label="Save" disabled={saveItineraryFlag} />
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
                                <Column sortable field="returnJourney" header="Return Journey" headerClassName="custom-header" />
                                <Column sortable field="returnArrivalDate" header="Arrival Date" body={(rowData) => formatDate(rowData.returnArrivalDate)} headerClassName="custom-header" />
                                <Column sortable field="returnPreferredTime" header="Return Preferred Time" body={(rowData) => formatPickList(rowData.returnPreferredTime)} headerClassName="custom-header" />
                                <Column sortable field="returnTransportNumber" header="Return Transport Number" headerClassName="custom-header" />
                                <Column sortable field="onwardJourneyNote" header="Note" headerClassName="custom-header" />
                                <Column header="Actions" headerClassName="custom-header"
                                    body={(rowData, { rowIndex }) => (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Button icon="pi pi-pencil" type="button" style={{ marginRight: '0.5rem' }}
                                                onClick={() => handleEditItinerary(rowIndex)} />
                                            <Button severity="danger" type="button" icon="pi pi-trash"
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
                    <div className="gap-5" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button className="mb-3" style={{
                            border: 'none', // Remove border
                            borderRadius: '4px', // Set a small border radius (adjust as needed)
                            backgroundColor: '#114B7D',
                            padding: '0.5rem 1rem', // Adjust padding to control button size
                            width: '15%', // Set the width of the button (e.g., 25% of the container)
                            fontWeight: 'bold'
                        }}
                            onClick={() => setFormData(prevFormData => ({
                                ...prevFormData, // Spread the existing formData
                                status: { code: 2 }
                            }))}
                            type="submit"
                            label="Save As Draft"
                            disabled={isEmailValidSubmit}
                        />
                        <div>
                            <Button type="button" icon="pi pi-angle-double-right" label="Next" rounded onClick={() => setPreviewVisible(true)} />
                            <Dialog header="Preview" visible={previewVisible} style={{ width: '80vw' }} onHide={() => { if (!previewVisible) return; setPreviewVisible(false); }}>
                                {/* {previewVisible && { NewSummary(formData,itineraries) }} */}
                                <FormPreview item={formData} travelInfo={itineraries} />
                                <div className="gap-5 mt-3" style={{ display: 'flex', justifyContent: 'center' }} >
                                    <Button icon="pi pi-angle-double-left" label="Back" type="button" rounded onClick={() => setPreviewVisible(false)} />
                                    <Button style={{
                                        borderRadius: '4px', // Set a small border radius (adjust as needed)
                                        backgroundColor: '#114B7D',
                                    }}
                                        disabled={isEmailValidSubmit}
                                        onClick={handleFormSubmit}
                                        type="submit"
                                        label="Submit"
                                    />
                                </div>
                            </Dialog>
                        </div>
                    </div>

                </form>
            </div>
            {/* <Snackbar
                open={open}
                // autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={action}
            ></Snackbar> */}
        </div>
    );
}

export default TravelRequestForm;

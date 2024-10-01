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
import { useNavigate } from 'react-router-dom';
import { Divider } from "@mui/material";
import { SpaceBar } from "@mui/icons-material";
import { color } from "@mui/system";
import ConfirmationDialog from './ConfirmationDialog';

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
    const [isTelephoneNumberValid, setIsTelephoneNumberValid] = useState(false);
    const [isManagerEmailValid, setIsManagerEmailValid] = useState(true);
    const [isHODEmailValid, setIsHODEmailValid] = useState(true);
    const [isEmailValidSubmit, setIsEmailValidSubmit] = useState(true);
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
    });
    const [editingItinerary, setEditingItinerary] = useState(null);
    const submitButtonRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToRemoveIndex, setItemToRemoveIndex] = useState(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/MyList');
    };

    // const formatfiles = (files) => {
    // const formatfiles = (fileResponses) => {
    //     return fileResponses.map(fileResponse => ({
    //         attachments: {
    //             id: fileResponse.id,
    //             link: {
    //                 href: fileResponse.contentUrl,
    //                 label: fileResponse.title
    //             },
    //             name: fileResponse.title
    //         }
    //     }));
    // }

    const OnwardJourneyLink = (rowData) => {

        console.log("url : ", rowData.contentUrl)
        let urlObj = new URL(rowData.contentUrl, "http://localhost:8080");
        urlObj.searchParams.delete('download');
        let newUrl = urlObj.toString();
        console.log("new url : ", newUrl)

        return (
            <a href={newUrl} target="_blank" rel="noopener noreferrer">
                {rowData.title}
            </a>
        );
    };


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
    // const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);

    const toast = useRef(null);

    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 10000 });
    }

    const changeFileName = (selectedFile) => {
        const fileName = selectedFile.name;
        const fileExtension = fileName.split('.').pop(); // Get the extension
        const baseName = fileName.slice(0, fileName.lastIndexOf('.')); // Get the base name without extension

        // Define your suffix
        // const suffix = '_suffix';
        const suffix = `_${Math.floor(Date.now() / 1000)}`;

        // Construct the new file name
        const newFileName = `${baseName}${suffix}.${fileExtension}`;

        console.log(`Original file name: ${fileName}`);
        console.log(`New file name: ${newFileName}`);

        // If you need to create a new File object (optional)
        const newFile = new File([selectedFile], newFileName, { type: selectedFile.type });

        console.log(newFile.name);
        return newFile
    }
    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log("File details : " + selectedFile.name )
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                // setFileError('File size exceeds the maximum limit.');
                showMessage('error', 'Error', 'File size exceeds the maximum limit')
                return;
            }

            const changedFile = changeFileName(selectedFile);
            // setFile(selectedFile);
            onFileUpload(changedFile, selectedFile.name);
        }
    };
    const handleRemovefiles = async (rowIndex) => {
        const selectedFile = files[rowIndex];
        console.log("selected file : ", selectedFile.name)
        try {
            await TravelRequestFormService.deleteDocuments(selectedFile.fileId)
            showMessage('success', 'Success', `Successfully removed ${selectedFile.title}`)
            setFiles(files.filter((_, i) => i !== rowIndex));
        } catch (error) {
            console.log("error while deleting : ", error)
            showMessage('error', 'Error', `Error response : ${error.response.data.title}`)
            // setFileError(error)
        }
    };

    const handleDeleteFileClick = (rowIndex) => {
        setSelectedRowIndex(rowIndex);
        setDialogOpen(true);
    };

    const handleConfirmFileDelete = () => {
        if (selectedRowIndex !== null) {
            handleRemovefiles(selectedRowIndex);
        }
        setDialogOpen(false);
        setSelectedRowIndex(null); // Reset selected index
    };

    const onFileUpload = async (selectedFile, originalFileName) => {
        if (!selectedFile) {
            // setFileError('No file selected.');
            showMessage('error', 'Error', 'No file selected.')
            return;
        }

        try {
            const fileResponse = await TravelRequestFormService.addDocuments(selectedFile);
            const tempFile = {
                fileId: fileResponse.id,
                title: fileResponse.title,
                contentUrl: fileResponse.contentUrl
            };
            setFiles([...files, tempFile]);
            // setFile(null)
            showMessage('success', 'Success', `Successfully uploaded ${fileResponse.title}`)
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (error) {
            // setFileError(error.title)
            showMessage('error', 'Error', `Error response : ${error.response.data.title}`)
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

        }
    };

    const searchEmployee = (event) => {
        const query = event.query.toLowerCase();
        console.log("query : ", query)
        setEmployeeDropDownSuggestions(
            userList.filter(item => item.email.toLowerCase().includes(query))
        );
    };
    const handleEditItinerary = (index) => {
        const itineraryToEdit = { ...itineraries[index] }; // Create a copy to avoid direct mutation
        setNewItinerary(itineraryToEdit);
        setEditingItinerary(index); // Store the index, not the itinerary itself
        setShowReturnFields(itineraryToEdit.returnJourney !== '');
        setShowItinerary(true);
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
            onwardJourney: '',
            onwardDepartureDate: null,
            onwardPreferredTime: '',
            onwardTransportNumber: '',
            onwardJourneyNote: '',
            returnJourney: '',
            returnArrivalDate: null,
            returnPreferredTime: '',
            returnTransportNumber: '',
        });
        setShowItinerary(false);
        setShowReturnFields(false);
    };

    const handleRemoveItinerary = (index) => {
        setItineraries(itineraries.filter((_, i) => i !== index));
    };

    const searchItem = (event) => {
        const query = event.query.toLowerCase();
        // console.log("query 2 : ", query)
        // const email = (typeof selectedEmployee === 'object' ? selectedEmployee.email.toLowerCase() : selectedEmployee.toLowerCase());
        // setdropDownSuggestions(
        //     userList.filter(item => item.email.toLowerCase().includes(query) && (item.email.toLowerCase() !== email))
        // );
        setdropDownSuggestions(
            userList.filter(item => item.email.toLowerCase().includes(query) && (item.email.toLowerCase() !== formData.email))
        );
    };
    const searchItem2 = (event) => {
        const query = event.query.toLowerCase();
        // const employeeEmail = (typeof selectedEmployee === 'object' ? selectedEmployee.email.toLowerCase() : selectedEmployee.toLowerCase());
        // const managerEmail = (typeof selectedItem === 'object' ? selectedItem.email.toLowerCase() : selectedItem.toLowerCase())
        // setdropDownSuggestions2(
        //     userList.filter(item => item.email.toLowerCase().includes(query) && (item.email.toLowerCase() !== managerEmail) && (item.email.toLowerCase() !== employeeEmail))
        // );
        setdropDownSuggestions2(
            userList.filter(item => item.email.toLowerCase().includes(query) && (item.email.toLowerCase() !== formData.manager) && (item.email.toLowerCase() !== formData.email))
        );
    };

    const itemTemplate = (item) => {
        return (
            <div className="p-d-flex p-ai-center">
                <div className="p-mr-2">{item.email}</div>
            </div>
        );
    };

    const handleRemoveClick = (index) => {
        setItemToRemoveIndex(index);
        setIsDialogOpen(true);
      };
    
      const handleDialogClose = () => {
        setIsDialogOpen(false);
        setItemToRemoveIndex(null);
      };
    
      const handleConfirmRemove = () => {
        if (itemToRemoveIndex !== null) {
          setItineraries(itineraries.filter((_, i) => i !== itemToRemoveIndex));
          handleDialogClose();
        }
      };

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

    const handleInputChange = (name, e) => {
        const { value } = e.target;
        console.log(name, " : ", value);
        if (name === 'onwardDepartureDate') {
            setNewItinerary({
                ...newItinerary,
                returnArrivalDate: null,
                [name]: value,
            });
        } else {
            setNewItinerary({
                ...newItinerary,
                [name]: value,
            });
        }
    };

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
                carRentalOn: null,
                carRentalUntil: null,
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
                name: firstFlightType.name,
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
                flightTicketReason: {},
                trainTicketType: {},
                itineraryRelation: [],
                attachmentRelation: [],
            }));
            setReasonValue([]);
            setTrainTypeValue([]);
            setItineraries([]);
            setFiles([]);
        }
    };

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

    const setTimeZone = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 6);
        return date;
    }

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
        carRentalOn: null,
        carRentalUntil: null,
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
        attachmentRelation: [],
        approveStatus: {}
    });

    const validateTelephoneNumber = (input) => {
        const pattern = /^\d{9,15}$/;
        console.log("issuer no : ", pattern.test(input))
        setIsTelephoneNumberValid(pattern.test(input));
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
            setFormData(prevFormData => ({
                ...prevFormData, // Spread the existing formData
                trainTicketType: {}
            }));
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
        setLoading(true);
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
                travelRequestId: uniqId,
                itineraryRelation: formData.itineraryRelation.map(itinerary => ({
                    ...itinerary,
                    onwardDepartureDate: itinerary.onwardDepartureDate ? setTimeZone(new Date(itinerary.onwardDepartureDate).toISOString()) : null,
                    returnArrivalDate: itinerary.returnArrivalDate ? setTimeZone(new Date(itinerary.returnArrivalDate).toISOString()) : null,
                }))
            });
            // setMessage(`Successfully created Id : ${response.data.travelRequestId}`);
            showMessage('success', 'Success', `Successfully created Id : ${response.data.travelRequestId}`)
            setTimeout(() => {
                handleBack();
            }, 3000);
            // setOpen(true);
        } catch (error) {
            console.error("Error submitting form", error);
            // setMessage(`Error response : ${error.response.data.title}`);
            showMessage('error', 'Error', `Error response : ${error.response.data.title}`)
            // setOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default action (form submission)
        }
    };

    const validateEmployeeEmail = (value) => {
        return userList.some(user => {
            if (user.email.toLowerCase() === (typeof value === 'object' ? value.email.toLowerCase() : value.toLowerCase())) {
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
    const handleBlur = (value) => {
        if (value === '')
            setIsEmployeeEmailValid(false)
        else
            setIsEmployeeEmailValid(validateEmployeeEmail(value));
    };

    const validateManagerEmail = (value) => {
        return userList.some(user => {
            if (user.email.toLowerCase() === (typeof value === 'object' ? value.email.toLowerCase() : value.toLowerCase())) {
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
    const handleBlur2 = (value) => {
        if (value === '')
            setIsManagerEmailValid(false)
        else
            setIsManagerEmailValid(validateManagerEmail(value));
    };
    const validateHODEmail = (value) => {
        return userList.some(user => {
            if (user.email.toLowerCase() === (typeof value === 'object' ? value.email.toLowerCase() : value.toLowerCase())) {
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
    const handleBlur3 = (value) => {
        if (value === '')
            setIsHODEmailValid(true)
        else
            setIsHODEmailValid(validateHODEmail(value));
    };

    useEffect(() => {
        console.log("status :", (!isManagerEmailValid || !isHODEmailValid))
        setIsEmailValidSubmit(((!isManagerEmailValid || selectedItem === '') || !isHODEmailValid) || !isTelephoneNumberValid);
    }, [isHODEmailValid, isManagerEmailValid, isTelephoneNumberValid]);

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
                        <div className="p-inputgroup d-block">
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
                        <div className="p-inputgroup d-block">
                            <FloatLabel>
                                <Calendar id="issuerDate" dateFormat="dd-M-yy" value={formData.issuerDate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        issuerDate: setTimeZone(e.value)
                                    })} showIcon />
                                <label htmlFor="issuerDate" className="small">Issue Date<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                        <div className="p-inputgroup d-block">
                            <FloatLabel>
                                <InputNumber id="number-input" value={formData.issuerNumber}
                                    useGrouping={false}
                                    onChange={(e) => {
                                        validateTelephoneNumber(e.value)
                                        setFormData({
                                            ...formData,
                                            issuerNumber: e.value

                                        })

                                    }}
                                // onBlur={validateTelephoneNumber} 
                                />
                                <label htmlFor="number-input" className="small">Telephone Number<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            {(!isTelephoneNumberValid && formData.issuerNumber !== null) && <span htmlFor="number-input" className="small mt-1"><strong style={{ color: 'red' }}>Invalid Number</strong></span>}

                        </div>
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
                                            // onBlur={handleBlur}
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
                                                    positionTitle: '',
                                                    manager:'',
                                                    hod: ''
                                                });
                                                setSelectedItem('');
                                                setSelectedItem2('');
                                                handleBlur(e.value)
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
                                            // forceSelection
                                            required
                                        />
                                        <label htmlFor="employeeEmail" className="small"><strong>Email <span className="text-danger px-1">*</span></strong></label>
                                        {!isEmployeeEmailValid && <span htmlFor="employeeEmail" className="small mt-1"><strong style={{ color: 'red' }}>Invalid Email</strong></span>}
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
                        <p className="mx-2">Note: All International flights have to be approved by Head of Department/GM/VP.</p>
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
                                <Calendar id="departureDate" dateFormat="dd-M-yy" className="w-100" value={formData.travelDepartureDate}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            travelDepartureDate: setTimeZone(e.value),
                                            travelEstimatedDuration: null,
                                            travelArrivalDate: null
                                        })
                                        // calculateEstimatedDuration(e.value, formData.travelArrivalDate)
                                    }} showIcon />
                                <label htmlFor="departureDate" className="mr-2 small">Departure Date<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            <FloatLabel className="w-25">
                                <Calendar id="returnDate" minDate={formData.travelDepartureDate} dateFormat="dd-M-yy" className="w-100" value={formData.travelArrivalDate}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            travelArrivalDate: setTimeZone(e.value),
                                        })
                                        calculateEstimatedDuration(formData.travelDepartureDate, setTimeZone(e.value))
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
                                            name: e.value.name,
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
                                        // onBlur={handleBlur2}
                                        onChange={(e) => {
                                            setSelectedItem(e.value);
                                            setFormData({
                                                ...formData, // Spread the existing formData
                                                // approver2: {}
                                                hod: ''
                                            });
                                            setSelectedItem2('');
                                            setIsHODEmailValid(true)
                                            handleBlur2(e.value)
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
                                        // tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
                                        // tooltip="Disabled"
                                    />
                                    <label htmlFor="manager" className="small">Manager<span className="text-danger px-1">*</span></label>
                                    {!isManagerEmailValid && <span htmlFor="manager" className="small"> <strong style={{ color: 'red' }}>Invalid Email</strong></span>}
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
                                        // onBlur={handleBlur3}
                                        className="w-100"
                                        onChange={(e) => {
                                            setSelectedItem2(e.value)
                                            handleBlur3(e.value)
                                        }
                                        }
                                        onSelect={(e) => {
                                            setSelectedItem2(e.value);
                                            setFormData({
                                                ...formData, // Spread the existing formData
                                                hod: e.value.email
                                            });
                                            console.log("value : " + JSON.stringify(e.value.email));
                                        }}
                                        itemTemplate={itemTemplate}
                                        disabled={selectedItem === null}
                                        required={formData.travelType === 'international'}
                                        // forceSelection
                                        // tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
                                        // tooltip="Disabled"
                                    />
                                    <label htmlFor="hod" className="small">Head Of Department/GM/VP{formData.travelType === 'international' && <span className="text-danger px-1">*</span>}</label>

                                    {!isHODEmailValid && <span htmlFor="hod" className="small"> <strong style={{ color: 'red' }}>Invalid Email</strong></span>}
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
                                        <Calendar id="checkIn" dateFormat="dd-M-yy" value={formData.hotelCheckIn}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    hotelCheckIn: e.value,
                                                    hotelCheckOut: null,
                                                    hotelNumberOfNights: null
                                                });
                                                // calculateEstimatedNights(e.value, formData.hotelCheckOut);
                                            }} showTime hourFormat="24" showIcon required />
                                        <label htmlFor="checkIn" className="mr-2">Check In<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                                <div className="calendar-item col-width">
                                    <FloatLabel>
                                        <Calendar id="checkOut" minDate={formData.hotelCheckIn} dateFormat="dd-M-yy" value={formData.hotelCheckOut}
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
                                            <Calendar id="on" dateFormat="dd-M-yy" value={formData.carRentalOn}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalOn: setTimeZone(e.value),
                                                    carRentalUntil: null
                                                })} showIcon required />
                                            <label for="on">On:<span className="text-danger px-1">*</span></label>
                                        </FloatLabel>
                                        {/* <FloatLabel>
                                            <label htmlFor="on">On:<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" maxLength={250} id="on" name="on" required
                                                value={formData.carRentalOn}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalOn: e.target.value
                                                })}
                                            />
                                        </FloatLabel> */}
                                    </div>
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <Calendar id="until" minDate={formData.carRentalOn} dateFormat="dd-M-yy" value={formData.carRentalUntil}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalUntil: setTimeZone(e.value)
                                                })} showIcon required />
                                            <label for="until">Until:<span className="text-danger px-1">*</span></label>
                                        </FloatLabel>
                                        {/* <FloatLabel>
                                            <label htmlFor="until">Until:<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" maxLength={250} id="until" name="until" required
                                                value={formData.carRentalUntil}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalUntil: e.target.value
                                                })}
                                            />
                                        </FloatLabel> */}
                                    </div>
                                </div>
                                <div className="calendar-container d-flex align-items-stretch gap-3 my-4 mx-2">
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <Calendar id="birthDate" dateFormat="dd-M-yy" value={formData.carRentalBirthDate}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalBirthDate: setTimeZone(e.value)
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
                            <label className="toggle-label" htmlFor="flightToggle">Travel Itinerary</label>
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
                                        <label htmlFor="travelType" className="mr-2">Flight Ticket Type:<span className="text-danger px-1">*</span></label>
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
                                                                    name: e.value.name,
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
                                   
                                    <div className="d-flex gap-3 mt-3 mx-2 train">
                                    <label htmlFor="travelType" className="mr-2 train">Train Ticket Type:</label>
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
                                                                name: e.value.name,
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
                                <div className="flex justify-content mx-2 mb-2">
                                

                                <br></br>
                                <div className="addbutton mx-2">
                        {/* <button type="button" onClick={handleAddItineraryClick}>
                            {showItinerary ? "Hide Itinerary" : "Add Itinerary"}
                        </button> */}
                        <Button onClick={() => {
                            setShowItinerary(!showItinerary);
                        }}
                            className="btn-sm px-2 py-2 bg-gradients border-0" type="button" label="Add Itinerary" />
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

                                <div className="itinerary-form">
                                    <div className="form-row d-flex align-content-stretch gap-3">
                                        <div className="calendar-item">
                                            <FloatLabel>
                                                <InputText id="onwardJourney" maxLength={250} value={newItinerary.onwardJourney} onChange={e => handleInputChange('onwardJourney', e)} />
                                                <label htmlFor="onwardJourney">Onward Journey (From - To)</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="calendar-item col-width">
                                            <FloatLabel >
                                                <Calendar id="onwardDepartureDate" dateFormat="dd-M-yy" value={newItinerary.onwardDepartureDate} onChange={(e) => handleInputChange('onwardDepartureDate', e)} showIcon appendTo="self" />
                                                <label htmlFor="onwardDepartureDate">Departure Date</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="calendar-item">
                                            <FloatLabel>
                                                <Dropdown id="onwardPreferredTime" className="onwardPreferredTime"
                                                    value={newItinerary.onwardPreferredTime}
                                                    style={{ width: '9vw' }}
                                                    onChange={e => handleInputChange('onwardPreferredTime', e)} options={preferredTimeList} optionLabel="name" />
                                                <label htmlFor="onwardPreferredTime">Preferred Time</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="calendar-item">
                                            <FloatLabel>
                                                <InputText id="onwardTransportNumber" maxLength={250} value={newItinerary.onwardTransportNumber} onChange={e => handleInputChange('onwardTransportNumber', e)} />
                                                <label htmlFor="onwardTransportNumber">Onward Flight/Train No</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="calendar-item flex-grow-1">
                                            <FloatLabel className="w-100 car-note">
                                                <InputText id="onwardJourneyNote" maxLength={250} className="w-100" value={newItinerary.onwardJourneyNote} onChange={e => handleInputChange('onwardJourneyNote', e)} />
                                                <label htmlFor="onwardJourneyNote">Remarks</label>
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
                                                        <label htmlFor="returnJourney">Return Journey (From - To)</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className="col-width">
                                                    <FloatLabel>
                                                        <Calendar id="returnArrivalDate" minDate={newItinerary.onwardDepartureDate} dateFormat="dd-M-yy" value={newItinerary.returnArrivalDate} onChange={(e) => handleInputChange('returnArrivalDate', e)} showIcon appendTo="self" />
                                                        <label htmlFor="returnArrivalDate">Arrival Date</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className="returnpreferredTime">
                                                    <FloatLabel>
                                                        <Dropdown id="returnpreferredTime" className="onwardPreferredTime"
                                                            style={{ width: '9vw' }}
                                                            value={newItinerary.returnPreferredTime}
                                                            onChange={e => handleInputChange('returnPreferredTime', e)} options={preferredTimeList} optionLabel="name" />
                                                        <label htmlFor="returnpreferredTime">Preferred Time</label>
                                                    </FloatLabel>
                                                </div>
                                                <div >
                                                    <FloatLabel>
                                                        <InputText id="returnTransportNumber" maxLength={250} value={newItinerary.returnTransportNumber} onChange={e => handleInputChange('returnTransportNumber', e)} />
                                                        <label htmlFor="returnTransportNumber">Return Flight/Train No</label>
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

                            <DataTable value={itineraries} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                {/*<Column sortable field="price" header="Price incl. VAT" /> */}
                                <Column sortable field="onwardJourney" header="Onward Journey (From - To)" headerClassName="custom-header" />
                                <Column sortable field="onwardDepartureDate" header="Departure Date" body={(rowData) => formatDate(rowData.onwardDepartureDate)} headerClassName="custom-header" />
                                <Column sortable field="onwardPreferredTime" header="Onward Preferred Time" body={(rowData) => formatPickList(rowData.onwardPreferredTime)} headerClassName="custom-header" />
                                <Column sortable field="onwardTransportNumber" header="Onward Flight/Train No" headerClassName="custom-header" />
                                <Column sortable field="returnJourney" header="Return Journey (From - To)" headerClassName="custom-header" />
                                <Column sortable field="returnArrivalDate" header="Arrival Date" body={(rowData) => formatDate(rowData.returnArrivalDate)} headerClassName="custom-header" />
                                <Column sortable field="returnPreferredTime" header="Return Preferred Time" body={(rowData) => formatPickList(rowData.returnPreferredTime)} headerClassName="custom-header" />
                                <Column sortable field="returnTransportNumber" header="Return Flight/Train No" headerClassName="custom-header" />
                                <Column sortable field="onwardJourneyNote" header="Remarks" headerClassName="custom-header" />
                                <Column header="Actions" headerClassName="custom-header"
                                    body={(rowData, { rowIndex }) => (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Button icon="pi pi-pencil" type="button" style={{ marginRight: '0.5rem', backgroundColor: 'white', color: 'black', border: 'none' }}
                                                onClick={() => handleEditItinerary(rowIndex)} />
                                            {/* <Button severity="danger" type="button" icon="pi pi-trash"
                                                onClick={() => handleRemoveItinerary(rowIndex)} style={{ backgroundColor: 'white', color: 'black', border: 'none' }} /> */}
                                                <Button 
        severity="danger" 
        type="button" 
        icon="pi pi-trash"
        onClick={() => handleRemoveClick(rowIndex)} // Ensure rowIndex is defined
        style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmRemove}
      />
                                        </div>
                                    )}
                                />
                            </DataTable>
                        </div>
                    )}

                                <br></br><br></br>
                                <hr className="separator mb-2" />
                                <p className="mx-2">Note: Kindly attach the 3 quotes/routes provided by Travel Agent for comparison. If the least cost-saving route is not taken, kindly provide the reason below.</p>

                                <div className="px-3 pt-3">
                        <div className="py-1 mb-1">
                            <h6 className="text-left">Attachments</h6>
                        </div>
                        <div className="d-flex">
                            <input
                                type="file"
                                ref={fileInputRef}
                                // accept={accept}
                                onChange={onFileChange}
                            />
                            {/* <button className="btn-sm px-2 py-2 bg-gradients border-0" style={{ color: 'white' }} type="button" onClick={onFileUpload}>Upload</button> */}
                            {/* {fileError && <p style={{ color: 'red' }}>{fileError}</p>} */}
                        </div>

                        {files.length > 0 &&
                            <DataTable className="attachmentTable" value={files} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                <Column className="attachmentTitle" sortable field="title" header="Title" headerClassName="custom-header" body={(rowData) => OnwardJourneyLink(rowData)} />
                                <Column header="Actions" headerClassName="custom-header"
                                    body={(rowData, { rowIndex }) => (
                                        <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}>
                                            {/* <Button severity="danger" type="button" icon="pi pi-times"
                                                onClick={() => handleRemovefiles(rowIndex)} style={{ backgroundColor: 'white', color: 'black', border: 'none' }} /> */}
                                                <Button severity="danger" type="button" icon="pi pi-times"
                                                onClick={() => handleDeleteFileClick(rowIndex)} style={{ backgroundColor: 'white', color: 'black', border: 'none' }} />
                                                 <ConfirmationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirmFileDelete}
            />
                                        </div>
                                    )}
                                />
                            </DataTable>}
                            </div>

                                <div className="form-dropdown-container d-flex gap-3 mx-2 reason-dropdown align-items-center mt-4">
                                    <label htmlFor="reason">Reason<span className="text-danger px-1 mt-2">*</span></label>
                                    <Dropdown inputId="dd-city" value={reasonValue} onChange={(e) => {
                                        setReasonValue(e.value);
                                        setFormData({
                                            ...formData, // Spread the existing formData
                                            flightTicketReason: {
                                                key: e.value.key,
                                                name: e.value.name,
                                                // name: e.value.name // Update only the firstName property
                                            }
                                        });
                                    }} options={reasonList} optionLabel="name" className="w-full" required />
                                </div>
                            </div>



                            </div>
                        )}
                    </div>


                    {/* <button type="submit">Submit</button> */}
                    <div className="gap-5" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="button" className="back-button-travel mb-3" icon="pi pi-angle-double-left" label="Back" rounded onClick={handleBack} />
                        <Button className="mb-3"
                            onClick={() => setFormData(prevFormData => ({
                                ...prevFormData, // Spread the existing formData
                                status: { code: 2 },
                                approveStatus: { key: 'draft' }
                            }))}
                            type="submit"
                            label="Save As Draft"
                            disabled={loading || isEmailValidSubmit}
                        />
                        <Button className="mb-3" type="button" icon="pi pi-angle-double-right" label="Next" rounded onClick={() => setPreviewVisible(true)} />
                        <Button
                            type="submit"
                            ref={submitButtonRef} // Set the ref
                            style={{ display: 'none' }} // Hide the button if desired
                        >
                            Submit
                        </Button>
                        <div>

                            <Dialog header="Preview" visible={previewVisible} style={{ width: '80vw' }} onHide={() => { if (!previewVisible) return; setPreviewVisible(false); }}>
                                {/* {previewVisible && { NewSummary(formData,itineraries) }} */}
                                <FormPreview item={formData} travelInfo={itineraries} attachments={files} />
                                <div className="gap-5 mt-3" style={{ display: 'flex', justifyContent: 'center' }} >
                                    <Button icon="pi pi-angle-double-left" label="Back" type="button" rounded onClick={() => setPreviewVisible(false)} />
                                    <Button
                                        // disabled={isEmailValidSubmit}
                                        onClick={() => {
                                            setPreviewVisible(false);
                                            submitButtonRef.current.click();
                                        }}
                                        // type="submit"
                                        // label="Submit"
                                        disabled={loading || isEmailValidSubmit}
                                        type="submit"
                                        label={"Submit"}
                                    />
                                </div>

                            </Dialog>


                        </div>
                        {loading && (
                                <div className="loader-container">
                                    <div className="loader"></div>
                                </div>
                            )}
                    </div>

                </form>
            </div>
        </div>
    );
}

export default TravelRequestForm;

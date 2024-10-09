import React, { useEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import TravelRequestFormService from "../service/TravelRequestFormService.js";
import "../assets/css/TravelRequestForm.css";
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from "primereact/radiobutton";
import { Button } from 'primereact/button';
import FormPreview from "./FormPreview.js";
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
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
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Toast } from "primereact/toast";
import ConfirmationDialog from './ConfirmationDialog';
import { DatePicker } from "rsuite";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

function EditTravelRequestForm() {
    const location = useLocation();
    const { item, travelInfo, attachmentInfo } = location.state || {};
    // const [isEmailValidSubmit, setIsEmailValidSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itineraryIndexToDelete, setItineraryIndexToDelete] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const fileInputRef = useRef(null);
    const updateButtonRef = useRef(null);

    // console.log("Issuer Date",item.issuerDate);
    // console.log("carRental",item.carRentalCategory);
    // console.log("travelInfo",travelInfo);



    const { auth, login } = useAuth();// Access auth from context
    const { username, password } = auth;
    const authHeader = 'Basic ' + btoa(username + ':' + password);


    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        if (storedUsername && storedPassword && (username !== storedUsername || password !== storedPassword)) {
            login(storedUsername, storedPassword);
        }
    }, [login, username, password]);


    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/MyList');
    };

    const carRentalCategorySwitch = item.carRentalCategory !== '';
    const HotelSwitch = item.hotelLocation !== '';
    const personCarSwitch = item.personalCarDrivingLicenseNumber !== '';
    const flightticketSwitch = item.flightTicketType !== undefined;
    const trainTicketSwitch = item.trainTicketType !== undefined;
    console.log("train switch : ", item.trainTicketType !== undefined)


    const primary = "#fff"; // #f44336
    const [visible, setVisible] = useState(false);
    const [showNights, setShowNights] = useState(HotelSwitch);
    const [showCarDetails, setCarDetails] = useState(carRentalCategorySwitch);
    const [showPerCarDetails, setPerCarDetails] = useState(personCarSwitch);
    const [showTrainDetails, setTrainDetails] = useState(trainTicketSwitch);
    const [showItinerary, setShowItinerary] = useState(false);
    const [showFlightTicket, setFlightTicket] = useState(flightticketSwitch);
    const [userList, setUserList] = useState([]);
    const [reasonList, setReasonList] = useState([]);
    const [flightTypeList, setFlightTypeList] = useState([]);
    const [flightTypeValue, setFlightTypeValue] = useState(item.flightTicketType);
    const [trainTypeList, setTrainTypeList] = useState([]);
    const [trainTypeValue, setTrainTypeValue] = useState(item.trainTicketType);
    const [currencyList, setCurrencyList] = useState([]);
    const [currencyValue, setCurrencyValue] = useState(item.travelCurrency?.name);
    const [preferredTimeList, setPreferredTimeList] = useState([]);
    const [reasonValue, setReasonValue] = useState(item.flightTicketReason?.name);
    const [itineraries, setItineraries] = useState(Array.isArray(travelInfo) ? travelInfo : []);
    const [attachments, setAttachments] = useState(Array.isArray(attachmentInfo) ? attachmentInfo : []);
    const [isEmployeeEmailValid, setIsEmployeeEmailValid] = useState(true);
    const [isTelephoneNumberValid, setIsTelephoneNumberValid] = useState(/^\d{9,15}$/.test(item.issuerNumber));
    const [isManagerEmailValid, setIsManagerEmailValid] = useState(true);
    const [isHODEmailValid, setIsHODEmailValid] = useState(true);
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

    const handleFieldChange = (e, field) => {
        setNewItinerary({ ...newItinerary, [field]: e.target.value });
    };

    const [dropDownSuggestions, setdropDownSuggestions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(item.manager);
    const [dropDownSuggestions2, setdropDownSuggestions2] = useState([]);
    const [selectedItem2, setSelectedItem2] = useState(item.hod);
    const [employeeDropDownSuggestions, setEmployeeDropDownSuggestions] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(item.email);
    // const [open, setOpen] = useState(false);
    // const [message, setMessage] = useState(false);
    const [showReturnFields, setShowReturnFields] = useState(false);
    console.log("newItinerary.returnJourney", newItinerary.returnJourney);
    const [saveItineraryFlag, setSaveItineraryFlag] = useState(true);
    // const [file, setFile] = useState(null);

    const toast = useRef(null);

    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
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
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                // setFileError('File size exceeds the maximum limit.');
                showMessage('error', 'Error', 'File size exceeds the maximum limit')
                return;
            }
            // setFile(selectedFile);
            const changedFile = changeFileName(selectedFile);
            onFileUpload(changedFile, selectedFile.name);
        }
    };

    const handleRemovefiles = async (rowIndex) => {
        const selectedFile = attachments[rowIndex];
        console.log("selected file : ", selectedFile)
        try {
            // await TravelRequestFormService.deleteDocuments(selectedFile.fileId)
            showMessage('success', 'Success', `Successfully removed ${selectedFile.title}`)
            setAttachments(attachments.filter((_, i) => i !== rowIndex));
        } catch (error) {
            console.log("error while deleting : ", error)
            showMessage('error', 'Error', `Error response : ${error.response.data.title}`)
            // setFileError(error)
        }
    };

    const handleRemoveClick = (rowIndex) => {
        setSelectedRowIndex(rowIndex);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRowIndex(null);
    };

    const handleConfirmDeletion = async () => {
        if (selectedRowIndex !== null) {
            await handleRemovefiles(selectedRowIndex);
        }
        handleCloseDialog();
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
            setAttachments([...attachments, tempFile]);
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

    const searchEmployee = (event) => {
        const query = event.query.toLowerCase();
        setEmployeeDropDownSuggestions(
            userList.filter(item => item.email.toLowerCase().includes(query))
        );
    };
    // const [selectedPhoneCode, setSelectedPhoneCode] = useState(null);
    const handleEditItinerary = (index) => {
        const itineraryToEdit = { ...itineraries[index] }; // Create a copy to avoid direct mutation
        setNewItinerary({
            ...itineraryToEdit,
            onwardDepartureDate: itineraryToEdit.onwardDepartureDate ? new Date(itineraryToEdit.onwardDepartureDate) : null,
            returnArrivalDate: itineraryToEdit.returnArrivalDate ? new Date(itineraryToEdit.returnArrivalDate) : null,
        });
        console.log("itineraryToEdit", itineraryToEdit)
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


    const handleRemoveItinerary = async (index) => {
        const itineraryToRemove = itineraries[index];
        if (!itineraryToRemove) return;

        try {
            // Delete itinerary from server
            // await deleteItineraryFromServer(itineraryToRemove.id);

            // Remove itinerary from state
            setItineraries(itineraries.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Failed to delete itinerary:', error);
            // Optionally, show an error message to the user
        }
    };

    const openConfirmationDialog = (index) => {
        setItineraryIndexToDelete(index);
        setDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itineraryIndexToDelete !== null) {
            handleRemoveItinerary(itineraryIndexToDelete);
            setItineraryIndexToDelete(null); // Reset the index
        }
        setDialogOpen(false);
    };


    const deleteItineraryFromServer = async (id) => {
        try {
            await fetch(`http://localhost:8080/o/c/traveldetailses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                },
            });
        } catch (error) {
            console.error('Error deleting itinerary:', error);
        }
    };

    const searchItem = (event) => {
        const query = event.query.toLowerCase();
        setdropDownSuggestions(
            userList.filter(item => item.email.toLowerCase().includes(query) && (item.email.toLowerCase() !== formData.email.toLowerCase()))
        );
    };
    const searchItem2 = (event) => {
        const query = event.query.toLowerCase();
        setdropDownSuggestions2(
            userList.filter(item => item.email.toLowerCase().includes(query) && (item.email.toLowerCase() !== formData.manager.toLowerCase()) && (item.email.toLowerCase() !== formData.email.toLowerCase()))
        );
    };

    const itemTemplate = (item) => {
        return (
            <div className="p-d-flex p-ai-center">
                <div className="p-mr-2">{item.email}</div>
            </div>
        );
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
            setLoading(true);
            try {
                const reasonList = await TravelRequestFormService.fetchReasonPicklist();
                setReasonList(reasonList);
                console.log("reasons :", reasonList);
            } catch (error) {
                console.error("Error fetching reason", error);
            }
            finally {
                setLoading(false);
            }
        };

        getAllReasons();
    }, []);

    useEffect(() => {
        const getAllFlightTypes = async () => {
            setLoading(true);
            try {
                const flightTypes = await TravelRequestFormService.fetchFlightTypePicklist();
                setFlightTypeList(flightTypes);
                console.log("flight types :", flightTypes);
            } catch (error) {
                console.error("Error fetching flight ", error);
            }
            finally {
                setLoading(false);
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


    // const handleInputChange = (name, e) => {
    //     const { value } = e.target;
    //     console.log(name, " : ", value);
    //     setNewItinerary({
    //         ...newItinerary,
    //         [name]: value
    //     });
    // };

    const handleInputChange = (name, e) => {
        const { value } = e.target;
        console.log(name, " : ", value);

        if (name === 'onwardDepartureDate') {
            setNewItinerary({
                ...newItinerary,
                [name]: value,
                returnArrivalDate: null,
            });
        }
        else if (name === 'onwardPreferredTime') {
            // Find the selected option based on the name
            const selectedOption = preferredTimeList.find(option => option.name === value);
            if (selectedOption) {
                setNewItinerary({
                    ...newItinerary,
                    [name]: selectedOption // Set the entire selected object
                });
            }
        }
        else if (name === 'returnPreferredTime') {
            // Find the selected option based on the name
            const selectedOption = preferredTimeList.find(option => option.name === value);
            if (selectedOption) {
                setNewItinerary({
                    ...newItinerary,
                    [name]: selectedOption // Set the entire selected object
                });
            }
        }
        else {
            setNewItinerary({
                ...newItinerary,
                [name]: value
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
                hotelNote: ''
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
                personalCarNote: "",
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
                flightTicketReason: {},
                trainTicketType: {},
                itineraryRelation: [],
                attachmentRelation: [],
            }));
            setReasonValue([]);
            setTrainTypeValue([]);
            setItineraries([]);
            setAttachments([]);
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

    console.log("flightTicketType", item.flightTicketType?.name);

    const setTimeZone = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 6);
        return date;
    }


    const [formData, setFormData] = React.useState({
        travelRequestId: item.travelRequestId || "",
        issuer: item.issuer || "",
        issuerDate: new Date(item.issuerDate) || null,
        issuerNumber: item.issuerNumber || null,
        email: item.email || "",
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        employeeNumber: item.employeeNumber || "",
        costCenter: item.costCenter || "",
        entity: item.entity || "",
        positionTitle: item.positionTitle || "",
        travelType: item.travelType || "",
        travelPurpose: item.travelPurpose || "",
        participants: item.participants || "",
        destination: item.destination || "",
        travelDepartureDate: new Date(item.travelDepartureDate) || null,
        travelArrivalDate: new Date(item.travelArrivalDate) || null,
        travelEstimatedDuration: item.travelEstimatedDuration || null,
        travelCurrency: item.travelCurrency,
        travelNote: item.travelNote || null,
        travelBudget: item.travelBudget || null,
        flightTicketReason: item.flightTicketReason,
        flightTicketType: item.flightTicketType,
        carRentalFrom: item.carRentalFrom || "",
        carRentalTo: item.carRentalTo || "",
        carRentalOn: new Date(item.carRentalOn) || null,
        carRentalUntil: new Date(item.carRentalUntil) || null,
        carRentalBirthDate: new Date(item.carRentalBirthDate) || null,
        carDrivingLicense: item.carDrivingLicense || "",
        carRentalCategory: item.carRentalCategory || "",
        carRentalNote: item.carRentalNote || "",
        personalCarDrivingLicenseNumber: item.personalCarDrivingLicenseNumber || "",
        personalCarRegistrationNumber: item.personalCarRegistrationNumber || "",
        personalCarNote: item.personalCarNote || "",
        trainTicketType: item.trainTicketType,
        hotelLocation: item.hotelLocation || "",
        hotelNumberOfNights: item.hotelNumberOfNights || null,
        hotelCheckIn: item.hotelCheckIn ? new Date(item.hotelCheckIn) : null,
        hotelCheckOut: item.hotelCheckOut ? new Date(item.hotelCheckOut) : null,
        hotelNote: item.hotelNote || "",
        manager: item.manager || '',
        hod: item.hod || '',
        itineraryRelation: itineraries,
        attachmentRelation: attachments
        // itineraryRelation: Array.isArray(travelInfo) ? travelInfo : []
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.issuer) newErrors.issuer = "Issuer is required.";
        if (!formData.issuerDate) newErrors.issuerDate = "Issuer Date is required.";
        if (!isTelephoneNumberValid) newErrors.issuerNumber = "Issuer Number is not valid.";
        if (!formData.issuerNumber) newErrors.issuerNumber = "Issuer Number is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.travelType) newErrors.travelType = "Travel type is required.";
        if (!formData.travelPurpose) newErrors.travelPurpose = "Travel Purpose is required.";
        if (!formData.destination) newErrors.destination = "Destination is required.";
        if (!formData.travelDepartureDate) newErrors.travelDepartureDate = "Departure date is required.";
        if (!formData.travelArrivalDate) newErrors.travelArrivalDate = "Arrival date is required.";
        if (formData.travelCurrency.key === undefined) newErrors.travelCurrency = "Travel Currency is required.";
        if (!formData.travelBudget) newErrors.travelBudget = "Travel Budget is required.";

        if (!isEmployeeEmailValid) newErrors.email = "Email not valid.";
        if (!isManagerEmailValid) newErrors.manager = "Email not valid.";
        if (!isHODEmailValid) newErrors.hod = "Email not valid.";
        if (!formData.manager) newErrors.manager = "Email is required.";
        if (formData.travelType === 'international' && !formData.hod) newErrors.hod = "Email is required.";

        if (showNights) {
            if (!formData.hotelLocation) newErrors.hotelLocation = "Hotel location is required.";
            if (!formData.hotelCheckIn) newErrors.hotelCheckIn = "Hotel CheckIn is required.";
            if (!formData.hotelCheckOut) newErrors.hotelCheckOut = "Hotel CheckOut is required.";
        }

        if (showCarDetails) {
            if (!formData.carRentalFrom) newErrors.carRentalFrom = "Car rental from is required.";
            if (!formData.carRentalTo) newErrors.carRentalTo = "Car rental to is required.";
            if (!formData.carRentalOn) newErrors.carRentalOn = "Car rental on is required.";
            if (!formData.carRentalUntil) newErrors.carRentalUntil = "Car rental until is required.";
            if (!formData.carRentalBirthDate) newErrors.carRentalBirthDate = "Car rental birthday is required.";
            if (!formData.carDrivingLicense) newErrors.carDrivingLicense = "Car rental driving License is required.";
            if (!formData.carRentalCategory) newErrors.carRentalCategory = "Car rental category is required.";
        }

        if (showPerCarDetails) {
            if (!formData.personalCarDrivingLicenseNumber) newErrors.personalCarDrivingLicenseNumber = "Perasonal Car driving License is required.";
            if (!formData.personalCarRegistrationNumber) newErrors.personalCarRegistrationNumber = "Personal Car registration no. is required.";
        }

        if (showFlightTicket) {
            if (!formData.flightTicketType) newErrors.flightTicketType = "Flight Ticket Type is required.";
        }
        console.log("errors : ", newErrors)
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

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
            travelRequestId: uniqId
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

    // useEffect(() => {
    //     // setFormData({
    //     //     ...formData,
    //     //     itineraryRelation: itineraries
    //     // })
    //     const updatedItineraries = [...formData.itineraryRelation, newItinerary];
    //     setFormData(prevData => ({
    //         ...prevData,
    //         itineraryRelation: updatedItineraries
    //     }));
    // }, [itineraries]);


    useEffect(() => {
        // Update itineraryRelation in formData when itineraries change
        setFormData(prevData => ({
            ...prevData,
            itineraryRelation: itineraries
        }));
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

    // useEffect(() => {
    //     console.log("status :", (!isManagerEmailValid || !isHODEmailValid))
    //     setIsEmailValidSubmit(((!isManagerEmailValid) || !isHODEmailValid)); // || !isTelephoneNumberValid
    // }, [isHODEmailValid, isManagerEmailValid]); //, isTelephoneNumberValid


    const formatFormData = (data) => {
        return {
            ...data,
            itineraryRelation: data.itineraryRelation.map(itinerary => ({
                id: itinerary.id || null,
                r_itineraryRelation_c_travelInfoId: itinerary.r_itineraryRelation_c_travelInfoId,
                onwardJourney: itinerary.onwardJourney,
                onwardDepartureDate: itinerary.onwardDepartureDate ? setTimeZone(new Date(itinerary.onwardDepartureDate).toISOString()) : null,
                onwardPreferredTime: itinerary.onwardPreferredTime,
                onwardJourneyNote: itinerary.onwardJourneyNote,
                onwardTransportNumber: itinerary.onwardTransportNumber,
                returnJourney: itinerary.returnJourney,
                returnArrivalDate: itinerary.returnArrivalDate ? setTimeZone(new Date(itinerary.returnArrivalDate).toISOString()) : null,
                returnPreferredTime: itinerary.returnPreferredTime,
                returnTransportNumber: itinerary.returnTransportNumber,
            })),
            attachmentRelation: attachments.map(attachment => ({
                id: attachment.id || null,
                r_attachmentRelation_c_travelInfoId: attachment.r_attachmentRelation_c_travelInfoId,
                title: attachment.title,
                fileId: attachment.fileId,
                contentUrl: attachment.contentUrl
            }))
        };
    };


    // Handle form submission
    const handleFormSubmit = async (e) => {
        console.log('Submitting formData:', formData);
        const formattedData = formatFormData(formData);
        e.preventDefault();
        if (validateForm()) {
            setErrors({});
        } else {
            showMessage('error', 'Error', `Fill all the required fields`);
            return;
        }
        setLoading(true);
        console.log("Form submission started");
        const uniqId = await createUniqueId();
        console.log("unique Id : ", uniqId);

        try {
            let response;
            if (item.id) {
                // If item.id exists, update the record
                response = await TravelRequestFormService.updateFormData(item.id, formattedData);
                // setMessage(`Successfully updated Id : ${response.data.id}`);
                showMessage('success', 'Success', `Successfully updated Id : ${response.data.travelRequestId}`);
            } else {
                // Otherwise, create a new record
                response = await TravelRequestFormService.submitFormData(formData);
                // setMessage(`Successfully created Id : ${response.data.id}`);
                showMessage('success', 'Success', `Successfully created Id : ${response.data.travelRequestId}`);
            }
            setTimeout(() => {
                handleBack();
            }, 1000);
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

    // const handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpen(false);
    // };

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

    const pattern = /^\d{9,15}$/;

    const validateTelephoneNumber = (input) => {
        console.log("issuer no : ", pattern.test(input))
        setIsTelephoneNumberValid(pattern.test(input));
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
        if (selectedItem === '')
            setIsHODEmailValid(true)
        else
            setIsHODEmailValid(validateHODEmail(value));
    };
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
                        <div className="align-items-start"><h5 className="text-white text-left mt-2">Edit Travel Request</h5></div>
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
                                    tooltip="Enter your issuer" tooltipOptions={{ position: 'bottom' }}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        issuer: e.target.value
                                    })}
                                />
                                <label htmlFor="issuer" className="small">Issuer<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            {errors.issuer && !formData.issuer && <span style={{ color: 'red' }}>{errors.issuer}</span>}
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
                            {errors.issuerDate && !formData.issuerDate && <span style={{ color: 'red' }}>{errors.issuerDate}</span>}
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
                                    }} />
                                <label htmlFor="number-input" className="small">Telephone Number<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                            {(!isTelephoneNumberValid && formData.issuerNumber !== null) && <span htmlFor="number-input" style={{ color: 'red' }}>Invalid Number</span>}
                            {errors.issuerNumber && !formData.issuerNumber && <span style={{ color: 'red' }}>{errors.issuerNumber}</span>}
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
                                                    manager: '',
                                                    hod: ''
                                                });
                                                setSelectedItem('');
                                                setSelectedItem2('');
                                                handleBlur(e.value);
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
                                            disabled={item.approveStatus?.key !== 'draft'}
                                            // readOnly={formData.approveStatus?.key !== 'draft'}
                                            required
                                        />
                                        <label htmlFor="employeeEmail" className="small"><strong>Email <span className="text-danger px-1">*</span></strong></label>
                                        {!isEmployeeEmailValid && <span htmlFor="employeeEmail" style={{ color: 'red' }}>Invalid Email</span>}
                                        {errors.email && !formData.email && isEmployeeEmailValid && <span style={{ color: 'red' }}>{errors.email}</span>}
                                    </FloatLabel>
                                </div>
                                <div className="form-single">
                                    <FloatLabel>
                                        <InputText type="text" id="firstName" name="firstName" value={formData.firstName} readOnly />
                                        <label htmlFor="firstName" className="small">First Name<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                                <div className="form-single">
                                    <FloatLabel>
                                        <InputText type="text" id="lastName" name="lastName" value={formData.lastName} readOnly />
                                        <label htmlFor="lastName" className="small">Last Name<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                                <div className="form-single">
                                    <FloatLabel>
                                        <InputText type="text" id="employeeNumber" name="employeeNumber" value={item.employeeNumber} readOnly />
                                        <label htmlFor="employeeNumber" className="small">Employee Number<span className="text-danger px-1">*</span></label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-stretch gap-3 mt-3">
                        <div className="form-single-special">
                            <FloatLabel>
                                <InputText type="text" id="costCenter" name="costCenter" value={formData.costCenter} readOnly />
                                <label htmlFor="costCenter" className="small">Cost Centre<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                        <div className="form-single-special">
                            <FloatLabel>
                                <InputText type="text" id="entity" name="entity" value={formData.entity} readOnly />
                                <label htmlFor="entity" className="small">Entity<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                        <div className="form-single-special">
                            <FloatLabel>
                                <InputText type="text" id="positionTitle" name="positionTitle" value={formData.positionTitle} readOnly />
                                <label htmlFor="positionTitle" className="small">Position Title<span className="text-danger px-1">*</span></label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="travel-details-container gap-3 px-3 pt-3">
                        <div className="py-1 mb-3">
                            <h6 className="text-left">Travel Details</h6>
                            <hr className="separator mt-2" />
                        </div>
                        <p className="my-2">Note: All International flights have to be approved by Head of Department/GM/VP.</p>
                        <div className="travel-type mb-3">
                            <label htmlFor="travelType" className="mr-2">Travel Type<span className="text-danger px-1">*</span></label>
                            <div className="radio-group">
                                <RadioButton inputId="domestic" name="travelType" value="domestic"
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        travelType: e.value
                                    })}
                                    checked={formData.travelType === 'domestic'} />
                                <label htmlFor="domestic" className="mr-1 small">D</label>
                                <RadioButton inputId="international" name="travelType" value="international"
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        travelType: e.value
                                    })}
                                    checked={formData.travelType === 'international'} />
                                <label htmlFor="international" className="mr-1 small">I</label>
                            </div>
                        </div>
                        {errors.travelType && !formData.travelType && <span style={{ color: 'red' }}>{errors.travelType}</span>}
                        <div className="d-flex justify-content-between align-items-stretch gap-3 my-4">
                            <FloatLabel className="w-50">
                                <InputTextarea id="travelPurpose" className="full-width-textarea" value={formData.travelPurpose}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        travelPurpose: e.target.value
                                    })} rows={2} cols={30} />
                                <label htmlFor="travelPurpose" className="small">Travel Purpose<span className="text-danger px-1">*</span></label>
                                {errors.travelPurpose && !formData.travelPurpose && <span style={{ color: 'red' }}>{errors.travelPurpose}</span>}
                            </FloatLabel>
                            <FloatLabel className="w-50">
                                <InputTextarea id="participants" className="full-width-textarea" value={formData.participants}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        participants: e.target.value
                                    })} rows={2} cols={30} />
                                <label htmlFor="participants" className="small">Participants</label>
                            </FloatLabel>
                        </div>
                        <div className="d-flex justify-content-between align-items-stretch gap-3 my-4">
                            <div className="w-25">
                                <FloatLabel >
                                    <InputText id="destination" className="full-width-textarea w-100" value={formData.destination}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            destination: e.target.value
                                        })} rows={3} cols={30} />
                                    <label htmlFor="destination" className="small">Destination<span className="text-danger px-1">*</span></label>
                                </FloatLabel>
                                {errors.destination && !formData.destination && <span style={{ color: 'red' }}>{errors.destination}</span>}
                            </div>
                            <div className="w-25">
                                <FloatLabel>
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
                                {errors.travelDepartureDate && !formData.travelDepartureDate && <span style={{ color: 'red' }}>{errors.travelDepartureDate}</span>}
                            </div>
                            <div className="w-25">
                                <FloatLabel >
                                    <Calendar id="returnDate" minDate={formData.travelDepartureDate} dateFormat="dd-M-yy" className="w-100" value={formData.travelArrivalDate}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                travelArrivalDate: setTimeZone(e.value)
                                            })
                                            calculateEstimatedDuration(formData.travelDepartureDate, setTimeZone(e.value))
                                        }}
                                        showIcon />
                                    <label htmlFor="returnDate" className="mr-2 small">Return Date<span className="text-danger px-1">*</span></label>
                                </FloatLabel >
                                {errors.travelArrivalDate && !formData.travelArrivalDate && <span style={{ color: 'red' }}>{errors.travelArrivalDate}</span>}
                            </div>
                            <div className="w-25">
                                <FloatLabel>
                                    <label htmlFor="estimatedduration" className="mr-2 small">Estimated Duration<span className="text-danger px-1">*</span></label>
                                    <InputText id="estimatedduration" className="w-100" value={formData.travelEstimatedDuration} readOnly />
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="d-flex align-items-stretch gap-3 my-4">
                            <div>
                                <FloatLabel>
                                    <Dropdown value={currencyValue} onChange={(e) => {
                                        const selectedCurrency = currencyList.find(option => option.name === e.value);
                                        setCurrencyValue(e.value);
                                        setFormData((prevFormData) => ({
                                            ...prevFormData,
                                            travelCurrency: {
                                                key: selectedCurrency.key,
                                                name: selectedCurrency.name,
                                            }
                                        }));
                                    }} options={currencyList} optionLabel="name"
                                        optionValue="name" />
                                    <label htmlFor="currency" className="small">Currency<span className="text-danger px-1">*</span></label>
                                </FloatLabel>
                                {errors.travelCurrency && formData.travelCurrency.key === undefined && <span style={{ color: 'red' }}>{errors.travelCurrency}</span>}

                            </div>
                            <div>
                                <FloatLabel>
                                    <InputNumber id="budgetAmount" value={formData.travelBudget}
                                        onValueChange={(e) => setFormData({
                                            ...formData,
                                            travelBudget: e.target.value
                                        })} />
                                    <label htmlFor="budgetAmount" className="small">Budget Amount<span className="text-danger px-1">*</span></label>
                                </FloatLabel>
                                {errors.travelBudget && !formData.travelBudget && <span style={{ color: 'red' }}>{errors.travelBudget}</span>}
                            </div>
                            <div className="flex-grow-1">
                                <FloatLabel >
                                    <InputText id="Note" className="w-100" value={formData.travelNote}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            travelNote: e.target.value
                                        })} />
                                    <label htmlFor="Note" className="small">Remarks</label>
                                </FloatLabel>
                            </div>
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
                                            setIsHODEmailValid(true);
                                            handleBlur2(e.value);
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
                                        disabled={selectedEmployee === null || item.approveStatus?.key !== 'draft'}
                                    // readOnly={formData.approveStatus?.key !== 'draft'}
                                    // required
                                    // tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
                                    // tooltip="Disabled"
                                    />
                                    <label htmlFor="manager" className="small">Manager<span className="text-danger px-1">*</span></label>
                                    {!isManagerEmailValid && <span htmlFor="manager" style={{ color: 'red' }}>Invalid Email</span>}
                                    {errors.manager && !formData.manager && isManagerEmailValid && <span style={{ color: 'red' }}>{errors.manager}</span>}
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
                                        }}
                                        onSelect={(e) => {
                                            setSelectedItem2(e.value);
                                            setFormData({
                                                ...formData, // Spread the existing formData
                                                hod: e.value.email
                                            });
                                            console.log("value : " + JSON.stringify(e.value.email));
                                        }}
                                        itemTemplate={itemTemplate}
                                        disabled={selectedItem === null || item.approveStatus?.key !== 'draft'}
                                    // required={formData.travelType === 'international'}
                                    // tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
                                    // readOnly={formData.approveStatus?.key !== 'draft'}
                                    // tooltip="Disabled"
                                    />
                                    <label htmlFor="hod" className="small">Head Of Department/GM/VP{formData.travelType === 'international' && <span className="text-danger px-1">*</span>}</label>

                                    {!isHODEmailValid && <span htmlFor="hod" style={{ color: 'red' }}>Invalid Email</span>}
                                    {errors.hod && !formData.hod && isHODEmailValid && <span style={{ color: 'red' }}>{errors.hod}</span>}
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
                                    checked={showNights}
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
                                        <InputText id="location" name="location"
                                            value={formData.hotelLocation}
                                            onChange={(e) => setFormData({
                                                ...formData, // Spread the existing formData
                                                hotelLocation: e.target.value // Update only the firstName property
                                            })} />
                                    </FloatLabel>
                                    {errors.hotelLocation && !formData.hotelLocation && <span style={{ color: 'red' }}>{errors.hotelLocation}</span>}
                                </div>
                                <div className="calendar-item col-width">
                                    {/* <FloatLabel> */}
                                    <lable className="startdate">Check In<span className="text-danger px-1">*</span></lable>
                                    <DatePicker format="dd/MMM/yyyy hh:mm aa" showMeridian id="checkIn" value={formData.hotelCheckIn}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                hotelCheckIn: e,
                                                hotelCheckOut: null,
                                                hotelNumberOfNights: null
                                            });
                                            // calculateEstimatedNights(e.value, formData.hotelCheckOut);

                                        }}
                                        placeholder="CheckIn"
                                        hideMinutes={(e) => e % 10 !== 0}
                                    />
                                    {errors.hotelCheckIn && !formData.hotelCheckIn && <span style={{ color: 'red' }}>{errors.hotelCheckIn}</span>}
                                </div>
                                <div className="calendar-item col-width">
                                    {/* <FloatLabel> */}
                                    <lable className="endate">Check Out<span className="text-danger px-1">*</span></lable>
                                    <DatePicker format="dd/MMM/yyyy hh:mm aa" showMeridian id="checkOut" minDate={formData.hotelCheckIn} value={formData.hotelCheckOut}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                hotelCheckOut: e
                                            });
                                            calculateEstimatedNights(formData.hotelCheckIn, e);
                                        }}
                                        placeholder="CheckOut"
                                        hideMinutes={(e) => e % 10 !== 0}
                                        shouldDisableDate={(date) => {
                                            const checkInDate = formData.hotelCheckIn ? new Date(formData.hotelCheckIn) : null;
                                            return checkInDate && date < checkInDate; // Disable dates before check-in
                                        }}
                                    />
                                    {errors.hotelCheckOut && !formData.hotelCheckOut && <span style={{ color: 'red' }}>{errors.hotelCheckOut}</span>}

                                </div>
                                <div className="calendar-item">
                                    <FloatLabel>
                                        <label htmlFor="nights">No of Nights</label>
                                        <InputNumber id="nights" name="nights"
                                            value={formData.hotelNumberOfNights}
                                            readOnly />
                                    </FloatLabel>
                                </div>
                                <div className="calendar-item flex-shrink-1 flex-grow-1">
                                    <FloatLabel className="w-100">
                                        <label htmlFor="hotelNote">Remarks</label>
                                        <InputText id="hotelNote" name="hotelNote" className="w-100"
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
                                    checked={showCarDetails}
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
                                            <InputText type="text" id="category" name="category"
                                                value={formData.carRentalCategory}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalCategory: e.target.value
                                                })}
                                            />
                                        </FloatLabel>
                                        {errors.carRentalCategory && !formData.carRentalCategory && <span style={{ color: 'red' }}>{errors.carRentalCategory}</span>}
                                    </div>
                                    {/* <div className="form-row"> */}
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <label htmlFor="from">From:<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" id="from" name="from"
                                                value={formData.carRentalFrom}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalFrom: e.target.value
                                                })}
                                            />
                                        </FloatLabel>
                                        {errors.carRentalFrom && !formData.carRentalFrom && <span style={{ color: 'red' }}>{errors.carRentalFrom}</span>}
                                    </div>

                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <label htmlFor="to">To:<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" id="to" name="to"
                                                value={formData.carRentalTo}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalTo: e.target.value
                                                })}
                                            />
                                        </FloatLabel>
                                        {errors.carRentalTo && !formData.carRentalTo && <span style={{ color: 'red' }}>{errors.carRentalTo}</span>}
                                    </div>
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <Calendar id="on" dateFormat="dd-M-yy" value={formData.carRentalOn}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalOn: setTimeZone(e.value),
                                                    carRentalUntil: null
                                                })} showIcon />
                                            <label for="on">On:<span className="text-danger px-1">*</span></label>
                                        </FloatLabel>
                                        {errors.carRentalOn && !formData.carRentalOn && <span style={{ color: 'red' }}>{errors.carRentalOn}</span>}
                                    </div>
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <Calendar id="until" minDate={formData.carRentalOn} dateFormat="dd-M-yy" value={formData.carRentalUntil}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalUntil: setTimeZone(e.value)
                                                })} showIcon />
                                            <label for="until">Until:<span className="text-danger px-1">*</span></label>
                                        </FloatLabel>
                                        {errors.carRentalUntil && !formData.carRentalUntil && <span style={{ color: 'red' }}>{errors.carRentalUntil}</span>}
                                    </div>
                                </div>
                                <div className="calendar-container d-flex align-items-stretch gap-3 my-4 mx-2">
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <Calendar id="birthDate" dateFormat="dd-M-yy" value={formData.carRentalBirthDate}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carRentalBirthDate: setTimeZone(e.value)
                                                })} showIcon />
                                            <label for="birthDate">Birth Date<span className="text-danger px-1">*</span></label>
                                        </FloatLabel>
                                        {errors.carRentalBirthDate && !formData.carRentalBirthDate && <span style={{ color: 'red' }}>{errors.carRentalBirthDate}</span>}
                                    </div>
                                    <div className="calendar-item">
                                        <FloatLabel>
                                            <label htmlFor="drivingLicense">Driving License<span className="text-danger px-1">*</span></label>
                                            <InputText type="text" id="drivingLicense" name="drivingLicense"
                                                value={formData.carDrivingLicense}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    carDrivingLicense: e.target.value
                                                })}
                                            />
                                        </FloatLabel>
                                        {errors.carDrivingLicense && !formData.carDrivingLicense && <span style={{ color: 'red' }}>{errors.carDrivingLicense}</span>}
                                    </div>
                                    <div className="calendar-item flex-grow-1">
                                        <FloatLabel className="w-100 car-note">
                                            <label htmlFor="carRentalNote">Remarks</label>
                                            <InputText id="carRentalNote" className="w-100" name="carRentalNote"
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
                                    checked={showPerCarDetails}
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
                                        <InputText type="text" id="carRegNum" name="carRegNum"
                                            value={formData.personalCarRegistrationNumber}
                                            onChange={(e) => setFormData({
                                                ...formData, // Spread the existing formData
                                                personalCarRegistrationNumber: e.target.value // Update only the firstName property
                                            })}
                                        />
                                    </FloatLabel>
                                    {errors.personalCarRegistrationNumber && !formData.personalCarRegistrationNumber && <span style={{ color: 'red' }}>{errors.personalCarRegistrationNumber}</span>}
                                </div>
                                <div className="calendar-item">
                                    <FloatLabel>
                                        <label htmlFor="drivingLicenseNum">Driving License Number<span className="text-danger px-1">*</span></label>
                                        <InputText type="text" id="drivingLicenseNum" name="drivingLicenseNum"
                                            value={formData.personalCarDrivingLicenseNumber}
                                            onChange={(e) => setFormData({
                                                ...formData, // Spread the existing formData
                                                personalCarDrivingLicenseNumber: e.target.value // Update only the firstName property
                                            })}
                                        />
                                    </FloatLabel>
                                    {errors.personalCarDrivingLicenseNumber && !formData.personalCarDrivingLicenseNumber && <span style={{ color: 'red' }}>{errors.personalCarDrivingLicenseNumber}</span>}
                                </div>
                                <div className="calendar-item flex-grow-1">
                                    <FloatLabel className="w-100 car-note">
                                        <label htmlFor="personalCarNote">Remarks</label>
                                        <InputText id="personalCarNote" className="w-100" name="personalCarNote"
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
                                    checked={showFlightTicket}
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
                                                                    name: e.value.name,
                                                                }
                                                            });
                                                            console.log("radio : ", formData)
                                                        }
                                                        }
                                                        checked={flightTypeValue.key === category.key} />
                                                    <label htmlFor={category.key} className="ps-1 px-2">{category.name}</label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="d-flex gap-3 mt-3 mx-2 train">
                                        <label htmlFor="travelType" className="mr-2 train">Ticket Type<span className="text-danger px-1">*</span></label>
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
                                                                    name: e.value.name // Update only the firstName property
                                                                }
                                                            });
                                                            console.log("radio : ", formData)
                                                        }
                                                        }
                                                        checked={trainTypeValue ? trainTypeValue.key === category.key : null} />
                                                    <label htmlFor={category.key} className="ml-2 px-2">{category.name}</label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>


                                <br></br>
                                <div className="addbutton mx-2">
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
                                                            <InputText className="journeyField" id="onwardJourney" value={newItinerary.onwardJourney} onChange={e => handleInputChange('onwardJourney', e)} />
                                                            <label htmlFor="onwardJourney">Onward Journey (From - To)</label>
                                                        </FloatLabel>
                                                    </div>
                                                    <div className="calendar-item col-width">
                                                        <FloatLabel >
                                                            <Calendar id="onwardDepartureDate" dateFormat="dd-M-yy" value={newItinerary.onwardDepartureDate} onChange={(e) => handleInputChange('onwardDepartureDate', e)} showIcon />
                                                            <label htmlFor="onwardDepartureDate">Departure Date</label>
                                                        </FloatLabel>
                                                    </div>
                                                    <div className="calendar-item">
                                                        <FloatLabel>
                                                            <Dropdown id="onwardPreferredTime" className="onwardPreferredTime"
                                                                value={newItinerary.onwardPreferredTime.name}
                                                                onChange={e => handleInputChange('onwardPreferredTime', e)} options={preferredTimeList} optionLabel="name" optionValue="name" />
                                                            <label htmlFor="onwardPreferredTime">Preferred Time</label>
                                                        </FloatLabel>
                                                    </div>
                                                    <div className="calendar-item">
                                                        <FloatLabel>
                                                            <InputText id="onwardTransportNumber" value={newItinerary.onwardTransportNumber} onChange={e => handleInputChange('onwardTransportNumber', e)} />
                                                            <label htmlFor="onwardTransportNumber">Onward Flight/Train No</label>
                                                        </FloatLabel>
                                                    </div>
                                                    <div className="calendar-item flex-grow-1">
                                                        <FloatLabel className="w-100 car-note">
                                                            <InputText id="onwardJourneyNote" className="w-100" value={newItinerary.onwardJourneyNote} onChange={e => handleInputChange('onwardJourneyNote', e)} />
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
                                                                    <InputText className="journeyField" id="returnJourney" value={newItinerary.returnJourney} onChange={e => handleInputChange('returnJourney', e)} />
                                                                    <label htmlFor="returnJourney">Return Journey (From - To)</label>
                                                                </FloatLabel>
                                                            </div>
                                                            <div className="col-width">
                                                                <FloatLabel>
                                                                    <Calendar id="returnArrivalDate" minDate={newItinerary.onwardDepartureDate} dateFormat="dd-M-yy" value={newItinerary.returnArrivalDate} onChange={(e) => handleInputChange('returnArrivalDate', e)} showIcon />
                                                                    <label htmlFor="returnArrivalDate">Arrival Date</label>
                                                                </FloatLabel>
                                                            </div>
                                                            <div className="returnpreferredTime">
                                                                <FloatLabel>
                                                                    <Dropdown id="returnpreferredTime" className="onwardPreferredTime"
                                                                        value={newItinerary.returnPreferredTime?.name}
                                                                        onChange={e => handleInputChange('returnPreferredTime', e)} options={preferredTimeList} optionLabel="name" optionValue="name" />
                                                                    <label htmlFor="returnpreferredTime">Preferred Time</label>
                                                                </FloatLabel>
                                                            </div>
                                                            <div >
                                                                <FloatLabel>
                                                                    <InputText id="returnTransportNumber" value={newItinerary.returnTransportNumber} onChange={e => handleInputChange('returnTransportNumber', e)} />
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
                                {itineraries.length >= 0 && (
                                    <div className="itinerary-table">
                                        <div>
                                            <DataTable value={itineraries} showGridlines tableStyle={{ minWidth: '50rem' }}>
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
                                                            <Button icon={<EditIcon />} style={{ marginRight: '0.5rem', backgroundColor: 'white', color: 'black', border: 'none', padding: 0 }} type="button" onClick={() => handleEditItinerary(rowIndex)} />
                                                            {/* <Button severity="danger" icon="pi pi-trash" type="button" onClick={() => handleRemoveItinerary(rowIndex)} style={{ backgroundColor: 'white', color: 'black', border: 'none' }} /> */}
                                                            <Button severity="danger" icon={<DeleteIcon />} type="button" onClick={() => openConfirmationDialog(rowIndex)} style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: 0 }} />
                                                            <ConfirmationDialog
                                                                open={dialogOpen}
                                                                onClose={() => setDialogOpen(false)}
                                                                onConfirm={handleConfirmDelete}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </DataTable>
                                        </div>
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

                                    {attachments.length > 0 &&
                                        <DataTable className="attachmentTable" value={attachments} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                            <Column className="attachmentTitle" sortable field="title" header="Title" headerClassName="custom-header" body={(rowData) => OnwardJourneyLink(rowData)} />
                                            <Column header="Actions" headerClassName="custom-header"
                                                body={(rowData, { rowIndex }) => (
                                                    <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}>
                                                        {/* <Button severity="danger" type="button" icon="pi pi-times"
                                                onClick={() => handleRemovefiles(rowIndex)} style={{ backgroundColor: 'white', color: 'black', border: 'none' }} /> */}
                                                        <Button severity="danger" type="button" icon={<CloseIcon />}
                                                            onClick={() => handleRemoveClick(rowIndex)} style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: 0, paddingLeft: '4px' }} />
                                                        <ConfirmationDialog
                                                            open={openDialog}
                                                            onClose={handleCloseDialog}
                                                            onConfirm={handleConfirmDeletion}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </DataTable>}
                                </div>

                                <div className="form-dropdown-container d-flex gap-3 mx-2 reason-dropdown align-items-center mt-4">
                                    <label htmlFor="reason">Reason</label>
                                    <Dropdown inputId="dd-city" value={reasonValue} onChange={(e) => {
                                        const selectedReason = reasonList.find(option => option.name === e.value);
                                        setReasonValue(e.value);
                                        setFormData((prevFormData) => ({
                                            ...prevFormData, // Spread the existing formData
                                            flightTicketReason: {
                                                key: selectedReason.key,
                                                name: selectedReason.name,
                                                // name: e.value.name // Update only the firstName property
                                            }
                                        }));
                                    }} options={reasonList} optionLabel="name" optionValue="name" className="w-full" />
                                </div>
                            </div>
                        )}
                    </div>





                    {/* <button type="submit">Submit</button> */}
                    <div className="gap-3" style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button type="button" className="back-button-draft mb-3" icon={<KeyboardDoubleArrowLeftIcon />} label="Back" rounded onClick={handleBack} />
                        {item.approveStatus?.key === 'draft' &&
                            <Button className="mb-3"
                                // disabled={loading || isEmailValidSubmit}
                                onClick={() => setFormData(prevFormData => ({
                                    ...prevFormData, // Spread the existing formData
                                    status: { code: 2 },
                                    approveStatus: { key: 'draft' }
                                }))}
                                type="submit"
                                label={"Update"}
                            />
                        }
                        <Button className="mb-3" type="button" label="Next" icon={<KeyboardDoubleArrowRightIcon />} rounded
                            onClick={() => {
                                if (validateForm()) {
                                    setErrors({});
                                    setPreviewVisible(true);
                                } else {
                                    showMessage('error', 'Error', `Fill all the required fields`);
                                    return;
                                }
                            }} />
                        <Button className="mb-3"
                            style={{
                                display: 'none'
                            }}
                            ref={updateButtonRef}
                            // disabled={loading || isEmailValidSubmit}
                            type="submit"
                            label={"Submit"}
                        />
                        <div>

                            <Dialog header="Preview" visible={previewVisible} style={{ width: '80vw' }} onHide={() => { if (!previewVisible) return; setPreviewVisible(false); }}>
                                {/* {previewVisible && { NewSummary(formData,itineraries) }} */}
                                <FormPreview item={formData} travelInfo={itineraries} attachments={attachments} />
                                <div className="gap-3 mt-3" style={{ display: 'flex', justifyContent: 'end' }} >
                                    <Button icon={<KeyboardDoubleArrowLeftIcon />} className="mb-3" label="Back" type="button" rounded onClick={() => setPreviewVisible(false)} />
                                    <Button className="mb-3"
                                        disabled={loading} //|| isEmailValidSubmit
                                        onClick={() => {
                                            setPreviewVisible(false);
                                            updateButtonRef.current.click();
                                        }}
                                        type="button"
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

export default EditTravelRequestForm;

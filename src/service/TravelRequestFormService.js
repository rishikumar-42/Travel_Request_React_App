import axios from "axios";
import { Buffer } from 'buffer';
import { useAuth } from "../contexts/AuthContext";

function setAxios() {
    // const username = process.env.REACT_APP_USERNAME;
    // const password = process.env.REACT_APP_PASSWORD;
    // const credentials = `${username}:${password}`;
    // const encodedCred = Buffer.from(credentials, 'latin1').toString('base64');
    // const authHeader = `Basic ${encodedCred}`;
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const authHeader = 'Basic ' + btoa(username + ':' + password);

    axios.defaults.headers.common['Authorization'] = authHeader;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
}


const TravelRequestFormServiceLayer = {
    fetchUsers: async () => {
        try {
            await setAxios();
            const response = await axios.get(`o/c/userlists/`);
            const users = response.data.items || [];
            console.log("Fetched users:", users);
            return users;

        } catch (error) {
            console.error("Error fetching user details", error);
            throw error;
        }
    },

    updateFormData: async (id, formData) => {
        try {
            console.log("update")
            const response = await axios.put(`http://localhost:8080/o/c/travelinfos/${id}`, JSON.stringify(formData));
            console.log("Form update response:", response);
            return response;
        } catch (error) {
            // console.error("Error submitting form", error);
            throw error;
        }
    },
    updatePatchFormData: async (id, patchData) => {
        await setAxios();
        try {
            console.log("patch")
            const response = await axios.patch(`http://localhost:8080/o/c/travelinfos/${id}`, JSON.stringify(patchData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Form update response:", response);
            return response;
        } catch (error) {
            // console.error("Error submitting form", error);
            throw error;
        }
    },

    fetchReasonPicklist: async () => {
        try {
            const response = await axios.get(`o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/${process.env.REACT_APP_API_REASON_PICKLIST}`);
            const reasonList = response.data.listTypeEntries || [];
            console.log("reason list : ", response.data);
            return reasonList;

        } catch (error) {
            console.error("Error fetching reson details", error);
            throw error;
        }
    },
    fetchCurrencyPicklist: async () => {
        try {
            const response = await axios.get(`o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/${process.env.REACT_APP_API_CURRENCY_PICKLIST}`);
            const currencyList = response.data.listTypeEntries || [];
            console.log("currency list : ", response.data);
            return currencyList;
        } catch (error) {
            console.error("Error fetching currency details", error);
            throw error;
        }
    },
    fetchPreferredTimePicklist: async () => {
        try {
            const response = await axios.get(`o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/${process.env.REACT_APP_API_PREFERRED_TIME_PICKLIST}`);
            const prefferedTimeList = response.data.listTypeEntries || [];
            console.log("currency list : ", response.data);
            return prefferedTimeList;
        } catch (error) {
            console.error("Error fetching currency details", error);
            throw error;
        }
    },
    fetchFlightTypePicklist: async () => {
        try {
            const response = await axios.get(`o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/${process.env.REACT_APP_API_FLIGHT_TYPE_PICKLIST}`);
            const reasonList = response.data.listTypeEntries || [];
            console.log("type list : ", response.data);
            return reasonList;

        } catch (error) {
            console.error("Error fetching flight type details", error);
            throw error;
        }
    },
    fetchTrainTicketTypePicklist: async () => {
        try {
            const response = await axios.get(`o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/${process.env.REACT_APP_API_TRAIN_TICKET_PICKLIST}`);
            const reasonList = response.data.listTypeEntries || [];
            console.log("tain ticket type list : ", response.data);
            return reasonList;

        } catch (error) {
            console.error("Error fetching train ticket type details", error);
            throw error;
        }
    },

    // Submit form data to the backend
    submitFormData: async (formData) => {
        try {
            console.log("submittion")
            const response = await axios.post(`http://localhost:8080/o/c/travelinfos/`, JSON.stringify(formData));
            console.log("Form submission response:", response);
            return response;
        } catch (error) {
            // console.error("Error submitting form", error);
            throw error;
        }
    },
    addDocuments: async (file) => {
        try {
            console.log("Adding")
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`http://localhost:8080/o/headless-delivery/v1.0/sites/${process.env.REACT_APP_API_LIFERAY_SITE_ID}/documents`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Form submission response:", response);
            return response.data;
        } catch (error) {
            // console.error("Error submitting form", error);
            throw error;
        }
    },
    deleteDocuments: async (documentId) => {
        try {
            console.log("deleting");
            const response = await axios.delete(`http://localhost:8080/o/headless-delivery/v1.0/documents/${documentId}`);
            console.log("document delete response:", response.status);
            return response.status;
        } catch (error) {
            // console.error("Error submitting form", error);
            throw error;
        }
    },
    fetchCount: async () => {
        try {
            console.log("Counting")
            // const response = await axios.get(`http://localhost:8080/o/c/travelinfos/?fields=totalCount`);
            const response = await axios.get(`http://localhost:8080/o/c/travelinfos/?pageSize=1&sort=travelRequestId:desc`);
            console.log("Fetch count : ", response);
            return response;
        } catch (error) {
            // console.error("Error submitting form", error);
            throw error;
        }
    },

    // submitFormData: async (data) => {
    //     const response = await fetch('o/c/travelinfos/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(data),
    //     });

    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }

    //     return response.json();
    // },
};

export default TravelRequestFormServiceLayer;

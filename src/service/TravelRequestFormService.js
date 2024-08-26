import axios from "axios";
import { Buffer } from 'buffer';

function setAxios() {
    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;
    const credentials = `${username}:${password}`;
    const encodedCred = Buffer.from(credentials, 'latin1').toString('base64');
    const authHeader = `Basic ${encodedCred}`;

    axios.defaults.headers.common['Authorization'] = authHeader;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
}


const TravelRequestFormServiceLayer = {
    fetchUserDetails: async (name) => {
        try {
            const response = await axios.get(`o/c/employee-tables/47185`, {
                params: {
                    filter: `firstName eq '${name}%'`,
                    pageSize: 10,
                },
            });
            const users = response.data.items || [];
            console.log("Fetched users:", users);
            return users;

        } catch (error) {
            console.error("Error fetching user details", error);
            throw error;
        }
    },

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
            console.error("Error submitting form", error);
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

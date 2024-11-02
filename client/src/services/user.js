import axios from "axios";
import { BACKEND_URL } from "../utils/constants";


const registerUser = async ({ name, email, password }) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/user/register`, {
            name,
            email,
            password
        })
        return response;
         
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}

const userData = async (token) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/user/`, {
            headers: {
                Authorization: token
            }
        });

        return response.data;

    } catch (error) {
        throw new Error(error.response.data.message)
    }
}

const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/user/login`, {
            email,
            password
        })

        return response;
        
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}

const logoutUser = async () => {}

const fetchAllUsers = async () => {
    try {
        const token = localStorage.getItem("user-token")
        const response = await axios.get(`${BACKEND_URL}/user/allUser`, {
            headers: {
                "Authorization": token
            }
        })
        return response;
        
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}

const changePassword = async ({ oldPassword, newPassword }) => {
    try {
        const token = localStorage.getItem("user-token")
        const response = await axios.put(`${BACKEND_URL}/user/change-password`, {
            oldPassword,
            newPassword
        }, {
            headers: {
                "Authorization": token
            }
        })
        return response;
        
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}

const updateName = async (name) => {
    try {
        const token = localStorage.getItem("user-token")
        const response = await axios.put(`${BACKEND_URL}/user/update-name`, {
            name
        }, {
            headers: {
                "Authorization": token
            }
        })
        return response;
        
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}

const updateEmail = async ( email ) => {
    try {
        const token = localStorage.getItem("user-token")
        const response = await axios.put(`${BACKEND_URL}/user/update-email`, {
            email
        }, {
            headers: {
                "Authorization": token
            }
        })
        return response;
        
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}


export {
    registerUser,
    loginUser,
    logoutUser,
    fetchAllUsers,
    changePassword,
    updateName,
    updateEmail,
    userData
}
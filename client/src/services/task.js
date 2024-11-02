import axios from "axios";
import { BACKEND_URL } from "../utils/constants";

const getTasks = async (filter) => {
    try {
        const token = localStorage.getItem("user-token");
        const response = await axios.get(`${BACKEND_URL}/tasks/filter-tasks?filter=${filter}`, {
            headers: {
                "Authorization": token
            }
        });
        return response;
    } catch (error) {
        throw new Error(error.response.data.message); 
    }
}

const createTask = async (task) => {
    try {
        const token = localStorage.getItem("user-token");
        const response = await axios.post(`${BACKEND_URL}/tasks/create-task`, {
            ...task}, {
                headers: {
                    "Authorization": token
                }
            })
        return response; 
    } catch (error) {
        throw new Error(error.response.data.message);
    }   
}

const changeTaskStatus = async (status, taskId) => {
    try {
        const token = localStorage.getItem("user-token");
        const response = await axios.post(`${BACKEND_URL}/tasks/update-taskStatus`, {
            status,
            taskId
        }, {
            headers: {
                "Authorization": token
            }
        })
        return response;
        
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

const updateTaskChecklists = async (checklistIndex, taskId) => {
    try {
        const token = localStorage.getItem("user-token");
        const response = await axios.post(`${BACKEND_URL}/tasks/task-checklist`, {
            checklistIndex,
            taskId
        }, {
            headers: {
                "Authorization": token
            }
        })
        return response;
        
    } catch (error) {
        throw new Error(error.response.data.message);
    }
    
}

const editTask = async (task, taskId) => {
    try {
        
        const token = localStorage.getItem("user-token");
        const response = await axios.post(`${BACKEND_URL}/tasks/edit-task/${taskId}`, {
            ...task
        }, {
            headers: {
                "Authorization": token
            }
        })
        return response;
        
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

const deleteTask = async (taskId) => {
    try {
        const token = localStorage.getItem("user-token");
        const response = await axios.delete(`${BACKEND_URL}/tasks/delete-task/${taskId}`, {
            headers: {
                Authorization: token
            }
        })
        return response;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

const getSharedTask = async (taskId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/tasks/shared-task/${taskId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}




export {
    getTasks,
    createTask,
    changeTaskStatus,
    editTask,
    deleteTask,
    getSharedTask,
    updateTaskChecklists
}

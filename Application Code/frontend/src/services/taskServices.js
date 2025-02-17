import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL; 
console.log("API URL:", apiUrl);

export function getTasks() {
    return axios.get(`${apiUrl}/tasks`);
}

export function addTask(task) {
    return axios.post(`${apiUrl}/tasks`, task);
}

export function updateTask(id, task) {
    return axios.put(`${apiUrl}/tasks/${id}`, task);
}

export function deleteTask(id) {
    return axios.delete(`${apiUrl}/tasks/${id}`);
}

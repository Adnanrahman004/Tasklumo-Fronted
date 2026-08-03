import axios from "axios";

const API = "https://tasklumo-backend.vercel.app/api/admin";

const getToken = () => {
  return localStorage.getItem("adminToken");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const adminLogin = (data) => axios.post(`${API}/login`, data);

export const getDashboard = () => axios.get(`${API}/dashboard`, authHeader());

export const getUsers = () => axios.get(`${API}/users`, authHeader());

export const banUser = (uid) =>
  axios.post(`${API}/users/ban`, { uid }, authHeader());

export const unbanUser = (uid) =>
  axios.post(`${API}/users/unban`, { uid }, authHeader());

export const deleteUser = (uid) =>
  axios.post(`${API}/users/delete`, { uid }, authHeader());

export default API;

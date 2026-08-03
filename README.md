import axios from "axios";

const api = axios.create({
baseURL: "https://tasklumo-backend.vercel.app/api",
headers: {
"Content-Type": "application/json",
},
});

export default api;

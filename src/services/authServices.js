import api from "./api";

// Register
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Get Profile
export const getProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post("/user/change-password", passwordData);
  return response.data;
};

export const addPhone = async (phone) => {
  alert("Inside addPhone");

  const response = await api.post("/user/add-phone", {
    phone,
  });

  return response.data;
};

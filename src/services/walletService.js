import api from "./api";

// Wallet
export const getWallet = async () => {
  const res = await api.get("/wallet");
  return res.data;
};

// Bank
export const addBank = async (data) => {
  const res = await api.post("/wallet/bank", data);
  return res.data;
};

// UPI
export const addUpi = async (data) => {
  console.log("Sending to backend:", data);

  const res = await api.post("/wallet/upi", data);

  return res.data;
};

// Withdraw
export const withdrawMoney = async (data) => {
  const res = await api.post("/wallet/withdraw", data);
  return res.data;
};

// Withdraw History
export const getWithdrawHistory = async () => {
  const res = await api.get("/wallet/history");
  return res.data;
};

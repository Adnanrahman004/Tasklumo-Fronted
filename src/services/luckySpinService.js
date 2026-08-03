import axios from "axios";

const API = "http://localhost:5000/api/lucky-spin";

export const spinLuckyWheel = async (token) => {
  const res = await axios.post(
    `${API}/spin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

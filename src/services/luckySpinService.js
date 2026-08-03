import axios from "axios";

const API = "https://tasklumo-backend.vercel.app/api/lucky-spin";

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

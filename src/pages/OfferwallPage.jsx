import { useEffect, useState } from "react";
import { getProfile } from "../services/authServices";

export default function OfferwallPage() {
  const [offerwallUrl, setOfferwallUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const profile = await getProfile();

        const userId = profile?.user?.userId || profile?.userId;

        if (!userId) {
          console.error("User ID not found");
          if (mounted) setLoading(false);
          return;
        }

        const url = `https://www.fastsvr.com/wall/URFTg?subid=${encodeURIComponent(
          userId,
        )}`;

        console.log("Offerwall User ID:", userId);
        console.log("Offerwall URL:", url);

        if (mounted) {
          setOfferwallUrl(url);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        if (mounted) setLoading(false);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  if (!offerwallUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#facc15",
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
        }}
      >
        Loading Offerwall...
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#050505",
        overflow: "hidden",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#050505",
            color: "#facc15",
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
          }}
        >
          Loading tasks...
        </div>
      )}

      <iframe
        src={offerwallUrl}
        title="CPAlead Offerwall"
        onLoad={() => setLoading(false)}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: "none",
          background: "#fff",
        }}
        allow="clipboard-write"
      />
    </div>
  );
}

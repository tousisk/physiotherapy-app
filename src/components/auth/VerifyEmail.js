import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (token && type === "signup") {
        const { error } = await supabase.auth.verifyOtp(token);
        if (error) {
          setMessage("Error verifying email. Please try again.");
        } else {
          setMessage("Email verified successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 2000); // Redirect to login after 2 seconds
        }
      } else {
        setMessage("Invalid verification link.");
      }
    };

    verifyEmail();
  }, [token, type, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;
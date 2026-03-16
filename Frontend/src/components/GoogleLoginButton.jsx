import { useEffect } from "react";
import { useAuth } from "../context/authContext";

export default function GoogleLoginButton() {
  const { handleGoogleLogin } = useAuth();

  useEffect(() => {
    const loadGoogle = () => {
      if (!window.google || !window.google.accounts) {
        console.log("Google script not loaded, retry...");
        return setTimeout(loadGoogle, 500);
      }

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => handleGoogleLogin(response.credential),
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        {
          theme: "outline",
          size: "large",
          width: "350",
        },
      );

      window.google.accounts.id.prompt();
    };

    loadGoogle();
  }, [handleGoogleLogin]);
  return <div id="googleLoginBtn"></div>;
}

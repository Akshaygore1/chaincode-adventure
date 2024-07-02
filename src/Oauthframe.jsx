// OAuthFrame.js

import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const OAuthFrame = ({ url, onSuccess, onFailure }) => {
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.style.width = "600px";
    iframe.style.height = "400px";
    iframe.style.border = "none";

    const handleMessage = (event) => {
      // Check the origin of the message to ensure it's from a trusted source
      if (event.origin !== new URL(url).origin) {
        return;
      }

      if (event.data && event.data.type === "oauth-success") {
        window.removeEventListener("message", handleMessage);
        onSuccess(event.data.cookies);
      } else if (event.data && event.data.type === "oauth-failure") {
        window.removeEventListener("message", handleMessage);
        onFailure();
      }
    };

    window.addEventListener("message", handleMessage);

    document.body.appendChild(iframe);

    return () => {
      document.body.removeChild(iframe);
      window.removeEventListener("message", handleMessage);
    };
  }, [url, onSuccess, onFailure]);

  return null;
};

export default OAuthFrame;

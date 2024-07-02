import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { decodeAllString } from "./utils";

const App = () => {
  const [assignmentData, setAssignmentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [chaincodeData, setChaincodeData] = useState({});
  const [chaincodeSubmitted, setChaincodeSubmitted] = useState(false);
  const [numParts, setNumParts] = useState(null);
  const [disableTimer, setDisableTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [downloadingCount, setDownloadingCount] = useState(0);
  const [decodedString, setDecodedString] = useState(null);

  // Set the cookie when the component mounts
  useEffect(() => {
    const cookieName = "connect.sid";
    const cookieValue =
      "s%3AVpcRlxZdgWDIiXjZ3ZcVWAwcCemTI7ak.LRm5tdRR3juVu6m0auUJFJdRniXXoHypKQPcgnsKYUo";
    const domain = "exam.ankush.wiki";
    const cookieString = `${cookieName}=${encodeURIComponent(
      cookieValue
    )}; domain=${domain}; path=/; expires=Sun, 2 July 2025 14:07:16 GMT; SameSite=None; Secure`;
    console.log("cookieString", cookieString);
    document.cookie = cookieString;
  }, []);

  useEffect(() => {
    if (disableTimer && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setDisableTimer(false);
    }
  }, [disableTimer, timer]);

  const fetchAssignmentAndChaincode = async () => {
    setDownloadingCount(0);
    setAssignmentData(null);
    setChaincodeData({});
    setErrorMessage(null);

    try {
      const assignmentResponse = await axios.get("/api/assignments", {
        withCredentials: true,
      });
      console.log("assignmentResponse", assignmentResponse);
      setAssignmentData(assignmentResponse.data);

      const numParts = assignmentResponse.data.numParts;
      setNumParts(numParts);
      setDisableTimer(true);
      setTimer(180); // Set timer for 3 minutes (180 seconds)
    } catch (error) {
      console.error("Error in API call sequence:", error);
      setErrorMessage(error?.response?.data?.message);
    }
  };

  const downloadChaincode = async () => {
    if (numParts === null) return;

    try {
      for (let part = 1; part <= numParts; part++) {
        const dataResponse = await axios.get(`/api/data?part=${part}`, {
          withCredentials: true,
        });
        setChaincodeData((prev) => ({
          ...prev,
          [part]: dataResponse.data.data,
        }));
        setDownloadingCount(part);
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }

      setDownloadingCount(0);
      console.log("Chaincode Parts:", chaincodeData);
    } catch (error) {
      console.error("Error in API call sequence:", error);
      setErrorMessage(error?.response?.data?.message);
    }
  };

  const submitChaincode = async (chaincode) => {
    try {
      const response = await axios.post("/api/answers", { chaincode });
      setChaincodeSubmitted(true);
      console.log("response", response);
    } catch (error) {
      console.error("Error submitting chaincode:", error);
      setErrorMessage(error?.response?.data?.message);
    }
  };

  const handleDecodeAllString = (chaincodeData) => {
    const decodedString = decodeAllString(chaincodeData);
    console.log("decodedString", decodedString);
    setDecodedString(decodedString);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center pb-8">
        <h1>The Chaincode Mission</h1>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <button
          className="pixel-button"
          onClick={fetchAssignmentAndChaincode}
          disabled={disableTimer}
        >
          {disableTimer ? `Timer Running (${timer}s)` : "Start Mission"}
        </button>
      </div>
      {assignmentData && (
        <div>
          <div className="flex flex-col text-sm items-center justify-center border-4 border-white border-opacity-50 rounded-lg p-6 bg-black bg-opacity-75">
            <div className="font-bold mb-4">
              Number of parts: {assignmentData.numParts}
            </div>
            <div className="msg">{assignmentData.message}</div>
          </div>
          <button className="pixel-button" onClick={downloadChaincode}>
            Download Chaincode
          </button>
        </div>
      )}
      {errorMessage && <div>Error: {errorMessage}</div>}
      {downloadingCount > 0 && (
        <div className="flex flex-col text-sm items-center justify-center border-4 border-white border-opacity-50 rounded-lg p-6 bg-black bg-opacity-75">
          <div className="font-bold mb-4">
            Downloaded {downloadingCount} of {numParts} parts
          </div>
          <div className="msg">Please wait...</div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 p-4">
        {Object.entries(chaincodeData).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col mb-4 p-4 border border-gray-300 rounded-lg bg-black-100"
          >
            <div className="font-mono text-sm text-blue-600">Part {key}</div>
            <div className="flex flex-row text-sm">
              <div className="mr-4 p-2 rounded-md">
                <span className="font-bold">Morse Code:</span> {value.join(" ")}
              </div>
            </div>
          </div>
        ))}
      </div>
      {Object.keys(chaincodeData).length > 0 && (
        <button
          className="pixel-button"
          onClick={() => handleDecodeAllString(chaincodeData)}
        >
          Decode Chaincode
        </button>
      )}
      {decodedString && <div>Decoded String: {decodedString}</div>}
      {Object.keys(chaincodeData).length > 0 && (
        <div>
          <h2>Submit Chaincode</h2>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              width: "100%",
              border: "1px solid black",
              color: "black",
              padding: "5px",
            }}
          />
          <button
            className="pixel-button"
            onClick={() => submitChaincode(inputValue)}
          >
            Submit Chaincode
          </button>
        </div>
      )}
      {chaincodeSubmitted && <div>Chaincode Submitted Successfully</div>}
    </div>
  );
};

export default App;

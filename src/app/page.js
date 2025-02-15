"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const HomePage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

    const fetchdata = async () => {
    try {
      const response = await fetch("/api/control", {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error("Failed to fetch LED status");
      }
      const Data = await response.json();
      setData(Data); // Update to use LED_Status from response
      console.log("data:", Data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };
  
  const handleUpdateS = async (id, value) => {
    try {
      const response = await fetch("/api/control", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: value }),
      });
    fetchdata();


      if (!response.ok) {
        throw new Error("Failed to update state");
      }

    } catch (error) {
      console.error("Error updating state:", error);
      setError(error);
    }
  };

  const handleUpdateM = async (id, value) => {
    try {
      const response = await fetch("/api/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: value }),
      });
      fetchdata();

      if (!response.ok) {
        throw new Error("Failed to update mode");
      }

    } catch (error) {
      console.error("Error updating mode:", error);
      setError(error);
    }
  };


  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Sensor Dashboard</h1>
      <div className="row">
        <div className="col-md-4 mb-4 d-flex">
          {/* Card for Ultrasonic & LED Ultrasonic */}
          <div className="card flex-fill" style={{ backgroundColor: '#ffcc00', color: '#000' }}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title border border-dark p-2 rounded">State & Mode</h5>
              <p className="card-text">
                <strong>State:</strong> {data[0]?.state || 'Loading...'}
              </p>
              <p className="card-text">
                <strong>Mode:</strong> {data[0]?.mode || 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4 d-flex">
          {/* Card for LED Status & Controls */}
          <div className="card flex-fill" style={{ backgroundColor: '#ffcc00', color: '#000' }}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title border border-dark p-2 rounded">State Controls</h5>
              
              <div className="d-flex gap-3 mt-auto">
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdateS(data[0]?.id, 0)}
                >
                  0
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdateS(data[0]?.id, 1)}
                >
                  1
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4 d-flex">
          {/* Card for LED Status & Controls */}
          <div className="card flex-fill" style={{ backgroundColor: '#ffcc00', color: '#000' }}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title border border-dark p-2 rounded">Mode Controls</h5>
              
              <div className="d-flex gap-3 mt-auto">
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdateM(data[0]?.id, "auto")}
                >
                  auto
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdateM(data[0]?.id, "manual")}
                >
                  manual
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
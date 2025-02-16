'use client'; // Add this line to make this a client component

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./globals.css";  // Make sure your CSS is imported

const HomePage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // ล็อกการเลื่อนเมื่อหน้าเว็บโหลด
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // ป้องกันการเลื่อน
    return () => {
      document.body.style.overflow = ''; // รีเซ็ตการเลื่อนเมื่อออกจากหน้า
    };
  }, []);

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

      if (!response.ok) {
        throw new Error("Failed to update state");
      }

      await handleUpdateM(id, "manual");  // เปลี่ยนโหมดเป็น manual
      fetchdata();  // รีเฟรชข้อมูล
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

  // ฟังก์ชันเพื่อจัดการสีของสถานะต่างๆ
  const getStatusColor = () => {
    const { state, mode } = data[0] || {};
    if (mode === "auto") return "bg-primary";
    return state === "1" ? "bg-success" : "bg-danger";
  };

  return (
    <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="col-md-5 d-flex flex-column p-4 rounded shadow-lg" style={{ backgroundColor: '#f8f9fa' }}>
        
        <h1 className="text-center mb-4 text-primary">Water Pump Dashboard</h1>

        {/* แถบสีสถานะ (แสดงแค่แถบสีสถานะเดียว) */}
        <div className={`p-2 mb-3 text-white ${getStatusColor()}`} style={{ height: '30px', borderRadius: '5px' }}></div>

        {/* กล่องควบคุมสถานะและโหมดในกล่องเดียวกัน */}
        {/* กล่องควบคุมสถานะ */}
        <div className="card mb-3 border-0">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-center mb-3" style={{ fontSize: '1.25rem' }}>Power Control</h5>
            <div className="d-flex gap-4 justify-content-center mt-auto">
              <button
                className="btn btn-danger btn-lg w-100"
                onClick={() => handleUpdateS(data[0]?.id, 0)} // ปิดปั๊ม
              >
                OFF
              </button>
              <button
                className="btn btn-success btn-lg w-100"
                onClick={() => handleUpdateS(data[0]?.id, 1)} // เปิดปั๊ม
              >
                ON
              </button>
            </div>
          </div>
        </div>

        {/* กล่องควบคุมโหมด */}
        <div className="card border-0">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-center mb-3" style={{ fontSize: '1.25rem' }}>Mode Control</h5>
            <div className="d-flex gap-4 justify-content-center mt-auto">
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={() => handleUpdateM(data[0]?.id, "auto")} // โหมด AUTO
              >
                AUTO
              </button>
              <button
                className="btn btn-warning btn-lg w-100"
                onClick={() => handleUpdateM(data[0]?.id, "manual")} // โหมด MANUAL
              >
                MANUAL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

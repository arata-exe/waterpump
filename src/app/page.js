'use client'; // Add this line to make this a client component

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./globals.css"; // Make sure your CSS is imported

const HomePage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // สถานะโหมด Dark หรือ Light

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // ป้องกันการเลื่อน

    // เปลี่ยนสีพื้นหลังตามโหมด
    if (isDarkMode) {
      document.body.style.backgroundColor = '#333'; // สีพื้นหลัง Dark Mode
      document.body.style.color = '#fff'; // สีข้อความในโหมด Dark
    } else {
      document.body.style.backgroundColor = '#f0f0f0'; // สีพื้นหลัง Light Mode
      document.body.style.color = '#000'; // สีข้อความในโหมด Light
    }

    return () => {
      document.body.style.overflow = ''; // รีเซ็ตการเลื่อน
      document.body.style.backgroundColor = ''; // รีเซ็ตสีพื้นหลังเมื่อออกจากหน้า
      document.body.style.color = ''; // รีเซ็ตสีข้อความ
    };
  }, [isDarkMode]);

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

  const getStatusColor = () => {
    const { state, mode } = data[0] || {};
    if (mode === "auto") return "bg-primary";
    return state === "1" ? "bg-success" : "bg-danger";
  };

  return (
    <div className="container mt-4 d-flex justify-content-center align-items-start" style={{ minHeight: '100vh' }}>
      <div className="col-md-5 d-flex flex-column p-4 rounded shadow-lg" style={{ backgroundColor: isDarkMode ? '#444' : '#f8f9fa', marginTop: '30px' }}>
        <h1 className="text-center mb-4 text-primary">Water Pump Dashboard</h1>

        {/* แถบสีสถานะ (แสดงแค่แถบสีสถานะเดียว) */}
        <div className={`p-2 mb-3 text-white ${getStatusColor()}`} style={{ height: '30px', borderRadius: '5px' }}></div>

        {/* กล่องควบคุมสถานะและโหมดในกล่องเดียวกัน */}
        <div className="card mb-3 border-0" style={{ backgroundColor: isDarkMode ? '#555' : '#fff' }}>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-center mb-3" style={{ fontSize: '1.25rem', color: isDarkMode ? '#fff' : '#000' }}>Power Control</h5>
            <div className="d-flex gap-4 justify-content-center mt-auto">
              <button
                className={`btn btn-lg w-100 ${isDarkMode ? 'btn-danger' : 'btn-danger'}`}  // ใช้ปุ่มเต็มในทั้งสองโหมด
                onClick={() => handleUpdateS(data[0]?.id, 0)} // ปิดปั๊ม
              >
                OFF
              </button>
              <button
                className={`btn btn-lg w-100 ${isDarkMode ? 'btn-success' : 'btn-success'}`}  // ใช้ปุ่มเต็มในทั้งสองโหมด
                onClick={() => handleUpdateS(data[0]?.id, 1)} // เปิดปั๊ม
              >
                ON
              </button>
            </div>
          </div>
        </div>

        {/* กล่องควบคุมโหมด */}
        <div className="card border-0" style={{ backgroundColor: isDarkMode ? '#555' : '#fff' }}>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-center mb-3" style={{ fontSize: '1.25rem', color: isDarkMode ? '#fff' : '#000' }}>Mode Control</h5>
            <div className="d-flex gap-4 justify-content-center mt-auto">
              <button
                className={`btn btn-lg w-100 ${isDarkMode ? 'btn-primary' : 'btn-primary'}`}  // ใช้ปุ่มเต็มในทั้งสองโหมด
                onClick={() => handleUpdateM(data[0]?.id, "auto")} // โหมด AUTO
              >
                AUTO
              </button>
              <button
                className={`btn btn-lg w-100 ${isDarkMode ? 'btn-warning' : 'btn-warning'}`}  // ใช้ปุ่มเต็มในทั้งสองโหมด
                onClick={() => handleUpdateM(data[0]?.id, "manual")} // โหมด MANUAL
              >
                MANUAL
              </button>
            </div>
          </div>
        </div>

        {/* ปุ่มสลับโหมด Dark/Light */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => setIsDarkMode(!isDarkMode)} // สลับโหมด
          >
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

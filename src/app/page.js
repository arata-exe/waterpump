"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("manual");
  const [pumpStatus, setPumpStatus] = useState(0);
  const [isPumpRunning, setIsPumpRunning] = useState(false);  // สถานะการทำงานของปั๊ม
  const [activeButton, setActiveButton] = useState(""); // สถานะของปุ่มที่ถูกกด

  const handleControl = async (action, button) => {
    try {
      const res = await fetch(`http://192.168.1.127/${action}`);
      if (!res.ok) {
        throw new Error(`HTTP Error! Status: ${res.status}`);
      }
      const data = await res.json();
      setMode(data.mode);
      setPumpStatus(data.pump_status);
      setIsPumpRunning(data.pump_status === 1);  // อัพเดตสถานะการทำงานของปั๊ม

      // ตั้งค่าปุ่มที่ถูกกด
      setActiveButton(button);
    } catch (error) {
      console.error("Error connecting to Pico W:", error);
      alert(`Failed to connect to Pico W: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Water Pump Control</h1>
      <p style={styles.text}>Current Mode: <b>{mode}</b></p>
      <p style={styles.text}>Pump Status: <b>{pumpStatus === 1 ? "ON" : "OFF"}</b></p>
      
      <div style={styles.buttonContainer}>
        <button 
          onClick={() => handleControl("manual/on", "on")} 
          style={activeButton === "on" ? { ...styles.button, backgroundColor: "#388E3C" } : { ...styles.button, backgroundColor: "#4CAF50" }}
        >
          Turn On
        </button>
        <button 
          onClick={() => handleControl("manual/off", "off")} 
          style={activeButton === "off" ? { ...styles.button, backgroundColor: "#d32f2f" } : { ...styles.button, backgroundColor: "#F44336" }}  // เพิ่มสีแดงเข้ม
        >
          Turn Off
        </button>
      </div>

      <div style={styles.autoContainer}>
        <div style={styles.autoWithStatus}>
          <button 
            onClick={() => handleControl("set/auto", "auto")} 
            style={activeButton === "auto" ? { ...styles.autoButton, backgroundColor: "#ff9800" } : { ...styles.autoButton, backgroundColor: "#4CAF50" }}
          >
            Auto Mode
          </button>
          <div style={{ ...styles.statusBar, backgroundColor: isPumpRunning ? "#4CAF50" : "#f44336" }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "60px",  // เพิ่มพื้นที่ padding เพื่อให้หน้าดูใหญ่ขึ้น
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "15px",  // ขอบมนที่ใหญ่ขึ้น
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",  // เพิ่มเงาเพื่อให้หน้าดูเด่นขึ้น
    maxWidth: "700px",     // ขยายความกว้างของ container
    margin: "60px auto",   // เพิ่ม margin ด้านบนและล่างเพื่อให้อยู่กลางหน้า
  },
  header: {
    fontSize: "48px",  // ขยายขนาดตัวอักษรของ Water Pump Control
    color: "#333",
    margin: "20px 0",   // เพิ่มระยะห่างระหว่างข้อความ
  },
  text: {
    fontSize: "28px",  // ขยายขนาดตัวอักษร
    color: "#333",
    margin: "20px 0",   // เพิ่มระยะห่างระหว่างข้อความ
  },
  buttonContainer: {
    marginTop: "40px",
    display: "flex",           // ใช้ flexbox เพื่อให้ปุ่มอยู่ข้างกัน
    justifyContent: "center",  // จัดตำแหน่งปุ่มให้อยู่กลาง
    gap: "20px",               // ลดช่องว่างระหว่างปุ่ม Turn On และ Turn Off
  },
  button: {
    color: "white",
    padding: "25px 50px",      // เพิ่มขนาดของปุ่ม
    fontSize: "22px",          // ขยายขนาดข้อความในปุ่ม
    border: "none",
    borderRadius: "12px",      // ขอบมนที่ใหญ่ขึ้น
    cursor: "pointer",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",  // การเปลี่ยนสีเมื่อ hover
    width: "250px",            // ขยายขนาดของปุ่มให้กว้างขึ้น
  },
  autoContainer: {
    marginTop: "40px",
  },
  autoWithStatus: {
    display: "flex",             // ใช้ flexbox เพื่อให้ปุ่ม Auto อยู่ข้างแทบสถานะ
    justifyContent: "center",    // จัดปุ่มและแทบสถานะให้อยู่ตรงกลาง
    alignItems: "center",        // ให้ทั้งปุ่มและแทบสถานะอยู่ในแนวเดียวกัน             
  },
  autoButton: {
    backgroundColor: "#4CAF50",  // ค่าเริ่มต้นเป็นสีเขียว
    color: "white",
    padding: "25px 50px",        // ขยายขนาดของปุ่ม
    fontSize: "22px",            // ขยายขนาดข้อความในปุ่ม
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    width: "250px",              // ให้ปุ่ม Auto ยาวเท่ากับปุ่ม Turn On/Off
  },
  statusBar: {
    height: "15px",              // เพิ่มความสูงของแทบสถานะ
    borderRadius: "8px",         // ขอบมนที่ใหญ่ขึ้น
    marginLeft: "20px",          // เพิ่มระยะห่างระหว่างปุ่มและแทบ
    width: "250px",              // ขยายขนาดแทบสถานะให้เท่ากับปุ่ม
  },

  // เพิ่ม media queries เพื่อให้รองรับมือถือ
  '@media (max-width: 768px)': {
    container: {
      padding: "20px",  // ลด padding เมื่อบนมือถือ
      margin: "20px",   // ลด margin ด้านบนและล่าง
    },
    header: {
      fontSize: "36px",  // ลดขนาดตัวอักษร
    },
    text: {
      fontSize: "20px",  // ลดขนาดตัวอักษร
    },
    button: {
      fontSize: "18px",  // ลดขนาดข้อความในปุ่ม
      padding: "15px 30px",  // ลดขนาดปุ่ม
      width: "200px",  // ลดขนาดปุ่ม
    },
    autoButton: {
      fontSize: "18px",  // ลดขนาดข้อความในปุ่ม Auto
      padding: "15px 30px",  // ลดขนาดปุ่ม
      width: "200px",  // ลดขนาดปุ่ม
    },
    statusBar: {
      width: "200px",  // ลดขนาดแทบสถานะ
    },

    // ลดขนาดตัวอักษรสำหรับข้อความที่แสดงในโทรศัพท์
    '@media (max-width: 480px)': {
      header: {
        fontSize: "30px",  // ลดขนาดข้อความใน header
      },
      text: {
        fontSize: "16px",  // ลดขนาดข้อความในข้อความ
      },
    },
  },
};

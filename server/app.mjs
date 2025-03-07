import express from "express";
import pool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀🚀");
});

// เพิ่มข้อมูล Assignment
app.post("/assignments", async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // บันทึกข้อมูลลง Database
    const result = await pool.query(
      `INSERT INTO assignments (title, content, category, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [title, content, category]
    );
    
    return res.status(201).json({
      message: "Created assignment successfully",
      assignment: result.rows[0], // ส่งข้อมูลที่ถูกสร้างกลับไป
    });

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ message:"Server could not create assignment because database connection" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

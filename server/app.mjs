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

app.get("/assignments", async (req, res) =>{
  let result
  try {
    const result = await connectionPool.query(`select * from assignmets`) 
} 
catch {
  return res.status (500).json ({
    message : "Server could not read assignment because database connection"
  });
}
return res.status(200).json({
  data: result.rows,
});
});

app.get("assignments/:assignmentId" , async (req, res) =>{
    const assignmentIdFromclient = req.params.assignmentId;
    try {
      const result = await connectionPool.query(
        `
        select * from assignments where assignmet_id=$1
        `,
      [assignmentIdFromclient]);
    if (!result.rows) {
      return res.status(404).json({
        message : "Server could not find a requested assignment"
      });
    }
    }catch {
      return res.status(500).json ({
        message : "Server could not read assignment because database connection"
      });
    }
    return res.status (200).json({
      data : result.rows,
    });
});

app.put("/assignmets/:assignmentId", async (req, res) =>{
  const assignmentIdFromclient = req.params.assignmentId;
  const updatedasssignment = { ...req.query, update_at: new Date()};
  try {
    const result = await connectionPool.query(
      `
      UPDATE assignments
      SET title = $2,
          content = $3,
          category = $4,
          status = $5,
          updated_at $6,
      WHERE assignment_id = $1
      RETURNING *;
      `,
      [
         assignmentIdFromclient,
         updatedasssignment.title,
         updatedasssignment.content,
         updatedasssignment.category,
         updatedasssignment.status,
         updatedasssignment.update_at,
      ]
    );
  if (!result.rows) {
    return res.status (404).json({
      message:"Server could not find a requested assignment to update"
    });
  }
  }catch {
    return res.status(500).json({
      message: "Server could not update assignment because database connection"
    });
  }
  return res.status(200).json({
    message: "Updated assignment sucessfully"
  })
});

app.delete("/assignments/:assignmentId", async (req, res) =>{
  const assignmentIdFromclient = req.params.assignmentId;
  try {
    const result = await connectionPool.query(
      `DELETE FROM assignments WHERE assignment_id = $1`,
      [assignmentIdFromclient]
    );
    if (!result.rows) {
      return res.status(404).json({
         message: "Server could not find a requested assignment to delete" });
    }
  }catch {
    return res.status(500).json({ 
      message: "Server could not delete assignment because database connection" });
  }
  return res.status(200).json({ 
    message: "Deleted assignment sucessfully" })
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

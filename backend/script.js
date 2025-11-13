const app = require("./app");
const userRoutes = require("./routes/user.routes");
const db = require("./database/dbConnect");
const officialRoutes = require("./routes/official.routes");
const adminRoutes = require("./routes/admin.routes");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    console.log("Root endpoint accessed");
    res.send("Welcome to the User Management API");
});

// API endpoints for departments and categories
app.get("/api/departments", (req, res) => {
    db.query('SELECT department_id, Name FROM Department', (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ departments: results });
    });
});

app.get("/api/categories", (req, res) => {
    db.query('SELECT category_id, Name, department_id FROM category', (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ categories: results });
    });
});

app.use("/user", userRoutes);
app.use("/official", officialRoutes);
app.use("/admin", adminRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
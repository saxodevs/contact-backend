const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: ["POST"]

}));
// app.use(bodyParser.json());
app.use(express.json())


app.post('/send-email', async (req, res) => {
    console.log('Request body:', req.body);
    const { name, email, message, subject } = req.body;

    // Use EMAIL_USER as "from" to satisfy Gmail
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: email,   // use your Gmail
            to: process.env.EMAIL_TO,       // your receiving email
            subject: subject || `Message from ${name}`,
            text: `From: ${name} <${email}>\n\n${message}`,
        });
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email.', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).send("Contact backend is running 🚀");
});

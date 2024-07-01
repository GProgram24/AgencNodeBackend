import nodemailer from "nodemailer";

// smtp setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "prabhat@your-agenc.ai",
    pass: process.env.SMTP_KEY
  },
});


// mail sender function
export async function sendMail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            "from": '"AGenC " <prabhat@your-agenc.ai>',
            "to": to,
            "subject": subject,
            "text": "Testing",
            "html": html
        });
        if (info.accepted) {
            return "mailSent";
        } else {
            console.log("Mail info:", info);
            return "mailError";
        }
    } catch (err) {
        console.log("Mail Error:", err);
        return "mailError";
    };
}


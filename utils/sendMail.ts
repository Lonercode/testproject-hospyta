import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// Define the type for the payload that will be passed to the email template
interface MailPayload {
    [key: string]: any; // Define the shape of payload according to your template
}

const sendMail = async (email: string, subject: string, payload: MailPayload, template: string): Promise<void> => {
    try {
        // Create reusable transporter object using the default SMTP transport
        const transporter: Transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Read and compile the email template
        const source: string = fs.readFileSync(path.join(__dirname, template), 'utf8');
        const compiledTemplate = handlebars.compile(source);

        // Define email options
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Throw error to be handled by calling function
    }
};

export default sendMail;

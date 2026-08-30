


const { BrevoClient } = require("@getbrevo/brevo");
const config = require("../config/config");

const client = new BrevoClient({
    apiKey: config.EMAIL_API_KEY
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await client.transactionalEmails.sendTransacEmail({
            sender: {
                email: config.SENDER,
                name: "Bihari Kisan"
            },
            to: [
                {
                    email: to
                }
            ],
            subject: subject,
            htmlContent: html
        });

        console.log("Email sent:", response);

        return response;

    } catch (error) {
        console.log("Email service error:", error);
        throw error;
    }
};

module.exports = sendEmail;

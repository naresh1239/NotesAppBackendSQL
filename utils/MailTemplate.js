const EmailHTML = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
          border-radius: 10px;
        }
        .header {
          background-color: #1e90ff;
          color: white;
          padding: 10px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background-color: white;
          padding: 20px;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #ff4500;
        }
        .footer {
          font-size: 12px;
          color: #777;
          text-align: center;
          margin-top: 20px;
        }
        .footer a {
          color: #1e90ff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Notes.com - OTP Verification</h2>
        </div>
        <div class="content">
          <p>Hi {{User}},</p>

          <p>Your One-Time Password (OTP) is: <span class="otp">{{OTP_CODE}}</span></p>

          <p>Please do not share this code with anyone.</p>
          <p>If you didn’t request this, please ignore this message or contact support.</p>

          <p>Thank you,<br/>
          {{Your Company Name}} Support Team</p>
        </div>
        <div class="footer">
          <p>&copy; {{Year}} {{Your Company Name}}. All Rights Reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

const welcomeHTML = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
          border-radius: 10px;
        }
        .header {
          background-color: #28a745;
          color: white;
          padding: 10px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background-color: white;
          padding: 20px;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .footer {
          font-size: 12px;
          color: #777;
          text-align: center;
          margin-top: 20px;
        }
        .footer a {
          color: #28a745;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to Notes.com 🎉</h2>
        </div>
        <div class="content">
          <p>Hi {{User}},</p>

          <p>We're excited to have you on board! 🚀</p>
          <p>Thank you for signing up with <strong>Notes.com</strong>. You can now save, manage, and organize your personal notes easily and securely.</p>

          <p>If you have any questions or need help getting started, feel free to reach out to our support team anytime.</p>

          <p>Happy note-taking! ✍️<br/>
          — The {{Your Company Name}} Team</p>
        </div>
        <div class="footer">
          <p>&copy; {{Year}} {{Your Company Name}}. All Rights Reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;




module.exports = { EmailHTML, welcomeHTML};

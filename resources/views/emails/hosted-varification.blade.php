<!DOCTYPE html>
<html>
<head>
    <title>Hosted Buyer Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #40033f;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #40033f;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .info-box {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hosted Buyer Verification</h1>
    </div>

    <div class="content">
        <p>Dear {{ $user }},</p>

        <p>Thank you for registering as a Hosted Buyer for our upcoming event. We have received your application and are pleased to inform you that your company, <strong>{{ $visitorCompany }}</strong>, has been selected as a Hosted Buyer.</p>

        <div class="info-box">
            <h3>Your Registration Details:</h3>
            <p><strong>Registration ID:</strong> HB-2024-001</p>
            <p><strong>Company Name:</strong> {{ $visitorCompany }}</p>
            <p><strong>Registration Date:</strong> March 15, 2024</p>
            <p><strong>Event Date:</strong> June 1-5, 2024</p>
        </div>

        <p>As a Hosted Buyer, you are entitled to the following benefits:</p>
        <ul>
            <li>Complimentary accommodation at our partner hotel</li>
            <li>Airport transfers</li>
            <li>Priority meeting scheduling</li>
            <li>Exclusive networking events</li>
        </ul>

        <p>Next Steps:</p>
        <ol>
            <li>Complete your profile information</li>
            <li>Upload required company documents</li>
            <li>Schedule your preferred meeting times</li>
        </ol>

        <div style="text-align: center;">
            <a href="#" class="button">Complete Your Profile</a>
        </div>

        <p>If you have any questions or need assistance, please don't hesitate to contact our support team at support@example.com.</p>

        <p>Best regards,<br>Event Management Team</p>
    </div>

    <div class="footer">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>© 2024 Event Management System. All rights reserved.</p>
    </div>
</body>
</html>

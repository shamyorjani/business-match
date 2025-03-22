<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meeting Approval</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header {
            background-color: #9c0c40;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
        }
        .meeting-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Meeting Approval Notification</h2>
        </div>
        <div class="content">
            <p>Dear {{ $userName }},</p>

            <p>We're pleased to inform you that your meeting request has been approved.</p>

            <div class="meeting-details">
                <h3>Meeting Details:</h3>
                <p><strong>Date:</strong> {{ $date }}</p>
                <p><strong>Time:</strong> {{ $time }}</p>
                <p><strong>Exhibitor:</strong> {{ $exhibitor }}</p>
                <p><strong>Booth Number:</strong> {{ $boothNumber }}</p>
            </div>

            <p>Please arrive at the booth on time. If you need to make any changes to your schedule, please contact us as soon as possible.</p>

            <p>Thank you for your participation!</p>

            <p>Best regards,<br>
            Business Matching Team</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>

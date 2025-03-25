<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meeting Schedule Status Update</title>
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
        .summary {
            background-color: #fff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .meeting-list {
            list-style: none;
            padding: 0;
        }
        .meeting-item {
            background-color: #fff;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
            border-left: 4px solid #40033f;
        }
        .status-approved {
            color: #28a745;
        }
        .status-rejected {
            color: #dc3545;
        }
        .status-pending {
            color: #ffc107;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Meeting Schedule Status Update</h1>
    </div>

    <div class="content">
        <p>Dear {{ $user->name }},</p>

        <p>Here is a summary of your meeting schedules:</p>

        <div class="summary">
            <h3>Meeting Summary</h3>
            <p>Total Meetings: {{ $totalMeetings }}</p>
            <p>Approved: {{ $approvedCount }}</p>
            <p>Rejected: {{ $rejectedCount }}</p>
            <p>Pending: {{ $pendingCount }}</p>
        </div>

        <h3>Meeting Details:</h3>
        <ul class="meeting-list">
            @foreach($schedules as $schedule)
                <li class="meeting-item">
                    <strong>Day {{ $schedule['day'] }}</strong><br>
                    Date: {{ $schedule['date'] }} ({{ $schedule['dayOfWeek'] }})<br>
                    Time: {{ $schedule['time'] }}<br>
                    Exhibitor: {{ $schedule['exhibitor'] }}<br>
                    Booth Number: {{ $schedule['boothNumber'] }}<br>
                    Status: 
                    <span class="status-{{ strtolower($schedule['status'] == 4 ? 'approved' : ($schedule['status'] == 3 ? 'rejected' : 'pending')) }}">
                        {{ $schedule['status'] == 4 ? 'Approved' : ($schedule['status'] == 3 ? 'Rejected' : 'Pending') }}
                    </span>
                </li>
            @endforeach
        </ul>
    </div>

    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>© {{ date('Y') }} Business Matching Team. All rights reserved.</p>
    </div>
</body>
</html> 
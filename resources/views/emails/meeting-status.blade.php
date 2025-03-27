@extends('emails.layouts.main')

@section('title', 'Your Business Meetings on IBE International Beauty Expo 2025 are Confirmed!')
@section('header', 'Your Business Meetings are Confirmed!')

@section('content')
    <div class="email-container">
        <div class="content">
            <p>Dear {{ $user->name }},</p>

            <p>Congratulations! Your Business Meetings on IBE International Beauty Expo 2025. We are excited to welcome you to this prestigious event.</p>

            <div class="meeting-itinerary">
                <div class="section-header">
                    <h2>Meeting Itinerary</h2>
                    <p class="meeting-count">Total Meetings: {{ count($schedules) }}</p>
                </div>

                <div class="meetings-grid">
                    @foreach($schedules as $index => $schedule)
                        <div class="meeting-item">
                            <div class="meeting-header">
                                <span class="meeting-number" style="color:rgb(96, 141, 48);">Meeting {{ $index + 1 }} : </span>
                                <span class="meeting-date">{{ $schedule['date'] }}</span>
                            </div>
                            <div class="meeting-details">
                                <div class="detail-row">
                                    <span class="detail-label">Company Name:</span>
                                    <span class="detail-value">{{ $schedule['exhibitor'] }}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Booth Number:</span>
                                    <span class="detail-value">{{ $schedule['boothNumber'] }}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Meeting Time:</span>
                                    <span class="detail-value">{{ $schedule['time'] }}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Day:</span>
                                    <span class="detail-value">{{ $schedule['dayOfWeek'] }}</span>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="contact-info">
                <p>If you notice any errors or have any questions, feel free to contact us at:</p>
                <p>Phone: +603-2201 5200</p>
                <p>Email: pr@elite.com.my</p>
            </div>

            <p>Thank you for being part of the IBE International Beauty Expo. We look forward to seeing you there!</p>

            <p>Warm regards,<br>IBE Team</p>
        </div>
    </div>

    <style>
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .content {
            color: #333;
            line-height: 1.6;
        }
        .meeting-itinerary {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border: 1px solid #e0e0e0;
        }
        .section-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #40033f;
        }
        .section-header h2 {
            color: #40033f;
            margin: 0;
            font-size: 24px;
        }
        .meeting-count {
            color: #666;
            margin: 5px 0 0;
            font-size: 14px;
        }
        .meetings-grid {
            display: grid;
            gap: 20px;
            margin-top: 20px;
        }
        .meeting-item {
            background-color: white;
            border-radius: 6px;
            padding: 25px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: transform 0.2s ease;
        }
        .meeting-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .meeting-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        .meeting-number {
            color: #40033f;
            font-weight: bold;
            font-size: 16px;
        }
        .meeting-date {
            color: #666;
            font-size: 14px;
        }
        .meeting-details {
            display: grid;
            gap: 12px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
        }
        .detail-label {
            color: #666;
            font-size: 14px;
        }
        .detail-value {
            color: #333;
            font-weight: 500;
        }
        .contact-info {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                padding: 15px;
            }
            .meeting-itinerary {
                padding: 15px;
            }
            .meeting-item {
                padding: 20px;
            }
            .meetings-grid {
                gap: 15px;
            }
            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
        }
    </style>
@endsection 
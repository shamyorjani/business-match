@extends('emails.layouts.main')

@section('title', 'Update on Your Hosted Buyer Program Application at IBE International Beauty Expo 2025')
@section('header', 'Hosted Buyer Program Application Status Update')

@section('content')
    <div class="email-container">
        <div class="content">
            <p>Dear {{ $user }},</p>

            <p>Thank you for your interest in the Hosted Buyer Program at IBE International Beauty Expo 2025. We have carefully reviewed your application.</p>

            <div class="info-box">
                <p>Unfortunately, we are unable to approve your application at this time. We encourage you to:</p>
                <ul>
                    <li>Review your submitted documents</li>
                    <li>Ensure all required information is complete</li>
                    <li>Submit a new application with updated information</li>
                </ul>
            </div>

            <div class="contact-info">
                <p>If you have any questions or need assistance, please feel free to contact us at:</p>
                <p>Phone: +603-2201 5200</p>
                <p>Email: pr@elite.com.my</p>
            </div>

            <p>We appreciate your interest in the IBE International Beauty Expo and hope to see you at the event.</p>

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
        .info-box {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #e0e0e0;
        }
        .info-box ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        .info-box li {
            margin-bottom: 8px;
        }
        .contact-info {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                padding: 15px;
            }
            .info-box, .contact-info {
                padding: 15px;
            }
        }
    </style>
@endsection 
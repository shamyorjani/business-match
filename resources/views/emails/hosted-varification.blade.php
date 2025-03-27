@extends('emails.layouts.main')

@section('title', 'Your Hosted Buyer Program Application at IBE International Beauty Expo 2025 is Approved!')
@section('header', 'Hosted Buyer Program Application Approved!')

@section('content')
    <div class="email-container">
        <div class="content">
            <p>Dear {{ $user }},</p>

            <p>Congratulations! Your Hosted Buyer Program Application has been approved. We are excited to welcome you to this prestigious event.</p>

            <div class="info-box">
                <p>To complete your application and receive your complimentary 3D2N 4-Star hotel stay, kindly click the button below to submit your deposit and business matching schedule:</p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="{{ $paymentLink }}" class="button">Submit your deposit here</a>
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
        .info-box {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #e0e0e0;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #40033f;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #2d022b;
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
            .button {
                display: block;
                text-align: center;
                margin: 15px 0;
            }
        }
    </style>
@endsection

@extends('emails.layouts.main')

@section('title', 'Hosted Buyer Verification')
@section('header', 'Hosted Buyer Verification')

@section('content')
    <p>Dear {{ $user }},</p>

    <div class="success-message">
        <p><strong>Great news!</strong> Your documents have been verified successfully. Your company, <strong>{{ $visitorCompany }}</strong>, has been approved as a Hosted Buyer.</p>
    </div>

    <div class="info-box">
        <h3>Next Steps:</h3>
        <ol>
            <li>Complete your payment process</li>
            <li>Schedule your meetings with exhibitors</li>
            <li>Prepare for the event</li>
        </ol>
    </div>

    <p>To proceed with your registration, please complete the payment process by clicking the button below:</p>

    <div style="text-align: center;">
        <a href="{{ $paymentLink }}" class="button">Proceed to Payment</a>
    </div>

    <p>After completing the payment, you will be able to:</p>
    <ul>
        <li>Schedule meetings with exhibitors</li>
        <li>Access exclusive networking events</li>
        <li>Receive complimentary accommodation details</li>
        <li>Get airport transfer information</li>
    </ul>

    <p>If you have any questions or need assistance, please don't hesitate to contact our support team at support@example.com.</p>

    <p>Best regards,<br>Event Management Team</p>
@endsection

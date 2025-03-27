@extends('emails.layouts.main')

@section('title', 'Hosted Buyer Application Rejected')
@section('header', 'Application Status Update')

@section('content')
    <p>Dear {{ $user }},</p>

    <div class="info-box">
        <p>We regret to inform you that your application for the Hosted Buyer Program has been reviewed and unfortunately, we are unable to approve your application at this time.</p>
    </div>

    <div class="info-box">
        <h3>Next Steps:</h3>
        <p>You may:</p>
        <ol>
            <li>Submit a new application with updated documentation</li>
            <li>Register as a regular visitor</li>
            <li>Contact our support team for more information</li>
        </ol>
    </div>

    <p>If you have any questions or need assistance, please don't hesitate to contact our support team at support@example.com.</p>

    <p>We apologize for any inconvenience this may cause.</p>

    <p>Best regards,<br>Event Management Team</p>
@endsection 
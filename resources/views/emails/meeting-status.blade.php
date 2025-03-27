@extends('emails.layouts.main')

@section('title', 'Meeting Schedule Status Update')
@section('header', 'Meeting Schedule Status Update')

@section('content')
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
@endsection 
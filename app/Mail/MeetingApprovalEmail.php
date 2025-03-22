<?php

namespace App\Mail;

use App\Models\ScheduleMeeting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class MeetingApprovalEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $meeting;
    public $userName = 'Visitor';
    public $date = 'N/A';
    public $time = 'N/A';
    public $exhibitor = 'N/A';
    public $boothNumber = 'N/A';

    /**
     * Create a new message instance.
     */
    public function __construct(ScheduleMeeting $meeting)
    {
        $this->meeting = $meeting;

        // Safely extract meeting data with fallbacks
        try {
            // Load related user if not already loaded
            if (!$meeting->relationLoaded('user') && method_exists($meeting, 'user')) {
                $meeting->load('user');
            }

            $this->userName = $meeting->user->name ?? 'Visitor';
            $this->date = $meeting->date ?? 'N/A';
            $this->time = $meeting->time ?? 'N/A';
            $this->exhibitor = $meeting->exhibitor ?? 'N/A';
            $this->boothNumber = $meeting->booth_number ?? 'N/A';
        } catch (\Exception $e) {
            Log::error("Error preparing meeting approval email data: " . $e->getMessage());
            // Continue with fallback values already set
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Meeting Request Has Been Approved',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Check if the view exists, otherwise use a fallback
        $viewName = 'emails.meeting-approval';
        if (!View::exists($viewName)) {
            Log::warning("Email template {$viewName} not found, using fallback");
            $viewName = 'emails.fallback';

            // If fallback doesn't exist either, create it on the fly
            if (!View::exists($viewName)) {
                $fallbackTemplate = resource_path('views/emails/fallback.blade.php');
                $fallbackDir = resource_path('views/emails');

                // Create directory if it doesn't exist
                if (!file_exists($fallbackDir)) {
                    mkdir($fallbackDir, 0755, true);
                }

                // Create a simple fallback template
                file_put_contents($fallbackTemplate,
                    '<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">'.
                    '<h2 style="color: #9c0c40;">Meeting Approval Notification</h2>'.
                    '<p>Dear {{ $userName }},</p>'.
                    '<p>Your meeting request has been approved.</p>'.
                    '<div style="background: #f9f9f9; padding: 15px; margin: 15px 0;">'.
                    '<p><strong>Date:</strong> {{ $date }}</p>'.
                    '<p><strong>Time:</strong> {{ $time }}</p>'.
                    '<p><strong>Exhibitor:</strong> {{ $exhibitor }}</p>'.
                    '<p><strong>Booth Number:</strong> {{ $boothNumber }}</p>'.
                    '</div>'.
                    '<p>Best regards,<br>Business Matching Team</p>'.
                    '</div>'
                );
            }
        }

        return new Content(
            view: $viewName,
            with: [
                'userName' => $this->userName,
                'date' => $this->date,
                'time' => $this->time,
                'exhibitor' => $this->exhibitor,
                'boothNumber' => $this->boothNumber,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

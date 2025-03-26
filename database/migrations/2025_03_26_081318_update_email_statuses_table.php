<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\StatusEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the existing table if it exists
        Schema::dropIfExists('email_statuses');

        // Create the table with correct configuration
        Schema::create('email_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('visitor_company_id')->constrained('visitor_company_infos')->onDelete('cascade');
            $table->integer('status')->default(StatusEnum::PENDING->getValue());
            $table->timestamp('email_sent_at')->nullable();
            $table->timestamps();
            
            // Add unique constraint
            $table->unique(['user_id', 'visitor_company_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_statuses');
    }
};

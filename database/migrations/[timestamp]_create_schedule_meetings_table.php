<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedule_meetings', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable(); // No foreign key constraint as requested
            $table->bigInteger('visitor_company_id')->nullable(); // No foreign key constraint as requested
            $table->bigInteger('interest_id')->nullable(); // No foreign key constraint as requested
            $table->string('booth_number')->nullable();
            $table->string('date')->nullable();
            $table->integer('day')->nullable();
            $table->string('day_of_week')->nullable();
            $table->string('exhibitor')->nullable();
            $table->string('time')->nullable();
            $table->tinyInteger('status')->default(2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_meetings');
    }
};

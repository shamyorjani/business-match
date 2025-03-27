<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\StatusEnum;

return new class extends Migration
{
    public function up()
    {
        Schema::create('hotel_bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('visitor_company_id');
            $table->string('name');
            $table->string('passport_number');
            $table->string('email');
            $table->string('phone_number');
            $table->string('additional_name')->nullable();
            $table->string('additional_passport')->nullable();
            $table->string('staying_duration');
            $table->string('room_type');
            $table->string('extra_night')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->tinyInteger('status')->default(StatusEnum::PENDING);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('hotel_bookings');
    }
}; 
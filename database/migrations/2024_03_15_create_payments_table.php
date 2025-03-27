<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\StatusEnum;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hotel_booking_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('visitor_company_id');
            $table->string('order_id')->unique();
            $table->decimal('amount', 10, 2);
            $table->enum('payment_type', ['full', 'deposit']);
            $table->enum('payment_method', ['credit', 'online']);
            $table->tinyInteger('status')->default(StatusEnum::PENDING);
            $table->string('transaction_id')->nullable();
            $table->json('payment_details')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}; 
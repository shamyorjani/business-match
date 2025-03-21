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
        Schema::create('visitor_interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->cascadeOnDelete();
            $table->foreignId('visitor_company_id')->constrained('visitor_company_infos')->cascadeOnDelete();
            $table->foreignId('product_category_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('product_sub_category_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('product_child_category_id')->nullable()->constrained()->cascadeOnDelete();
            $table->tinyInteger('status')->default(1)->comment('0: Inactive, 1: Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_interests');
    }
};

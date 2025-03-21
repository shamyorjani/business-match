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
        if (!Schema::hasTable('exhibitors')) {
            Schema::create('exhibitors', function (Blueprint $table) {
                $table->id();
                $table->string('company_name');
                $table->string('booth_number')->nullable();
                $table->string('region_country')->nullable();
                $table->text('product_profile')->nullable();
                $table->text('description')->nullable();
                $table->string('logo')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exhibitors');
    }
};

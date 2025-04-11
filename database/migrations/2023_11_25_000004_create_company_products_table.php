<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('company_products')) {
            Schema::create('company_products', function (Blueprint $table) {
                $table->id();
                $table->string('company_id');
                $table->string('name');
                $table->text('description')->nullable();
                $table->string('image')->nullable();

                $table->tinyInteger('status')->default(1)->comment('0: Inactive, 1: Active');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_products');
    }
};

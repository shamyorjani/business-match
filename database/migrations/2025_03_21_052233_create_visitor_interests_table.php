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
        if (!Schema::hasTable('visitor_interests')) {
            Schema::create('visitor_interests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('visitor_company_id')->constrained('visitor_company_infos')->cascadeOnDelete();
                $table->json('product_categories')->nullable()->comment('JSON array of category IDs');
                $table->json('product_sub_categories')->nullable()->comment('JSON array of subcategory IDs');
                $table->json('product_child_categories')->nullable()->comment('JSON array of child category IDs');
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
        Schema::dropIfExists('visitor_interests');
    }
};

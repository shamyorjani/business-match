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
        Schema::create('exhibitor_company_infos', function (Blueprint $table) {
            $table->id();
            $table->string('company_id')->unique();
            $table->string('booth_number');
            $table->string('company_name');
            $table->text('description')->nullable();
            $table->string('region_country');
            $table->string('logo')->nullable();
            $table->json('categories')->nullable()->comment('JSON array of category IDs [1, 2, 3]');
            $table->json('sub_categories')->nullable()->comment('JSON array of sub-category IDs [1, 2, 3, 9, 12]');
            $table->json('child_categories')->nullable()->comment('JSON array of child category IDs [1, 2, 3, 9, 12]');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exhibitor_company_infos');
    }
};

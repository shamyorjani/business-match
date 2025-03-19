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
            ;
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

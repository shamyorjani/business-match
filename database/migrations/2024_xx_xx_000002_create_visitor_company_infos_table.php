<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Update to new Laravel migration format (anonymous class)
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('visitor_company_infos')) {
            Schema::create('visitor_company_infos', function (Blueprint $table) {
                $table->id();
                $table->bigInteger('user_id')->nullable();
                $table->string('company_website');
                $table->string('company_phone_number');
                $table->string('address_line_1');
                $table->string('address_line_2')->nullable();
                $table->string('city');
                $table->string('region');
                $table->string('postal_code');
                $table->string('country');
                $table->string('company_document')->nullable();
                $table->timestamps();
            });
        } else if (!Schema::hasColumn('visitor_company_infos', 'registration_id')) {
            Schema::table('visitor_company_infos', function (Blueprint $table) {
                $table->foreignId('registration_id')->nullable()->after('user_id')->constrained('registrations')->cascadeOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('visitor_company_infos', 'registration_id')) {
            Schema::table('visitor_company_infos', function (Blueprint $table) {
                $table->dropForeign(['registration_id']);
                $table->dropColumn('registration_id');
            });
        } else {
            Schema::dropIfExists('visitor_company_infos');
        }
    }
};

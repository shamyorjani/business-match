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
                $table->bigInteger('user_id')->nullable();
                $table->bigInteger('visitor_company_id');
                $table->json('product_categories')->nullable()->comment('JSON array of category IDs');
                $table->json('product_sub_categories')->nullable()->comment('JSON array of subcategory IDs');
                $table->json('product_child_categories')->nullable()->comment('JSON array of child category IDs');
                $table->tinyInteger('status')->default(1)->comment('0: Inactive, 1: Active');
                $table->timestamps();
            });
        } else if (!Schema::hasColumn('visitor_interests', 'registration_id')) {
            Schema::table('visitor_interests', function (Blueprint $table) {
                $table->foreignId('registration_id')->nullable()->after('user_id')->constrained('registrations')->cascadeOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('visitor_interests', 'registration_id')) {
            Schema::table('visitor_interests', function (Blueprint $table) {
                $table->dropForeign(['registration_id']);
                $table->dropColumn('registration_id');
            });
        } else {
            Schema::dropIfExists('visitor_interests');
        }
    }
};

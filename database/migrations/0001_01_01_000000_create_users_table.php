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
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password')->nullable(); // Making password nullable for visitors
                $table->string('designation')->nullable();
                $table->string('phone_number')->nullable();
                $table->string('company_name')->nullable();
                $table->string('company_nature')->nullable();
                $table->string('company_size')->nullable();
                $table->string('registration_type')->nullable();
                $table->rememberToken();
                $table->timestamps();
            });
        } else {
            // Add the new columns to the existing users table
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'designation')) {
                    $table->string('designation')->nullable();
                }
                if (!Schema::hasColumn('users', 'phone_number')) {
                    $table->string('phone_number')->nullable();
                }
                if (!Schema::hasColumn('users', 'company_name')) {
                    $table->string('company_name')->nullable();
                }
                if (!Schema::hasColumn('users', 'company_nature')) {
                    $table->string('company_nature')->nullable();
                }
                if (!Schema::hasColumn('users', 'company_size')) {
                    $table->string('company_size')->nullable();
                }
                if (!Schema::hasColumn('users', 'registration_type')) {
                    $table->string('registration_type')->nullable();
                }
            });
        }

        if (!Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We won't drop the users table or other core tables in down() to avoid data loss
        // Instead, we'll only drop the columns we added

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn([
                    'designation',
                    'phone_number',
                    'company_name',
                    'company_nature',
                    'company_size',
                    'registration_type'
                ]);
            });
        }
    }
};

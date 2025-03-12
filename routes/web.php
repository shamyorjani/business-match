<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('layouts.app'); // Ensure this matches the name of your Blade view file
})->where('any', '.*');

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

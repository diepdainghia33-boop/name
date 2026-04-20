<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel OK'
    ]);
});

Route::post('/login', 'App\Http\Controllers\AuthController@login');
Route::post('/register', 'App\Http\Controllers\AuthController@register');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', 'App\Http\Controllers\AuthController@logout');
    Route::get('/me', 'App\Http\Controllers\AuthController@me');
    
    // Profile Updates
    Route::post('/update-profile', 'App\Http\Controllers\AuthController@updateProfile');
    Route::post('/update-password', 'App\Http\Controllers\AuthController@updatePassword');
    
    // Dashboard Routes
    Route::get('/dashboard', 'App\Http\Controllers\DashboardController@getData');
    Route::post('/dashboard/log', 'App\Http\Controllers\DashboardController@addLog');
    
    // Chat Routes
    Route::get('/conversations', 'App\Http\Controllers\ChatController@getConversations');
    Route::get('/conversations/{id}/messages', 'App\Http\Controllers\ChatController@getMessages');
    Route::delete('/conversations/{id}', 'App\Http\Controllers\ChatController@deleteConversation');
    Route::post('/messages/send', 'App\Http\Controllers\ChatController@sendMessage');

    // Settings Routes
    Route::get('/settings', 'App\Http\Controllers\SettingsController@index');
    Route::post('/settings', 'App\Http\Controllers\SettingsController@update');
    Route::post('/settings/export-data', 'App\Http\Controllers\SettingsController@exportData');
    Route::post('/settings/delete-account', 'App\Http\Controllers\SettingsController@deleteAccount');
    Route::post('/settings/clear-cache', 'App\Http\Controllers\SettingsController@clearCache');
});
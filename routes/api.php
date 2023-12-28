<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware(['auth:sanctum']);
Route::post('register', [AuthController::class, 'register']);

Route::apiResource('posts', PostController::class)->middleware('auth:sanctum');
Route::get('get_post', [PostController::class, 'index']);
Route::post('add_comment/{post_id}/{parent_comment_id?}', [CommentController::class, 'store'])->middleware('auth:sanctum');
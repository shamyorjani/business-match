<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductCategoryController extends Controller
{
    public function index()
    {
        Log::info('Fetching product categories');
        $categories = ProductCategory::with('subCategories')->get();
        return response()->json($categories);
    }
}

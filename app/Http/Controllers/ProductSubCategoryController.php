<?php

namespace App\Http\Controllers;

use App\Models\ProductSubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductSubCategoryController extends Controller
{
    public function index($categoryId)
    {
        Log::info("Fetching subcategories for category ID: $categoryId");
        $subCategories = ProductSubCategory::where('product_category_id', $categoryId)->get();
        return response()->json($subCategories);
    }
}

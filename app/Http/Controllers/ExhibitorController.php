<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExhibitorCompanyInfo;
use App\Models\ProductSubCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ExhibitorController extends Controller
{
    /**
     * Search for exhibitors by subcategories
     */
    public function searchBySubcategories(Request $request)
    {
        Log::info('searchBySubcategories');
        try {
            // Validate the request
            $request->validate([
                'subcategories' => 'required|array',
                'subcategories.*' => 'string'
            ]);

            $subcategories = $request->input('subcategories');

            // Log search request for debugging
            Log::info('Searching for subcategories:', ['subcategories' => $subcategories]);

            // Get subcategory IDs from names - using ProductSubCategory model
            $subCategoryIds = ProductSubCategory::whereIn('name', $subcategories)
                ->pluck('id')
                ->toArray();

            Log::info('Found subcategory IDs:', ['ids' => $subCategoryIds]);

            if (empty($subCategoryIds)) {
                Log::info('No matching subcategory IDs found');
                return response()->json([]);
            }

            // Verify the table structure
            try {
                $hasTable = Schema::hasTable('exhibitor_company_infos');
                Log::info('exhibitor_company_infos table exists: ' . ($hasTable ? 'Yes' : 'No'));

                if ($hasTable) {
                    $hasSubCategoriesColumn = Schema::hasColumn('exhibitor_company_infos', 'sub_categories');
                    Log::info('sub_categories column exists: ' . ($hasSubCategoriesColumn ? 'Yes' : 'No'));

                    if (!$hasSubCategoriesColumn) {
                        Log::error('sub_categories column does not exist in exhibitor_company_infos table');
                        return response()->json(['error' => 'Database schema error: missing sub_categories column'], 500);
                    }
                } else {
                    Log::error('exhibitor_company_infos table does not exist');
                    return response()->json(['error' => 'Database schema error: missing exhibitor_company_infos table'], 500);
                }
            } catch (\Exception $e) {
                Log::error('Error checking database schema: ' . $e->getMessage());
            }

            // Get exhibitors with any of these subcategories
            Log::info('Attempting to query exhibitor_company_infos table');

            try {
                // First get all records to reduce complexity
                $allExhibitors = ExhibitorCompanyInfo::whereNotNull('sub_categories')->get();
                Log::info('Retrieved ' . $allExhibitors->count() . ' exhibitors with non-null sub_categories');

                // Debug the first few records
                if ($allExhibitors->count() > 0) {
                    $sample = $allExhibitors->take(2);
                    foreach ($sample as $ex) {
                        Log::info('Sample exhibitor:', [
                            'id' => $ex->id,
                            'name' => $ex->company_name,
                            'sub_categories' => $ex->sub_categories,
                            'type' => gettype($ex->sub_categories)
                        ]);
                    }
                }

                // Now filter the records in memory
                $exhibitors = $allExhibitors->filter(function ($exhibitor) use ($subCategoryIds) {
                    try {
                        Log::info("Processing exhibitor: {$exhibitor->id} - {$exhibitor->company_name}");

                        // Handle the sub_categories field based on its actual type
                        $exhibitorSubCategories = null;

                        if (is_string($exhibitor->sub_categories)) {
                            Log::info("Exhibitor {$exhibitor->id} has string sub_categories: {$exhibitor->sub_categories}");
                            $exhibitorSubCategories = json_decode($exhibitor->sub_categories, true);
                        } elseif (is_array($exhibitor->sub_categories)) {
                            Log::info("Exhibitor {$exhibitor->id} has array sub_categories");
                            $exhibitorSubCategories = $exhibitor->sub_categories;
                        } else {
                            Log::warning("Exhibitor {$exhibitor->id} has " . gettype($exhibitor->sub_categories) . " sub_categories");
                            return false;
                        }

                        // If parsing failed or empty array, skip this exhibitor
                        if (!is_array($exhibitorSubCategories) || empty($exhibitorSubCategories)) {
                            Log::warning("Invalid sub_categories format for exhibitor ID: {$exhibitor->id}");
                            return false;
                        }

                        // Check for intersection between exhibitor's subcategories and requested subcategories
                        $intersection = array_intersect($exhibitorSubCategories, $subCategoryIds);
                        Log::info("Exhibitor {$exhibitor->id} intersection count: " . count($intersection));

                        return count($intersection) > 0;
                    } catch (\Exception $e) {
                        Log::error("Error processing exhibitor {$exhibitor->id}: " . $e->getMessage());
                        return false;
                    }
                })->values(); // Re-index the collection

                Log::info('Found matching exhibitors: ' . $exhibitors->count());
            } catch (\Exception $e) {
                Log::error('Exception during exhibitor filtering: ' . $e->getMessage(), [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]);
                return response()->json(['error' => 'Error filtering exhibitors: ' . $e->getMessage()], 500);
            }

            // Add the product profile to each exhibitor
            foreach ($exhibitors as $exhibitor) {
                try {
                    // Get subcategory names for this exhibitor
                    $exhibitorSubCategoryIds = [];

                    if (is_string($exhibitor->sub_categories)) {
                        $exhibitorSubCategoryIds = json_decode($exhibitor->sub_categories, true) ?: [];
                    } elseif (is_array($exhibitor->sub_categories)) {
                        $exhibitorSubCategoryIds = $exhibitor->sub_categories;
                    }

                    if (!empty($exhibitorSubCategoryIds)) {
                        $subCategoryNames = ProductSubCategory::whereIn('id', $exhibitorSubCategoryIds)
                            ->pluck('name')
                            ->implode(', ');

                        $exhibitor->product_profile = $subCategoryNames ?: 'Various products';
                    } else {
                        $exhibitor->product_profile = 'Various products';
                    }
                } catch (\Exception $e) {
                    Log::error("Error adding product profile for exhibitor {$exhibitor->id}: " . $e->getMessage());
                    $exhibitor->product_profile = 'Various products';
                }
            }

            return response()->json($exhibitors);
        } catch (\Exception $e) {
            Log::error('Exception in searchBySubcategories: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => 'An error occurred while searching exhibitors: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get products for a specific exhibitor
     */
    public function getProducts($exhibitorId)
    {
        try {
            $exhibitor = ExhibitorCompanyInfo::findOrFail($exhibitorId);

            // For this example, we'll generate sample products based on subcategories
            $products = [];

            // Safely decode JSON
            $subCategoryIds = is_string($exhibitor->sub_categories)
                ? json_decode($exhibitor->sub_categories, true)
                : (is_array($exhibitor->sub_categories) ? $exhibitor->sub_categories : []);

            if (empty($subCategoryIds) || !is_array($subCategoryIds)) {
                $subCategoryIds = [];
            }

            $subCategories = ProductSubCategory::whereIn('id', $subCategoryIds)->get();

            foreach ($subCategories as $index => $subCategory) {
                if ($index < 3) { // Limit to 3 sample products
                    $products[] = [
                        'id' => $index + 1,
                        'name' => "{$exhibitor->company_name} {$subCategory->name}",
                        'description' => "Our premium {$subCategory->name} product is designed to meet the highest standards of quality and performance.",
                        'image' => null
                    ];
                }
            }

            // If no subcategories found, fall back to generic products
            if (empty($products)) {
                $products = [
                    [
                        'id' => 1,
                        'name' => "{$exhibitor->company_name} Concealer",
                        'description' => "{$exhibitor->company_name} Concealer is the state of the art concealer, developed in 1982. Its formula contains...",
                        'image' => null,
                    ],
                    [
                        'id' => 2,
                        'name' => "{$exhibitor->company_name} Foundation",
                        'description' => "{$exhibitor->company_name} Foundation provides full coverage with a natural finish, perfect for all skin types.",
                        'image' => null,
                    ],
                    [
                        'id' => 3,
                        'name' => "{$exhibitor->company_name} Highlighter",
                        'description' => "{$exhibitor->company_name} Highlighter gives a natural glow that lasts all day without fading.",
                        'image' => null,
                    ]
                ];
            }

            return response()->json($products);
        } catch (\Exception $e) {
            Log::error('Exception in getProducts: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching products'], 500);
        }
    }
}

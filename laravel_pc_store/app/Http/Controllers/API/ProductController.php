<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('category_id'))
        {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('search'))
        {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        $sortBy = $request->get('sort_by', 'id');
        $sordOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sordOrder);

        $products = $query->paginate(1000000000000);
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'=> 'required|numeric|min:0',
            'category_id' => 'required|exists:categories_id',
            'stock' => 'required|integer|min:0',
            'image_url' => 'nullable|url',
        ]);
        $product = Product::create($validated);
        return new ProductResource($product->load('category'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return new ProductResource($product->load('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description'=> 'nullable|string',
            'price'=> 'sometimes|numeric|min:0',
            'category_id' => 'sometimes|exists:categories_id',
            'stock' => 'sometimes|integer|min:0',
            'image_url' => 'nullable|url',
        ]);
        $product->update($validated);
        return new ProductResource($product->load('category'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json([
            'message'=> 'Товар успешно удален',
        ], 200);
    }
}

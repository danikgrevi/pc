<?php
// app/Exceptions/ProductNotFoundException.php

namespace App\Exceptions;

class ProductNotFoundException extends ApiException
{
    public function __construct($productId)
    {
        parent::__construct(
            'Product not found',
            404,
            'PRODUCT_NOT_FOUND',
            ['product_id' => $productId]
        );
    }
}
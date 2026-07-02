<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Product::class;
    public function definition(): array
    {
        $brands = [
            'Intel','AMD','NVIDIA','ASUS','MSI','Gigabyte','Kingston','Samsung','Corsair','Thermaltake'
        ];
        $productTypes = [
            'Core i7','Core i9','Ryzen 7','Ryzen 9','GeForce RTX','Radeon RX','ROG strix','AORUS','Fury Beast','EVO','Vengeance','RM Series'
        ];
        return [
            'name' => $this->faker->randomElement($brands) . ' '.$this->faker->randomElement($productTypes) . ' ' . $this->faker->randomNumber(4),
            'description' =>$this->faker->paragraph(3),
            'price' => $this->faker->numberBetween(100,9000),
            'category_id' => Category::factory(),
            'stock' => $this->faker->numberBetween(0,100),
            'image_url' => '/images/products/' . $this->faker->word . '.jpg',
        ];
    }
    public function processor(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => $this->faker->randomElement(['Intel','AMD']) . ' ' . 
                $this->faker->randomElement(['Core i7', 'Core i9','Ryzen 7', 'Ryzen 9']) . ' ' . 
                $this->faker->randomNumber(4),
                'price' => $this->faker->numberBetween(500,1400),
            ];
    });
}
    public function graphicsCards(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => $this->faker->randomElement(['NVIDIA','AMD']) . ' ' .
                $this->faker->randomElement(['GeForce RTX','Radeon RX']) . ' ' . 
                $this->faker->randomNumber(4),
                'price'=> $this->faker->numberBetween(1200,3500),
            ];
    });
}
}


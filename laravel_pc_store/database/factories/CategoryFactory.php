<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Category::class;
    public function definition(): array
    {
        static $usedCategories = [];
        $categoryNames = [
            'Процессоры', 'Видеокарты', 'Материнские платы','Оперативная память',
            'SSD накопители','Жесткие диски','Блоки питания','Корпуса','Кулеры',
            'Термопаста','Мониторы','Клавиатуры', 'Мыши', 'Наушники'
        ];
        $availableNames = array_diff($categoryNames, $usedCategories);
        if (empty($availableNames)) {
            $name = $this->faker->unique(true)->word . ' ' . $this->faker->word;
        } else {
            $name = $this->faker->randomElement($availableNames);
            $usedCategories[] = $name;
        }
        
        $slug = Str::slug($name) . '-' . $this->faker->unique(true)->lexify('???');

        return [
            'name'=> $name,
            'slug'=> $slug,
        ];
    }
}

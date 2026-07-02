<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->delete();
        DB::statement('ALTER TABLE categories AUTO_INCREMENT = 1');
        $categories = [
            ['name' => 'Процессоры', 'slug' => 'processors'],
            ['name' => 'Видеокарты', 'slug'=> 'graphics-cards'],
            ['name' => 'Материнские платы', 'slug' => 'motherboards'],
            ['name' => 'Оперативная память', 'slug'=> 'memory'],
            ['name' => 'Накопители', 'slug'=> 'storage'],
            ['name' => 'Блоки питания', 'slug' => 'power-supplies'],
            ['name' => 'Корпуса', 'slug'=> 'cases'],
            ['name' => 'Охлаждение', 'slug'=> 'cooling'],
            ['name' => 'Мониторы', 'slug' => 'monitors'],
        ];
        foreach ($categories as $category) 
        {
            Category::create($category);
        }
    }
}

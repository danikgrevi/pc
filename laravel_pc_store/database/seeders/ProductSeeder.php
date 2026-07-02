<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $products = [
        // Процессоры
        [
            'name' => 'AMD Ryzen 7 5800X',
            'description' => '8-ядерный процессор AM4, 4.7 ГГц, 36 МБ кэш',
            'price' => 789,
            'category_id' => 1,
            'stock' => 15,
            'image_url' => 'cpu/ryzen7-5800x.jpg'
        ],
        [
            'name' => 'Intel Core i5-12400F',
            'description' => '6-ядерный процессор LGA1700, 4.4 ГГц, 18 МБ кэш',
            'price' => 290,
            'category_id' => 1,
            'stock' => 25,
            'image_url' => 'cpu/i5-12400f.jpg'
        ],
        [
            'name' => 'AMD Ryzen 5 5600X',
            'description' => '6-ядерный процессор AM4, 4.6 ГГц, 35 МБ кэш',
            'price' => 250,
            'category_id' => 1,
            'stock' => 18,
            'image_url' => 'cpu/ryzen5-5600x.jpg'
        ],

        // Видеокарты
        [
            'name' => 'NVIDIA GeForce RTX 4070',
            'description' => '12GB GDDR6X, DLSS 3, 5888 ядер',
            'price' => 2560,
            'category_id' => 2,
            'stock' => 8,
            'image_url' => 'gpu/rtx4070.jpg'
        ],
        [
            'name' => 'AMD Radeon RX 7800 XT',
            'description' => '16GB GDDR6, 3840 ядер, HDMI 2.1',
            'price' => 1650,
            'category_id' => 2,
            'stock' => 12,
            'image_url' => 'gpu/rx7800xt.jpg'
        ],
        [
            'name' => 'NVIDIA GeForce RTX 4060 Ti',
            'description' => '8GB GDDR6, DLSS 3, 4352 ядра',
            'price' => 1300,
            'category_id' => 2,
            'stock' => 10,
            'image_url' => 'gpu/rtx4060ti.jpg'
        ],

        // Материнские платы
        [
            'name' => 'ASUS ROG Strix B550-F Gaming',
            'description' => 'AM4, ATX, PCIe 4.0, 2.5G LAN, WiFi 6',
            'price' => 560,
            'category_id' => 3,
            'stock' => 14,
            'image_url' => 'motherboards/b550f.jpg'
        ],
        [
            'name' => 'MSI MAG B760 Tomahawk',
            'description' => 'LGA1700, ATX, DDR5, 2.5G LAN, PCIe 5.0',
            'price' => 600,
            'category_id' => 3,
            'stock' => 9,
            'image_url' => 'motherboards/b760.jpg'
        ],

        // Оперативная память
        [
            'name' => 'Kingston Fury Beast 32GB DDR5',
            'description' => '32GB (2x16GB) 5600MHz CL36, черный радиатор',
            'price' => 178,
            'category_id' => 4,
            'stock' => 30,
            'image_url' => 'ram/fury32.jpg'
        ],
        [
            'name' => 'Corsair Vengeance RGB 16GB DDR4',
            'description' => '16GB (2x8GB) 3200MHz CL16, RGB подсветка',
            'price' => 140,
            'category_id' => 4,
            'stock' => 25,
            'image_url' => 'ram/vengeance16.jpg'
        ],

        // SSD накопители
        [
            'name' => 'Samsung 980 Pro 1TB',
            'description' => 'NVMe PCIe 4.0 M.2, чтение 7000 МБ/с',
            'price' => 130,
            'category_id' => 5,
            'stock' => 20,
            'image_url' => 'ssd/980pro.jpg'
        ],
        [
            'name' => 'WD Blue SN580 1TB',
            'description' => 'NVMe PCIe 4.0 M.2, чтение 4150 МБ/с',
            'price' => 120,
            'category_id' => 5,
            'stock' => 35,
            'image_url' => 'ssd/sn580.jpg'
        ],

        // Блоки питания
        [
            'name' => 'be quiet! Straight Power 11 850W',
            'description' => '850W, 80+ Platinum, модульный, тихий',
            'price' => 240,
            'category_id' => 6,
            'stock' => 12,
            'image_url' => 'psu/straightpower.jpg'
        ],
        [
            'name' => 'Cooler Master MWE Gold 750',
            'description' => '750W, 80+ Gold, модульный, японские конденсаторы',
            'price' => 156,
            'category_id' => 6,
            'stock' => 18,
            'image_url' => 'psu/mwe750.jpg'
        ],

        // Корпуса
        [
            'name' => 'Lian Li Lancool 216',
            'description' => 'Mid-Tower, ARGB вентиляторы, меш-панели',
            'price' => 145,
            'category_id' => 7,
            'stock' => 15,
            'image_url' => 'cases/lancool216.jpg'
        ],
        [
            'name' => 'Fractal Design Pop Air',
            'description' => 'Mid-Tower, RGB, прозрачная боковая панель',
            'price' => 150,
            'category_id' => 7,
            'stock' => 22,
            'image_url' => 'cases/popair.jpg'
        ],

        // Охлаждение
        [
            'name' => 'Noctua NH-D15',
            'description' => 'Башенный кулер, 2 вентилятора, 6 теплотрубок',
            'price' => 201,
            'category_id' => 8,
            'stock' => 8,
            'image_url' => 'cooling/nhd15.jpg'
        ],
        [
            'name' => 'Arctic Liquid Freezer II 360',
            'description' => 'СВО 360mm, ARGB, помпа с VRM охлаждением',
            'price' => 253,
            'category_id' => 8,
            'stock' => 6,
            'image_url' => 'cooling/liquid360.jpg'
        ],

        // Мониторы
        [
            'name' => 'Samsung Odyssey G5 27"',
            'description' => '27" 1440p, 144Hz, VA, Curved, FreeSync',
            'price' => 554,
            'category_id' => 9,
            'stock' => 10,
            'image_url' => 'monitors/g5.jpg'
        ],
        [
            'name' => 'LG 27GP850-B',
            'description' => '27" 1440p, 180Hz, IPS, Nano IPS, G-Sync',
            'price' => 500,
            'category_id' => 9,
            'stock' => 7,
            'image_url' => 'monitors/27gp850.jpg'
        ],
    ];

    foreach ($products as $product) {
       try{ Product::create($product);
        echo "Создан товар: {$product['name']}\n";
    }
    catch (\Exception $e) {
        echo "Ошибка при создании товара {$product['name']}: {$e->getMessage()}\n";
    }
    }
}
}

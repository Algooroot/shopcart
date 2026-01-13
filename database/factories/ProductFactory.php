<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

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
    public function definition(): array
    {
        $sizes = ['XS', 'S', 'M', 'L', 'XL', 'EU38', 'EU39', 'EU40', 'EU41', 'EU42', 'EU43', 'EU44'];
        $colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Brown', 'Pink', 'Orange', 'Purple', 'Navy'];
        
        $productNames = [
            'Nike Jordan Air Rev',
            'Adidas Ultraboost',
            'Puma Speedcat',
            'Converse Chuck Taylor',
            'Vans Old Skool',
            'New Balance 574',
            'Reebok Classic',
            'Air Max 90',
            'Yeezy Boost 350',
            'Jordan 1 Retro',
            'Air Force 1',
            'Dunk Low',
            'Blazer Mid',
            'Cortez Classic',
            'Stan Smith',
            'Superstar',
            'Gazelle',
            'Samba',
            'Forum Low',
            'ZX 750',
            'RS-X',
            'Defy All Day',
            'Cloudfoam',
            'NMD R1',
            'Yung-96',
            'RS-X3',
            'Defy',
            'Aero',
            'Future Rider',
            'Thunder Spectra',
        ];

        $descriptions = [
            'Crossing hardwood comfort with off-court flair. 80s-Inspired construction, bold details and nothin\'-but-net style.',
            'Premium materials meet modern design in this versatile sneaker.',
            'Classic style with contemporary comfort technology.',
            'Iconic design that never goes out of style.',
            'Comfortable and stylish for everyday wear.',
            'Performance-driven design with maximum comfort.',
            'Timeless classic with modern updates.',
            'Bold colors and premium materials.',
            'Street-ready style with athletic performance.',
            'Heritage design meets modern innovation.',
        ];

        // Images e-commerce spécifiques Unsplash - 10 images uniques
        $productImages = [
            'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGUlMjBjb21tZXJjZSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D', // parfum
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGUlMjBjb21tZXJjZSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D', // talon
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGUlMjBjb21tZXJjZSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D', // ecouteur
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZSUyMGNvbW1lcmNlJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D', // basket
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZSUyMGNvbW1lcmNlJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D', // lunette
            'https://images.unsplash.com/photo-1618354691551-44de113f0164?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D', // tshirt
            'https://images.unsplash.com/photo-1547517023-c1afcd607fce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D', // ukelele
            'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D', // iphone
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww', // macbook
            'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww', // laptop
        ];
        
        // Sélection aléatoire d'une image parmi les 10 images e-commerce
        $imageUrl = $productImages[array_rand($productImages)];

        return [
            'name' => fake()->randomElement($productNames),
            'description' => fake()->randomElement($descriptions),
            'price' => fake()->randomFloat(2, 29.99, 299.99),
            'image_url' => $imageUrl,
            'size' => fake()->randomElement($sizes),
            'color' => fake()->randomElement($colors),
            'is_active' => true,
            'stock' => fake()->numberBetween(0, 100),
        ];
    }
}

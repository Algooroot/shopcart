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
        $productNames = [
            'Ukelele',
            'Iphone',
            'Macbook Pro',
            'Laptop',
            'Parfum',
            'Talon',
            'Basket',
            'Lunette',
            'Tshirt',
            'Écouteur',
        ];

        $descriptions = [
            'Beautiful handcrafted ukulele with rich, warm tones perfect for beginners and professionals alike.',
            'Latest generation smartphone with cutting-edge technology and stunning design.',
            'Powerful professional laptop with high-performance processor and stunning display.',
            'Versatile laptop perfect for work, study, and entertainment on the go.',
            'Luxurious fragrance with elegant notes that last throughout the day.',
            'Elegant high-heeled shoes perfect for special occasions and formal events.',
            'Comfortable and stylish sneakers designed for everyday wear and athletic activities.',
            'Modern eyewear with UV protection and contemporary frame design.',
            'Premium quality t-shirt made from soft, breathable fabric for ultimate comfort.',
            'High-quality wireless headphones with superior sound quality and noise cancellation.',
        ];

        // Images e-commerce spécifiques Unsplash - ordre correspondant aux noms de produits
        $productImages = [
            'https://images.unsplash.com/photo-1547517023-c1afcd607fce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D', // ukelele
            'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D', // iphone
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww', // macbook
            'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww', // laptop
            'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGUlMjBjb21tZXJjZSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D', // parfum
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGUlMjBjb21tZXJjZSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D', // talon
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZSUyMGNvbW1lcmNlJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D', // basket
            'https://images.unsplash.com/photo-1618354691551-44de113f0164?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D', // tshirt
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGUlMjBjb21tZXJjZSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D', // écouteur
        ];
        
        // Sélection aléatoire d'une image parmi les 10 images e-commerce
        $imageUrl = $productImages[array_rand($productImages)];

        return [
            'name' => fake()->randomElement($productNames),
            'description' => fake()->randomElement($descriptions),
            'price' => fake()->randomFloat(2, 29.99, 299.99),
            'image_url' => $imageUrl,
            'stock' => fake()->numberBetween(0, 100),
        ];
    }
}

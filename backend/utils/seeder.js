
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Order = require('../models/orderModel');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
mongoose.connect(process.env.MONGODB_URI);

const categories = [
  { name: 'Chocolates', slug: 'chocolates', description: 'Premium handcrafted chocolates', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400' },
  { name: 'Gift Boxes', slug: 'gift-boxes', description: 'Beautifully curated gift boxes', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400' },
  { name: 'Cakes', slug: 'cakes', description: 'Decadent chocolate cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { name: 'Cookies', slug: 'cookies', description: 'Crispy chocolate cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
  { name: 'Festive Hampers', slug: 'festive-hampers', description: 'Special festive hamper collections', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400' },
];

const seedData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });

    await User.create([
      { name: 'Admin User', email: 'admin@chocobits.com', password: 'admin123', role: 'admin' },
      { name: 'Test User', email: 'user@chocobits.com', password: 'user123', role: 'user' },
    ]);

    const products = [
      { name: 'Dark Truffle Collection', slug: 'dark-truffle-collection', description: 'A luxurious selection of handcrafted dark chocolate truffles made with 72% cacao. Each truffle is dusted with fine cocoa powder and infused with exotic flavors.', shortDescription: 'Premium dark chocolate truffles with 72% cacao', price: 899, discountPrice: 749, category: catMap['chocolates'], images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=600', 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600'], stock: 50, weight: '200g', isFeatured: true, tags: ['dark', 'premium', 'truffle'] },
      { name: 'Milk Chocolate Assortment', slug: 'milk-chocolate-assortment', description: 'A delightful mix of creamy milk chocolates with various fillings including hazelnut, caramel, and praline. Perfect for gifting.', shortDescription: 'Creamy milk chocolates with assorted fillings', price: 699, discountPrice: 599, category: catMap['chocolates'], images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600', 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600'], stock: 75, weight: '250g', isFeatured: true, tags: ['milk', 'assorted'] },
      { name: 'White Chocolate Dreams', slug: 'white-chocolate-dreams', description: 'Silky smooth white chocolate bars with hints of vanilla and topped with freeze-dried strawberries. A heavenly treat.', shortDescription: 'Smooth white chocolate with strawberry topping', price: 549, category: catMap['chocolates'], images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600'], stock: 60, weight: '150g', isFeatured: false, tags: ['white', 'vanilla'] },
      { name: 'Luxury Gift Box - Gold', slug: 'luxury-gift-box-gold', description: 'Our signature gold gift box containing 24 handpicked premium chocolates. Elegantly wrapped and perfect for all occasions.', shortDescription: '24-piece premium chocolate gift box', price: 1499, discountPrice: 1299, category: catMap['gift-boxes'], images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600'], stock: 30, weight: '400g', isFeatured: true, tags: ['gift', 'luxury', 'premium'] },
      { name: 'Heart Shape Gift Box', slug: 'heart-shape-gift-box', description: 'A romantic heart-shaped box filled with assorted chocolates. Perfect for anniversaries, Valentine\'s Day, and special celebrations.', shortDescription: 'Romantic heart-shaped chocolate box', price: 1199, category: catMap['gift-boxes'], images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600'], stock: 25, weight: '300g', isFeatured: true, tags: ['gift', 'romantic', 'heart'] },
      { name: 'Triple Chocolate Cake', slug: 'triple-chocolate-cake', description: 'A rich, moist triple chocolate cake with layers of dark, milk, and white chocolate ganache. Decorated with chocolate shavings and cocoa dusting.', shortDescription: 'Three-layer chocolate ganache cake', price: 1899, discountPrice: 1699, category: catMap['cakes'], images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600'], stock: 15, weight: '1kg', isFeatured: true, tags: ['cake', 'birthday', 'celebration'] },
      { name: 'Chocolate Lava Cake', slug: 'chocolate-lava-cake', description: 'Individual molten chocolate lava cakes with a gooey center. Best served warm with vanilla ice cream.', shortDescription: 'Molten center chocolate cake (4 pieces)', price: 799, category: catMap['cakes'], images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600'], stock: 20, weight: '400g', isFeatured: false, tags: ['cake', 'lava', 'dessert'] },
      { name: 'Double Choco Chip Cookies', slug: 'double-choco-chip-cookies', description: 'Thick, chewy cookies loaded with double chocolate chips. Baked fresh with premium Belgian chocolate for maximum flavor.', shortDescription: 'Thick chewy cookies with double chocolate chips', price: 449, discountPrice: 399, category: catMap['cookies'], images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600'], stock: 100, weight: '300g', isFeatured: false, tags: ['cookies', 'choco-chip', 'baked'] },
      { name: 'Brownie Bites Box', slug: 'brownie-bites-box', description: 'A box of 12 fudgy, intensely chocolatey brownie bites. Made with 70% dark chocolate and topped with walnuts.', shortDescription: '12-piece fudgy dark chocolate brownie bites', price: 599, category: catMap['cookies'], images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600'], stock: 80, weight: '350g', isFeatured: false, tags: ['brownie', 'fudgy', 'walnut'] },
      { name: 'Diwali Festive Hamper', slug: 'diwali-festive-hamper', description: 'Celebrate Diwali in the sweetest way with our premium festive hamper. Includes assorted chocolates, dry fruits, and traditional sweets in a decorative box.', shortDescription: 'Premium Diwali celebration hamper', price: 2499, discountPrice: 1999, category: catMap['festive-hampers'], images: ['https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600'], stock: 20, weight: '1.5kg', isFeatured: true, tags: ['diwali', 'festive', 'hamper'] },
      { name: 'Christmas Hamper Deluxe', slug: 'christmas-hamper-deluxe', description: 'Spread holiday cheer with our Christmas Deluxe Hamper. Contains premium chocolates, cookies, fruit cake, and hot cocoa mix in a festive red basket.', shortDescription: 'Deluxe Christmas chocolate hamper', price: 2999, discountPrice: 2499, category: catMap['festive-hampers'], images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600'], stock: 15, weight: '2kg', isFeatured: true, tags: ['christmas', 'festive', 'hamper'] },
      { name: 'Hazelnut Praline Bar', slug: 'hazelnut-praline-bar', description: 'Rich milk chocolate bar filled with crunchy roasted hazelnut praline. A match made in heaven for chocolate and nut lovers.', shortDescription: 'Milk chocolate with hazelnut praline filling', price: 399, category: catMap['chocolates'], images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600'], stock: 90, weight: '100g', isFeatured: false, tags: ['hazelnut', 'praline', 'bar'] },
    ];

    await Product.insertMany(products);
    console.log('✅ Data seeded successfully!');
    console.log('Admin: admin@chocobits.com / admin123');
    console.log('User:  user@chocobits.com  / user123');
    process.exit();
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
};

seedData();

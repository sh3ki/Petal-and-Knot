export type Category = 'Fresh Flowers' | 'Dried & Preserved' | 'Crochet Flowers' | 'Fuzzy-Wire Flowers' | 'Custom Bouquets'
export type Filter = Category | 'All Flowers'

export const collections: { name: Category; description: string; image: string; alt: string; tone: string }[] = [
  { name: 'Fresh Flowers', description: 'Seasonal blooms, thoughtfully arranged for every occasion.', image: '/images/floral-12.jpg', alt: 'Soft blush and cream fresh flower bouquet', tone: 'fresh' },
  { name: 'Dried & Preserved', description: 'Timeless florals made to be cherished for longer.', image: '/images/dried-flowers.jpg', alt: 'Naturally dried flowers and herbs hanging in bunches', tone: 'dried' },
  { name: 'Crochet Flowers', description: 'Hand-stitched flowers that never wilt.', image: '/images/crochet daisy.jpg', alt: 'Purple, pink, and white crochet flowers wrapped in lavender paper', tone: 'crochet' },
  { name: 'Fuzzy-Wire Flowers', description: 'Whimsical blooms shaped by hand, petal by petal.', image: '/images/fuzzy daisy.jpg', alt: 'White fuzzy-wire daisies with yellow centers in a wrapped bouquet', tone: 'fuzzy' },
  { name: 'Custom Bouquets', description: 'A little something made entirely your own.', image: '/images/floral-09.jpg', alt: 'Colorful custom-style mixed floral bouquet', tone: 'custom' },
]

export const products: { name: string; category: Category; price: number; description: string; image: string; alt: string }[] = [
  { name: 'Rosy Romance', category: 'Fresh Flowers', price: 899, description: 'Blush roses and delicate seasonal accents.', image: '/images/floral-12.jpg', alt: 'Blush and cream rose bouquet' },
  { name: 'Sunny Side Up', category: 'Fresh Flowers', price: 699, description: 'A cheerful, sun-kissed floral arrangement.', image: '/images/floral-03.jpg', alt: 'Bright yellow fresh flowers in sunlight' },
  { name: 'Forever Yours', category: 'Dried & Preserved', price: 749, description: 'A lasting bloom in soft, romantic tones.', image: '/images/dried-arrangement.jpg', alt: 'Dried floral arrangement in a warm brown vase' },
  { name: 'Stitched Sweetheart', category: 'Crochet Flowers', price: 499, description: 'A lovingly hand-stitched tulip keepsake.', image: '/images/crochet tulip.jpg', alt: 'Purple and white crochet tulips wrapped in kraft paper' },
  { name: 'Petal Pop', category: 'Fuzzy-Wire Flowers', price: 399, description: 'Playful handmade daisies, made to stay.', image: '/images/fuzzy daisy.jpg', alt: 'Bouquet of white fuzzy-wire daisies with golden centers' },
  { name: 'The Love Note', category: 'Custom Bouquets', price: 1199, description: 'A personal floral gesture, just for them.', image: '/images/floral-09.jpg', alt: 'Mixed rose bouquet in deep romantic colors' },
  { name: 'Daisy Darling', category: 'Crochet Flowers', price: 349, description: 'A sweet little handmade floral hello.', image: '/images/crochet daisy.jpg', alt: 'Pastel crochet flowers with purple daisies and a lilac ribbon' },
  { name: 'Golden Hour', category: 'Dried & Preserved', price: 649, description: 'An everlasting floral moment in warm hues.', image: '/images/dried-flowers.jpg', alt: 'Bundles of dried flowers in natural tones' },
]

export const occasions = [
  { title: 'Birthdays', detail: 'Make their day a little brighter.', image: '/images/floral-01.jpg', alt: 'Pink tulips in a glass vase' },
  { title: 'Anniversaries & Monthsaries', detail: 'Celebrate every chapter of your love.', image: '/images/floral-11.jpg', alt: 'Romantic red rose in bloom' },
  { title: 'Graduations', detail: 'Flowers for every milestone.', image: '/images/floral-03.jpg', alt: 'Golden yellow flowers in sunlight' },
  { title: 'Weddings & Events', detail: 'Beautiful details for unforgettable moments.', image: '/images/floral-13.jpg', alt: 'Floral wedding ceremony arrangement' },
]

export const faqs = [
  ['Can I customize my flower bouquet?', "Absolutely! Tell us your preferred colors, flower type, budget, and occasion, and we'll discuss a design that suits your request."],
  ['Do you sell crochet and fuzzy-wire flowers?', 'Yes! We feature handcrafted crochet and fuzzy-wire arrangements perfect for personalized gifts and lasting keepsakes.'],
  ['Do you offer flowers for weddings and events?', 'We welcome wedding and event floral inquiries. Share your date, location, and design ideas so we can discuss availability.'],
  ['Do you offer delivery around Laguna?', 'Please inquire with your location so we can confirm possible delivery areas, schedules, and fees.'],
  ['How early should I order?', 'Advance inquiries are recommended, especially for custom and handmade bouquets. Preparation times depend on your chosen design.'],
  ['Can I choose my own colors?', "Of course! Share the color palette you have in mind and we'll discuss options."],
]

# Petal & Knot

One-page React + Vite + TypeScript floral boutique concept for Santa Cruz, Laguna. Tailwind CSS, Motion for React, and Lucide are installed; base styles live in `src/index.css`, with the rose-led botanical studio palette and layout in `src/studio.css`. The continuous floral marquee pauses automatically when a visitor prefers reduced motion.

## Run

```sh
npm install
npm run dev
npm run build
```

## Before publishing

- Replace the empty contact destinations in `src/config/business.ts` with **real** business details. `email` enables an email-app handoff; `whatsapp` enables a WhatsApp handoff (international number, e.g. `63...`). Facebook and Instagram links appear only when configured. Until then, validated inquiries offer a copyable summary rather than pretending they were sent.
- Replace sample product names, descriptions, and starting prices in `src/data.ts` with confirmed offerings. Photos are representative editorial imagery, **not** photos of actual Petal & Knot merchandise.
- The crochet and fuzzy-wire sections now use the three supplied handmade-flower photos in `public/images/`. Confirm permission to publish those images, including any visible creator marks, before launching the site.
- The brand story and Santa Cruz location are concept details from the brief, not verified trading history or a street address.

## Image credits

The locally stored `floral-*.jpg` files are editorial images downloaded from [Unsplash](https://unsplash.com/license), with original image URLs listed below. They are not customer or store product photos.

| File | Original image |
| --- | --- |
| `floral-01.jpg` | [Unsplash](https://images.unsplash.com/photo-1561181286-d3fee7d55364) |
| `floral-02.jpg` | [Unsplash](https://images.unsplash.com/photo-1525310072745-f49212b5ac6d) |
| `floral-03.jpg` | [Unsplash](https://images.unsplash.com/photo-1490750967868-88aa4486c946) |
| `floral-09.jpg` | [Unsplash](https://images.unsplash.com/photo-1487530811176-3780de880c2d) |
| `floral-11.jpg` | [Unsplash](https://images.unsplash.com/photo-1562690868-60bbe7293e94) |
| `floral-12.jpg` | [Unsplash](https://images.unsplash.com/photo-1563241527-3004b7be0ffd) |
| `floral-13.jpg` | [Unsplash](https://images.unsplash.com/photo-1523438885200-e635ba2c371e) |

The two dried-flower photographs are from Wikimedia Commons:

- `dried-flowers.jpg`: [Decoration with dried flowers in Martfeld](https://commons.wikimedia.org/wiki/File:Decoration_with_dried_flowers_in_Martfeld.jpg), Anastasiya Lvova, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- `dried-arrangement.jpg`: [Hliak with Bouquet of Dried Flowers and Straw Flowers in Interior of Rajca Manor Museum](https://commons.wikimedia.org/wiki/File:2026.02.27_Hliak_with_Bouquet_of_Dried_Flowers_and_Straw_Flowers_in_Interior_of_Rajca_Manor_Museum.jpg), Tatiana Markina, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

These photographs are displayed with CSS crops; the source files are otherwise unmodified. The SVG logo and favicon were created for this concept.

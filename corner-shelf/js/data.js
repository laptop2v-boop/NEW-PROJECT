/* ------------------------------------------------------------
   Corner Shelf — site settings and product list.
   Everything you are likely to edit lives in this file.
   Pages, grids, filters, galleries and WhatsApp messages are all
   generated from it, so adding a product here is all that is needed.
   ------------------------------------------------------------ */

window.SITE = {
  name: "Corner Shelf",
  currency: "₹",
  locale: "en-IN",

  // Every "ORDER NOW" button opens https://wa.me/<whatsapp>?text=<message>
  whatsapp: "919996939056",      // digits only, with country code
  email: "",                     // optional, shown on the About page if set
  instagram: ""                  // optional full URL, shown on the About page if set
};

/* ADDING A PRODUCT
   Copy one block below, change the values, and keep a comma between blocks.

   id        unique, lowercase, no spaces (used for links)
   name      shown on cards, in the gallery and in the WhatsApp message
   price     a number, no currency symbol (also used in the WhatsApp message)
   category  groups products in the shop filter and on the homepage
   featured  true = eligible for the homepage. The first featured product is the
             large one; the next four fill the "Featured" section. Extra featured
             products are ignored, so the homepage stays short however big the
             catalogue gets. If none are featured, the first products are used.
   images    this product's own photographs. First = card image.
             Put files in /images/products/ and list them here. One photo is fine;
             there is no upper limit. A listed file that does not exist shows a
             clean placeholder instead of a broken image.
   tone      optional placeholder colour while photos are missing

   Product numbers (No. 01, 02 …) are generated automatically from the order here. */
window.PRODUCTS = [
  {
    id: "portable-juicer",
    name: "Portable Juicer",
    price: 490,
    category: "Kitchen",
    featured: true,
    description: "A portable juicer for fresh juice away from the kitchen.",
    images: [
      "images/products/portable1.jpg",
      "images/products/portable2.jpg",
      "images/products/portable3.jpg",
      "images/products/portable4.mp4",
      "images/products/portable5.jpg"
    ],
    tone: "#DCD3C1"
  },
  {
    id: "panda-lamp",
    name: "Panda Lamp",
    price: 275,
    category: "Lighting",
    featured: true,
    description: "A small panda-shaped lamp for a bedside table or a desk.",
    images: [
      "images/products/panda1.jpg",
      "images/products/panda2.jpg",
      "images/products/panda-lamp-3.jpg"
    ],
    tone: "#D3CBBB"
  },
  {
    id: "crystal-lamp",
    name: "Crystal Lamp",
    price: 300,
    category: "Lighting",
    featured: true,
    description: "A crystal lamp that gives a soft, warm light to a room.",
    images: [
      "images/products/crystal-lamp-1.jpg",
      "images/products/crystal-lamp-2.jpg",
      "images/products/crystal-lamp-3.jpg"
    ],
    tone: "#E0D6C4"
  },
  {
    id: "table-plate",
    name: "Table Plate",
    price: 350,
    category: "Tableware",
    featured: true,
    description: "A plate for the table, for serving and for setting out food.",
    images: [
      "images/products/table-plate-1.jpg",
      "images/products/table-plate-2.jpg",
      "images/products/table-plate-3.jpg"
    ],
    tone: "#D9D0BE"
  },
  {
    id: "nfc-keyring",
    name: "NFC Tag Keyring",
    price: 100,
    category: "Accessories",
    featured: true,
    description: "A keyring with an NFC tag. Tap it on a compatible phone to open a link or run an action.",
    images: [
      "images/products/nfc-keyring-1.jpg",
      "images/products/nfc-keyring-2.jpg",
      "images/products/nfc-keyring-3.jpg"
    ],
    tone: "#D6CDBB"
  }
];

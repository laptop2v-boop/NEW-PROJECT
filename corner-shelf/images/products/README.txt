PRODUCT PHOTOGRAPHS GO IN THIS FOLDER
=====================================

Copy your real photos here. Nothing is generated or faked: until a file exists,
the site shows a labelled placeholder for it.

js/data.js currently expects these exact file names (JPG):

  portable-juicer-1.jpg   portable-juicer-2.jpg   portable-juicer-3.jpg
  panda-lamp-1.jpg        panda-lamp-2.jpg        panda-lamp-3.jpg
  crystal-lamp-1.jpg      crystal-lamp-2.jpg      crystal-lamp-3.jpg
  table-plate-1.jpg       table-plate-2.jpg       table-plate-3.jpg
  nfc-keyring-1.jpg       nfc-keyring-2.jpg       nfc-keyring-3.jpg

The "-1" photo of each product is the cover shown on the homepage, the shop and
first in the gallery.

If you have a different number of photos, or use .png / .webp, or other names:
edit that product's  images: [ ... ]  list in js/data.js so each path matches
the real file name exactly. File names are case-sensitive on most web hosts
(Panda-Lamp-1.JPG is not panda-lamp-1.jpg).

Photo shape: every card crops to 4:5 portrait (object-fit: cover), so shoot or
crop portrait with the product centred. Under ~300 KB and ~1200 px on the long
side keeps the shop fast on phones.

To see which files are still missing, from the project folder run:
  node tools/check-images.js

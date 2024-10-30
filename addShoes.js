const mongoose = require("mongoose");
require("dotenv").config();
//test
const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  yearReleased: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
});

const Shoe = mongoose.model("Shoe", shoeSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add shoe data
const shoes = [
  {
    name: "Brooks Ghost 13",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://aplenksave.lt/wp-content/uploads/2021/09/brooks-ghost-14-gtx-mens-running-shoes-black.jpg",
    price: 130,
  },
  {
    name: "ASICS Gel-Kayano 27",
    category: "running",
    yearReleased: 2020,
    imageUrl:
      "https://img.modivo.cloud/product(7/b/b/5/7bb51a66960db404208e3bddb787b34bdc812fdd_0000207043961_01_rz,jpg)/asics-batai-gel-kayano-27-1012a649-juoda.jpg",
    price: 160,
  },
  {
    name: "Saucony Triumph 18",
    category: "running",
    yearReleased: 2020,
    imageUrl:
      "https://www.bfgcdn.com/1500_1500_90/023-0823/saucony-triumph-18-running-shoes.jpg",
    price: 150,
  },
  {
    name: "New Balance Fresh Foam 1080v10",
    category: "running",
    yearReleased: 2020,
    imageUrl:
      "https://www.bigpeachrunningco.com/wp-content/uploads/2020/07/New-Balance-1080v10_A.jpg",
    price: 150,
  },
  {
    name: "Nike ZoomX Vaporfly Next%",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://img.eobuwie.cloud/eob_product_660w_880h(c/c/c/4/ccc417a4605a12e69cdc073499a92f6479641327_22_0196969189709_SW.jpg,webp)/batai-nike-zoomx-vaporfly-next-3-dv4130-002-black-mtlc-gold-grain-black-0000303999476.webp",
    price: 250,
  },
  {
    name: "Hoka One One Clifton 7",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://dms.deckers.com/hoka/image/upload/f_auto,q_auto,dpr_auto/b_rgb:f7f7f9/w_1650/v1648142448/catalog/images/transparent/1110509-AMBN_1.png?_s=RAABAB0",
    price: 130,
  },
  {
    name: "Mizuno Wave Rider 24",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://emea.mizuno.com/dw/image/v2/BDBS_PRD/on/demandware.static/-/Sites-masterCatalog_Mizuno/default/dwd900fec0/SS21/SH_J1GC200342_00.jpg?sw=900&sh=900",
    price: 130,
  },
  {
    name: "Adidas Adizero Adios Pro",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://www.sportpoint.lt/images/uploader/ad/adidas-adizero-adios-pro-3-w.png",
    price: 200,
  },
  {
    name: "On Cloudswift",
    category: "running",
    yearReleased: 2020,
    imageUrl:
      "https://www.bfgcdn.com/1500_1500_90/123-0678-0411/on-womens-cloudswift-running-shoes.jpg",
    price: 150,
  },
  {
    name: "Salomon Speedcross 5",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://lt2.pigugroup.eu/colours/774/886/77/77488677/zygio-batai-moterims-salomon-w-speedcross-5-04251_original.jpg",
    price: 130,
  },
  {
    name: "Nike Air Zoom Pegasus 38",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://sportland.lt/media/catalog/product/cache/a93584b4c19196955ba77379dc459454/C/Z/CZ4178_411_1ccb.jpg",
    price: 120,
  },
  {
    name: "Altra Escalante Racer",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://img.modivo.cloud/product(7/5/4/c/754c04a232c3eb607bd01e1fa345a1912afda717_20_0196573097513_rz.jpg,jpg)/altra-batai-escalante-racer-alm1933b00010-juoda-0000303778606.jpg",
    price: 140,
  },
  {
    name: "ASICS GT-2000 9",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://aplenksave.lt/wp-content/uploads/2020/12/asics-gt-2000-9-mens-running-shoes-black-white-510x510.jpeg",
    price: 120,
  },
  {
    name: "Brooks Adrenaline GTS 21",
    category: "running",
    yearReleased: 2021,
    imageUrl:
      "https://img.eobuwie.cloud/eob_product_512w_512h(5/d/e/0/5de0c8b56867ef66d95df05e53a01c3818d99681_0000209716238_01_ph.jpg,jpg)/batai-brooks-adrenaline-gts-21-110349-1d-438-pilka.jpg",
    price: 130,
  },
  {
    name: "Reebok Floatride Run Fast 3.0",
    category: "running",
    yearReleased: 2021,
    imageUrl: "https://m.media-amazon.com/images/I/61FDMEZx4-S._AC_UY900_.jpg",
    price: 140,
  },
];

Shoe.insertMany(shoes)
  .then(() => {
    console.log("Shoes added successfully");
    mongoose.connection.close();
  })
  .catch((err) => console.error("Error adding shoes:", err));

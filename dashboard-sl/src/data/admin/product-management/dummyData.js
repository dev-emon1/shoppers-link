// ========== IMAGES ==========
import cat1 from "../../../../public/images/category/1.jpg";
import cat2 from "../../../../public/images/category/2.jpg";
import cat3 from "../../../../public/images/category/3.jpg";
import cat4 from "../../../../public/images/category/4.jpg";
import cat5 from "../../../../public/images/category/5.jpg";
import cat6 from "../../../../public/images/category/1.jpg";

import p1 from "../../../../public/images/products/1.webp";
import p2 from "../../../../public/images/products/2.webp";
import p3 from "../../../../public/images/products/3.webp";
import p4 from "../../../../public/images/products/4.webp";
import p5 from "../../../../public/images/products/5.webp";
import p6 from "../../../../public/images/products/6.webp";
import p7 from "../../../../public/images/products/7.webp";
import p8 from "../../../../public/images/products/8.webp";

import aarong from "../../../../public/images/brands/aarong.png";
import apex from "../../../../public/images/brands/apex.png";
import bata from "../../../../public/images/brands/bata.png";
import hatil from "../../../../public/images/brands/hatil.png";
import minister from "../../../../public/images/brands/minister.png";
import otobi from "../../../../public/images/brands/otobi.png";
import richman from "../../../../public/images/brands/richman.png";
import walton from "../../../../public/images/brands/walton.png";
import yellow from "../../../../public/images/brands/yellow.jpg";
import feather from "../../../../public/images/brands/feather_dolls.jpg";

// ==============================
// CATEGORY DATA (Main Hierarchy)
// ==============================
export const categories = [
  {
    id: 1,
    name: "Electronics",
    image: cat1,
    subCount: 6,
    productCount: 125,
    status: "active",
  },
  {
    id: 2,
    name: "Fashion",
    image: cat2,
    subCount: 4,
    productCount: 89,
    status: "active",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    image: cat3,
    subCount: 8,
    productCount: 230,
    status: "active",
  },
  {
    id: 4,
    name: "Beauty & Health",
    image: cat4,
    subCount: 5,
    productCount: 156,
    status: "inactive",
  },
  {
    id: 5,
    name: "Sports & Fitness",
    image: cat5,
    subCount: 3,
    productCount: 78,
    status: "active",
  },
  {
    id: 6,
    name: "Toys & Games",
    image: cat6,
    subCount: 4,
    productCount: 102,
    status: "inactive",
  },
];

// ==============================
// SUBCATEGORIES (Linked by Category)
// ==============================
export const subcategories = [
  {
    id: 1,
    subcategory: "Laptops",
    category: "Electronics",
    categoryImg: cat1,
    totalProducts: 25,
    status: "active",
  },
  {
    id: 2,
    subcategory: "Mobile Phones",
    category: "Electronics",
    categoryImg: cat1,
    totalProducts: 42,
    status: "active",
  },
  {
    id: 3,
    subcategory: "Men’s Shoes",
    category: "Fashion",
    categoryImg: cat2,
    totalProducts: 30,
    status: "active",
  },
  {
    id: 4,
    subcategory: "Women’s Wear",
    category: "Fashion",
    categoryImg: cat2,
    totalProducts: 20,
    status: "active",
  },
  {
    id: 5,
    subcategory: "Kitchen Tools",
    category: "Home & Kitchen",
    categoryImg: cat3,
    totalProducts: 32,
    status: "active",
  },
  {
    id: 6,
    subcategory: "Makeup",
    category: "Beauty & Health",
    categoryImg: cat4,
    totalProducts: 20,
    status: "active",
  },
  {
    id: 7,
    subcategory: "Gym Equipment",
    category: "Sports & Fitness",
    categoryImg: cat5,
    totalProducts: 12,
    status: "inactive",
  },
  {
    id: 8,
    subcategory: "Board Games",
    category: "Toys & Games",
    categoryImg: cat6,
    totalProducts: 15,
    status: "active",
  },
];

// ==============================
// CHILD CATEGORIES (Linked by Subcategory)
// ==============================
export const childCategories = [
  {
    id: 1,
    childCategory: "Gaming Laptops",
    subcategory: "Laptops",
    category: "Electronics",
    totalProducts: 15,
    status: "active",
  },
  {
    id: 2,
    childCategory: "Ultrabooks",
    subcategory: "Laptops",
    category: "Electronics",
    totalProducts: 10,
    status: "active",
  },
  {
    id: 3,
    childCategory: "Android Phones",
    subcategory: "Mobile Phones",
    category: "Electronics",
    totalProducts: 35,
    status: "active",
  },
  {
    id: 4,
    childCategory: "iPhones",
    subcategory: "Mobile Phones",
    category: "Electronics",
    totalProducts: 25,
    status: "inactive",
  },
  {
    id: 5,
    childCategory: "Sneakers",
    subcategory: "Men’s Shoes",
    category: "Fashion",
    totalProducts: 12,
    status: "active",
  },
  {
    id: 6,
    childCategory: "Formal Shoes",
    subcategory: "Men’s Shoes",
    category: "Fashion",
    totalProducts: 8,
    status: "active",
  },
  {
    id: 7,
    childCategory: "Lipsticks",
    subcategory: "Makeup",
    category: "Beauty & Health",
    totalProducts: 20,
    status: "active",
  },
  {
    id: 8,
    childCategory: "Foundation",
    subcategory: "Makeup",
    category: "Beauty & Health",
    totalProducts: 12,
    status: "active",
  },
];

// ==============================
// BRANDS
// ==============================
export const brandData = [
  {
    id: 1,
    name: "Aarong",
    slug: "aarong",
    image: aarong,
    productCount: 12,
    status: "active",
    createdAt: "2024-02-15",
  },
  {
    id: 2,
    name: "Apex",
    slug: "apex",
    image: apex,
    productCount: 15,
    status: "active",
    createdAt: "2024-03-10",
  },
  {
    id: 3,
    name: "Bata",
    slug: "bata",
    image: bata,
    productCount: 10,
    status: "inactive",
    createdAt: "2024-04-20",
  },
  {
    id: 4,
    name: "Hatil",
    slug: "hatil",
    image: hatil,
    productCount: 10,
    status: "active",
    createdAt: "2024-05-02",
  },
  {
    id: 5,
    name: "Richman",
    slug: "richman",
    image: richman,
    productCount: 10,
    status: "active",
    createdAt: "2024-06-14",
  },
  {
    id: 6,
    name: "Otobi",
    slug: "otobi",
    image: otobi,
    productCount: 10,
    status: "inactive",
    createdAt: "2024-07-08",
  },
  {
    id: 7,
    name: "Minister",
    slug: "minister",
    image: minister,
    productCount: 10,
    status: "active",
    createdAt: "2024-08-01",
  },
  {
    id: 8,
    name: "Walton",
    slug: "walton",
    image: walton,
    productCount: 10,
    status: "active",
    createdAt: "2024-09-11",
  },
  {
    id: 9,
    name: "Yellow",
    slug: "yellow",
    image: yellow,
    productCount: 10,
    status: "active",
    createdAt: "2024-10-04",
  },
  {
    id: 10,
    name: "Feather Dolls",
    slug: "feather-dolls",
    image: feather,
    productCount: 10,
    status: "inactive",
    createdAt: "2024-10-20",
  },
];

// ==============================
// PRODUCTS (Linked by All Above)
// ==============================
export const dummyProducts = [
  {
    id: 1,
    image: p1,
    name: "Dell Alienware A17",
    sku: "DL-017",
    category: "Electronics",
    subcategory: "Laptops",
    childCategory: "Gaming Laptops",
    brand: "Dell",
    vendor: "Tech Haven",
    price: 2150,
    discount: 5,
    stock: 120,
    status: "active",
  },
  {
    id: 2,
    image: p2,
    name: "Apple MacBook Pro 16”",
    sku: "MB-001",
    category: "Electronics",
    subcategory: "Laptops",
    childCategory: "Ultrabooks",
    brand: "Apple",
    vendor: "iStore",
    price: 3200,
    discount: 10,
    stock: 42,
    status: "inactive",
  },
  {
    id: 3,
    image: p3,
    name: "Samsung Galaxy S24 Ultra",
    sku: "MB-010",
    category: "Electronics",
    subcategory: "Mobile Phones",
    childCategory: "Android Phones",
    brand: "Samsung",
    vendor: "SmartTech",
    price: 1450,
    discount: 8,
    stock: 50,
    status: "active",
  },
  {
    id: 4,
    image: p4,
    name: "Nike Air Zoom Pegasus",
    sku: "NK-777",
    category: "Fashion",
    subcategory: "Men’s Shoes",
    childCategory: "Sneakers",
    brand: "Nike",
    vendor: "SportZone",
    price: 130,
    discount: 12,
    stock: 240,
    status: "active",
  },
  {
    id: 5,
    image: p5,
    name: "Bata Formal Classic",
    sku: "BT-999",
    category: "Fashion",
    subcategory: "Men’s Shoes",
    childCategory: "Formal Shoes",
    brand: "Bata",
    vendor: "StyleHouse",
    price: 95,
    discount: 5,
    stock: 180,
    status: "inactive",
  },
  {
    id: 6,
    image: p6,
    name: "Walton Smart TV 55”",
    sku: "TV-550",
    category: "Electronics",
    subcategory: "Home Appliances",
    childCategory: "",
    brand: "Walton",
    vendor: "HomePro",
    price: 1150,
    discount: 8,
    stock: 33,
    status: "active",
  },
  {
    id: 7,
    image: p7,
    name: "Richman Cotton Shirt",
    sku: "RC-222",
    category: "Fashion",
    subcategory: "Men’s Wear",
    childCategory: "",
    brand: "Richman",
    vendor: "Fashion World",
    price: 40,
    discount: 0,
    stock: 300,
    status: "active",
  },
  {
    id: 8,
    image: p8,
    name: "Aarong Silk Saree",
    sku: "AR-445",
    category: "Fashion",
    subcategory: "Women’s Wear",
    childCategory: "",
    brand: "Aarong",
    vendor: "Aarong Shop",
    price: 180,
    discount: 15,
    stock: 60,
    status: "active",
  },
];

// ==============================
// Attributes
// ==============================
export const dummyAttributes = [
  {
    _id: "a1",
    name: "Color",
    status: "active",
    values: [
      { _id: "v1", value: "Red", status: "active" },
      { _id: "v2", value: "Blue", status: "active" },
      { _id: "v3", value: "Green", status: "inactive" },
      { _id: "v4", value: "Black", status: "active" },
    ],
  },
  {
    _id: "a2",
    name: "Size",
    status: "active",
    values: [
      { _id: "v5", value: "XS", status: "active" },
      { _id: "v6", value: "S", status: "active" },
      { _id: "v7", value: "M", status: "active" },
      { _id: "v8", value: "L", status: "active" },
      { _id: "v9", value: "XL", status: "inactive" },
    ],
  },
  {
    _id: "a3",
    name: "Material",
    status: "inactive",
    values: [
      { _id: "v10", value: "Cotton", status: "active" },
      { _id: "v11", value: "Polyester", status: "active" },
      { _id: "v12", value: "Leather", status: "inactive" },
    ],
  },
  {
    _id: "a4",
    name: "Brand",
    status: "active",
    values: [
      { _id: "v13", value: "Nike", status: "active" },
      { _id: "v14", value: "Adidas", status: "active" },
      { _id: "v15", value: "Puma", status: "active" },
      { _id: "v16", value: "Reebok", status: "inactive" },
    ],
  },
  {
    _id: "a5",
    name: "Warranty Period",
    status: "active",
    values: [
      { _id: "v17", value: "6 Months", status: "active" },
      { _id: "v18", value: "1 Year", status: "active" },
      { _id: "v19", value: "2 Years", status: "inactive" },
    ],
  },
  {
    _id: "a6",
    name: "Storage Capacity",
    status: "active",
    values: [
      { _id: "v20", value: "64GB", status: "active" },
      { _id: "v21", value: "128GB", status: "active" },
      { _id: "v22", value: "256GB", status: "inactive" },
      { _id: "v23", value: "512GB", status: "active" },
    ],
  },
  {
    _id: "a7",
    name: "Battery Type",
    status: "active",
    values: [
      { _id: "v24", value: "Li-ion", status: "active" },
      { _id: "v25", value: "NiMH", status: "inactive" },
      { _id: "v26", value: "Li-Polymer", status: "active" },
    ],
  },
  {
    _id: "a8",
    name: "Fit Type",
    status: "inactive",
    values: [
      { _id: "v27", value: "Regular Fit", status: "active" },
      { _id: "v28", value: "Slim Fit", status: "active" },
      { _id: "v29", value: "Loose Fit", status: "inactive" },
    ],
  },
];

export interface Company {
  id: string;
  name: string;
  logo: string;
  subCompanies: SubCompany[];
}

export interface SubCompany {
  id: string;
  name: string;
  logo: string;
  description: string;
  products: CompanyProduct[];
}

export interface CompanyProduct {
  id: string;
  name: string;
  pointsRequired: number;
  image: string;
  description: string;
}

export const companiesData: Company[] = [
  {
    id: "lazada",
    name: "Lazada",
    logo: "🛒",
    subCompanies: [
      {
        id: "lazada-fashion",
        name: "Lazada Fashion",
        logo: "👕",
        description: "Trendy fashion items and accessories",
        products: [
          {
            id: "shirt-1",
            name: "Premium Cotton T-Shirt",
            pointsRequired: 500,
            image: "👕",
            description: "High-quality cotton t-shirt"
          },
          {
            id: "jeans-1",
            name: "Designer Jeans",
            pointsRequired: 1200,
            image: "👖",
            description: "Premium designer jeans"
          }
        ]
      },
      {
        id: "lazada-electronics",
        name: "Lazada Electronics",
        logo: "📱",
        description: "Latest gadgets and electronics",
        products: [
          {
            id: "phone-1",
            name: "Smartphone Case",
            pointsRequired: 300,
            image: "📱",
            description: "Protective smartphone case"
          },
          {
            id: "headphones-1",
            name: "Wireless Headphones",
            pointsRequired: 800,
            image: "🎧",
            description: "Premium wireless headphones"
          }
        ]
      },
      {
        id: "lazada-beauty",
        name: "Lazada Beauty",
        logo: "💄",
        description: "Beauty and skincare products",
        products: [
          {
            id: "lipstick-1",
            name: "Premium Lipstick",
            pointsRequired: 250,
            image: "💄",
            description: "Long-lasting premium lipstick"
          }
        ]
      }
    ]
  },
  {
    id: "shopee",
    name: "Shopee",
    logo: "🛍️",
    subCompanies: [
      {
        id: "shopee-home",
        name: "Shopee Home",
        logo: "🏠",
        description: "Home essentials and decor",
        products: [
          {
            id: "pillow-1",
            name: "Memory Foam Pillow",
            pointsRequired: 400,
            image: "🛏️",
            description: "Comfortable memory foam pillow"
          },
          {
            id: "lamp-1",
            name: "LED Desk Lamp",
            pointsRequired: 600,
            image: "💡",
            description: "Energy-efficient LED desk lamp"
          }
        ]
      },
      {
        id: "shopee-food",
        name: "Shopee Food",
        logo: "🍕",
        description: "Food delivery and groceries",
        products: [
          {
            id: "voucher-1",
            name: "Food Delivery Voucher",
            pointsRequired: 200,
            image: "🎫",
            description: "$10 off food delivery"
          },
          {
            id: "grocery-1",
            name: "Grocery Discount",
            pointsRequired: 350,
            image: "🛒",
            description: "15% off grocery shopping"
          }
        ]
      },
      {
        id: "shopee-tech",
        name: "Shopee Tech",
        logo: "💻",
        description: "Technology and gaming products",
        products: [
          {
            id: "mouse-1",
            name: "Gaming Mouse",
            pointsRequired: 700,
            image: "🖱️",
            description: "High-precision gaming mouse"
          }
        ]
      }
    ]
  }
];
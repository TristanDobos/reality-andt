export const listings = [
  {
    title: "Cozy Apartment in Downtown",
    description: "This charming apartment boasts a prime location in the heart of downtown. Featuring a spacious living area, modern kitchen, and comfortable bedroom, it's perfect for urban living.",
    price: 1500,
    location: {
      city: "New York City",
      state: "New York",
      country: "United States",
      zipCode: "10001",
      address: "123 Main Street, Apt 2A"
    },
    propertyType: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 800,
    amenities: [
      "Central Heating",
      "High-Speed Internet",
      "Laundry Facilities"
    ],
    photos: ["photo1.jpg", "photo2.jpg"],
    listedDate: new Date(),
    contactInfo: {
      name: "John Doe",
      phone: "(555) 123-4567",
      email: "john.doe@example.com"
    },
    isAvailable: true
  },
  {
    title: "Luxury Villa with Ocean View",
    description: "Experience luxury living in this stunning villa overlooking the ocean. With elegant interiors, spacious rooms, and breathtaking views, it offers a serene retreat for those seeking tranquility.",
    price: 5000,
    location: {
      city: "Malibu",
      state: "California",
      country: "United States",
      zipCode: "90265",
      address: "456 Ocean Drive"
    },
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 4000,
    amenities: [
      "Infinity Pool",
      "Private Beach Access",
      "Gourmet Kitchen",
      "Home Theater"
    ],
    photos: ["photo3.jpg", "photo4.jpg"],
    listedDate: new Date(),
    contactInfo: {
      name: "Jane Smith",
      phone: "(555) 987-6543",
      email: "jane.smith@example.com"
    },
    isAvailable: true
  }
];


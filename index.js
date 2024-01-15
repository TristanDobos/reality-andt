import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
//For env File 
dotenv.config();

const router = express.Router();

const uri = process.env.MONGO_URL;
const ContactInfoSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
});



const RealityListingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  price: { 
    type: Number, 
    required: true 
  },
  location: {
    city: String,
    state: String,
    country: String,
    zipCode: String,
    address: String
  },
  propertyType: {
    type: String,
    enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Other'],
    required: true
  },
  bedrooms: Number,
  bathrooms: Number,
  squareFeet: Number,
  amenities: [String],
  photos: [String],
  listedDate: { 
    type: Date, 
    default: Date.now 
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});


// const authorSchema = new Schema({
//   name: String,
//   stories: [{ type: Schema.Types.ObjectId, ref: "Story" }],
// });

// const Author = mongoose.model("Author", authorSchema);
// const bob = new Author({ name: "Bob Smith" });

// await bob.save();

// // Bob now exists, so lets create a story
// const story = new Story({
//   title: "Bob goes sledding",
//   author: bob._id, // assign the _id from our author Bob. This ID is created by default!
// });

// await story.save();

const app = express();
const port = process.env.PORT || 8000;
// const seedRealEstates = [
//   {
//     title: "Modern Apartment in New York",
//     description: "A stunning modern apartment with a panoramic city view, fully furnished.",
//     price: 1200000,
//     location: {
//       city: "New York",
//       state: "NY",
//       country: "USA",
//       zipCode: "10001",
//       address: "1234 Broadway Ave"
//     },
//     propertyType: "Apartment",
//     bedrooms: 2,
//     bathrooms: 2,
//     squareFeet: 900,
//     amenities: ["Pool", "Gym", "24h Security"],
//     photos: ["image1.jpg", "image2.jpg"],
//     contactInfo: {
//       name: "John Doe",
//       phone: "123-456-7890",
//       email: "johndoe@example.com"
//     }
//   },
//   {
//     title: "Luxury House in Miami",
//     description: "A beautiful house with 4 bedrooms, a pool and a gym.",
//     price: 2500000,
//     location: {
//       city: "Miami",
//       state: "FL",
//       country: "USA",
//       zipCode: "33101",
//       address: "1234 Lincoln Rd"
//     },
//     propertyType: "House",
//     bedrooms: 4,
//     bathrooms: 5,
//     squareFeet: 3000,
//     amenities: ["Pool", "Gym", "24h Security"],
//     photos: ["image1.jpg", "image2.jpg"],
//     contactInfo: {
//       name: "John Doe",
//       phone: "123-456-7890",
//       email: "johndoe@example.com"
//     }
//   }
// ];


// const ContactInfo = mongoose.model("ContactInfo", ContactInfoSchema);
  
// const newContact = new ContactInfo({
//   name: "Zoltán Dobos",
//   phone: "+421905738632",
//   email: "zoltan@realityaandt.com"
// });

// await newContact.save();

await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// const seedDB = async () => {

//   console.log("DB Seeded");
// };

// seedDB().then(() => {
//   mongoose.connection.close();
// });

router.get('/', async (req, res) => {
  const user = {
    name: 'John',
    lastname: 'Doe',
    email: 'sdfs@sdfsd.com',
  };
    res.json(user);
}
);

// Contact Infos
router.get('/contact-infos', async (req, res) => {
  const ContactInfo = mongoose.model("ContactInfo", ContactInfoSchema);
  const contactInfos = await ContactInfo.find({});

  res.json(contactInfos);
});

export default router;

app.use(cors());

app.use(bodyParser.json());

app.use('/', router);

// Allow requests from all origins (for development purposes)

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
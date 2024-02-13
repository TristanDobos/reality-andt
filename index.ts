import { ContactInfoSchema } from './schemas/contactInfo';
import { AvailabilityState, ListingSchema } from './schemas/listing';
import cors from "cors";
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
var multer = require('multer');
var upload = multer();

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: "reality-at",
  credentials: {
    "type": "service_account",
    "project_id": "reality-at",
    "private_key_id": "cecae6d6eeeb2e649357da91e652531689faa860",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3sWSFObuSEXLu\nPQhkUyY+20EM3nlC41AMnBXAYSqyq82HX7TKzLeDIz5Y5C744hp7K+hkZENLQDmW\nurLbk2OSLg//8jHhBxhCFGENHHKFr6H6bkvcaV0n7n58F6QLgaYgiVfu1PRHKTn6\n4ngB319JyazI21GHo3wr6LeCyTTp+bnMNwzz7EbUJrCrs74ZvEPrIQKqvN4lwrRm\noTT9XMv5orUIZ+JnOPqDp3suVmstvUzEXeb3ZsHV0IH7x3OldziL+RUlTd4+Y6rr\nqs3D5wbE49tpd/ftJmxNk2C05H/x5od9VppyUYuh954mjLvlevZN09IXolqWOogN\npGGrBA2pAgMBAAECggEAI0mk55H0ZkZLV5hqawltJLCOccgwL8kGqPF4HT2dS/cE\nk9+vFbFXhI3p7X4iRuX6k9RWv6hiJAvZtEq3zsYk3+FQ6ghvDA1Gm/UZwsDHAEcB\n3R/Am34zKtdePXz2Is68aO4xcfw/VAdHr9o/Fw7/2WcwdeJp6l5d3XqGfE2mSFcB\nHFUl9DsZWOmqpGtc8Ob59yBKfTrwb2XDKpFqeFoGXYZnmg7X29Z60wSp1dVquAYm\nzM9X8WFp2PAS9V+AHnn6dvgPw/GHqKfEIJgOk4aHq37Hvvzt6Q4G6l7bG9YyDz8z\nSNihPBn9/TJ5RpmarcZ2v89/vvsze5tagEFtoYX+vQKBgQDnVPqdk8EO3lgsXJRK\nCIhpmSjwc5/b7mr9Lsfy+khv9af6Fi+Y/iBvk4Sv/jMpvsKuZJ4Uk61//blM3PFk\nuEGlMefqJv6VnEHMegQF/p5gx33VeuMCDsZWFSQfA8KIwQcQXIIZNwEWZKsABaN1\nVrwt+62X0+s7tFwyh7svcvxQjQKBgQDLR/BimSN29GX2nrhffScBIXEaFDtWqqca\nehmqP7SY3TEgT9qesAoWSCrJtsD8QikPXFXZ42N2olrE8vIwyH6HtONqsIaxGb+j\nyH/VCr9ma48aZdO6fRVgDNpyneAR/gcMx8ymLx1Gg12tsAolGwQ2Y2sC4+2QzrT/\nePMOLYZwjQKBgAhmoaNPVld/45vY0NnPbYTINyBkUo3eHqyLIl/EjxThyvPeEmRv\n9iWXKd5qUNlXQCKtLMB6jHZ1dGFCNNH/jwK8yTtLpzsvrYQLelHtaTsCg6NZDx1o\nA/PkWKd3r3zf5a3GbkMUKEnz5fHeQo1kVPkmhqtY2tYUOrTrEPUsK9WRAoGAfosI\n5IgKILnhY1XI1oCVMEn+G0ru6XOQVJYftfC0XtiLBV9Qa6qQjPBd2nXuytnwr4Q+\nWUYJG8fTk3jdNWsKATakvzymjEbIGo/sq9Vl8r8QNVGgLR5CmSlHL0SCQREOmHEk\nP2ti4QtT3JSSrCiWRbk722/B6nwTBlnnjDLg1t0CgYA2ZDH5SVDp81B8DJjZSaob\nlD9nuPqEBBhYr5+vVPof8uabcMZy49BaCee674DkNc7JvghbgGPtl/1f/BoCSqPr\nMTWB9uCtkmmX5FJMSKKulANyCcz2pIRxHOod/b+CxZPnJo6zNoEQ477VqPqcvAKN\n/Bg1OAqIJeehovgSBuXB+g==\n-----END PRIVATE KEY-----\n",
    "client_email": "tristand9@reality-at.iam.gserviceaccount.com",
    "client_id": "115203994027938100378",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/tristand9%40reality-at.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
});

//For env File 
dotenv.config();

const router = express.Router();


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

const uri = process.env.MONGO_URL;

// @ts-ignore
router.get('/', async (req, res) => {
  const user = {
    name: 'John',
    lastname: 'Doe',
    email: 'sdfs@sdfsd.com',
  };
  res.json(user);
}
);
setTimeout(function () {
  console.log("the uri is ", uri);
  mongoose.connect(uri ?? '').then((res) => {
    console.log("the res is ", res)
  })

}, 1000);
mongoose.connection.on('error', err => {
  console.error(err);
});

// // Contact Infos
// const Listing = mongoose.model("Listing", ListingSchema);
// const newListing = new Listing( {
//   title: "Cozy Apartment in Downtown",
//   description: "This charming apartment boasts a prime location in the heart of downtown. Featuring a spacious living area, modern kitchen, and comfortable bedroom, it's perfect for urban living.",
//   price: 1500,
//   location: {
//     city: "New York City",
//     state: "New York",
//     country: "United States",
//     zipCode: "10001",
//     address: "123 Main Street, Apt 2A"
//   },
//   propertyType: "Apartment",
//   bedrooms: 1,
//   bathrooms: 1,
//   squareFeet: 800,
//   amenities: [
//     "Central Heating",
//     "High-Speed Internet",
//     "Laundry Facilities"
//   ],
//   photos: ["photo1.jpg", "photo2.jpg"],
//   listedDate: new Date(),
//   contactInfo: {
//     name: "John Doe",
//     phone: "(555) 123-4567",
//     email: "john.doe@example.com"
//   },
//   isAvailable: true
// })
// newListing.save();

// const newListing2 = new Listing({
//   title: "Luxury Villa with Ocean View",
//   description: "Experience luxury living in this stunning villa overlooking the ocean. With elegant interiors, spacious rooms, and breathtaking views, it offers a serene retreat for those seeking tranquility.",
//   price: 5000,
//   location: {
//     city: "Malibu",
//     state: "California",
//     country: "United States",
//     zipCode: "90265",
//     address: "456 Ocean Drive"
//   },
//   propertyType: "Villa",
//   bedrooms: 4,
//   bathrooms: 3.5,
//   squareFeet: 4000,
//   amenities: [
//     "Infinity Pool",
//     "Private Beach Access",
//     "Gourmet Kitchen",
//     "Home Theater"
//   ],
//   photos: ["photo3.jpg", "photo4.jpg"],
//   listedDate: new Date(),
//   contactInfo: {
//     name: "Jane Smith",
//     phone: "(555) 987-6543",
//     email: "jane.smith@example.com"
//   },
//   isAvailable: true
// })
// newListing2.save();

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
//form-urlencoded

// @ts-ignore
router.get('/contact-infos', async (req, res) => {
  const ContactInfo = mongoose.model("ContactInfo", ContactInfoSchema);

  const contactInfos = await ContactInfo.find({});

  res.json(contactInfos);
});

// Create Listing
router.post('/listings', async (req, res) => {
  const Listing = mongoose.model("Listing", ListingSchema);

  const newListing = new Listing(req.body);

  try {
    await newListing.save();
    res.json(newListing);
  } catch (err) {
    res.status(400).json(err);
  }

});

// Get Listings
// @ts-ignore
router.get('/listings', async (req, res) => {
  const Listing = mongoose.model("Listing", ListingSchema);

  const listings = await Listing.find({ availability: AvailabilityState.AVAILABLE }).select('-owner').exec();

  res.json(listings);
});

// @ts-ignore
router.get('/admin/listings', async (req, res) => {
  const Listing = mongoose.model("Listing", ListingSchema);

  const listings = await Listing.find({}).exec();

  res.json(listings);
});


app.use(express.static('public'));

router.get('/properties', async (req: any, res: any) => {
  const ListingModel = mongoose.model("Listing", ListingSchema);
  const { city, category } = req.query;

  try {
    // Query the database based on provided parameters
    const items = await ListingModel.find({
      city: city as string,
      category: category as string,
    }).exec();

    res.json(items);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

})

router.post('/upload/listing/image', upload.array('images', 12), async (req: any, res: any) => {
  // Check if files are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const bucketName = 'reality-aandt';
  const uploadedUrls: string[] = [];

  // Loop through all uploaded files
  for (const file of req.files) {
    const fileNameWithoutExtension = file.originalname.split('.')[0]; // Get the file name without extension
    const fileExtension = file.originalname.split('.').pop(); // Get the file extension

    // Generate a timestamp string
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0]; // Format: YYYYMMDD_HHMMSS

    // Concatenate the timestamp with the file name and extension
    const fileName = `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;
    const bucket = storage.bucket(bucketName);
    const fileStream = bucket.file(fileName).createWriteStream({
      // Specify content type to avoid potential issues
      contentType: file.mimetype
    });

    // Promise to track the completion of the file upload
    const uploadPromise = new Promise((resolve, reject) => {
      fileStream.on('error', (err: Error) => {
        console.error('Error uploading to GCS:', err);
        reject(err);
      });

      fileStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        // @ts-ignore
        uploadedUrls.push(publicUrl);
        // @ts-ignore
        resolve();
      });
    });

    // Pipe the file data to the Cloud Storage file stream
    fileStream.end(file.buffer);

    try {
      // Wait for the upload to complete
      await uploadPromise;
    } catch (err) {
      return res.status(500).send('Error uploading image');
    }
  }

  // Once all files are uploaded, send back the URLs
  // @ts-ignore
  res.status(200).json(uploadedUrls);
});

router.delete('/listings/:id', async (req: any, res: any) => {
  const ListingModel = mongoose.model("Listing", ListingSchema);
  const { id } = req.params;

  try {
    // Delete the listing from the database
    await ListingModel.findByIdAndDelete(id).exec();

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);

// Get one listing
router.get('/listings/:id', async (req: any, res: any) => {
  const ListingModel = mongoose.model("Listing", ListingSchema);
  const { id } = req.params;

  try {
    // Query the database for the listing
    const listing = await ListingModel.findById(id).select('-owner').exec();

    res.json(listing);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

app.use(cors());


app.use('/', router);

// Allow requests from all origins (for development purposes)

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
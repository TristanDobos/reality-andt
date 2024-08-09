import { AvailabilityState, ListingSchema } from './schemas/listing';

import { contactInfoSchema } from './schemas/contactInfo';
import cors from "cors";
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
// @ts-ignore
import path from 'path';

// @ts-ignore
// import { sendMessage } from 'sendSMSnotification';
const axios = require('axios');

const Jimp = require('jimp');

const app = express();
const port = process.env.PORT || 9000;

async function createThumbnail(buffer: Buffer) {
  try {
    // Load the image from the buffer
    const image = await Jimp.read(buffer);

    // Resize the image
    image.resize(150, Jimp.AUTO);

    // Get the resized image as a buffer
    const thumbnailBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    return thumbnailBuffer;
  } catch (err) {
    console.error('Error creating thumbnail:', err);
    throw err;
  }
}

var multer = require('multer');
var upload = multer({ storage: multer.memoryStorage() });

const { Storage } = require('@google-cloud/storage');

// @ts-ignore
const googleenv = JSON.parse(process.env.GOOGLE_KEY);

const storage = new Storage({
  projectId: "reality-at",
  credentials: googleenv
});

console.log("the env is: ", googleenv);
// @ts-ignore
console.log("client_email field is: ", googleenv['client_email'])

//For env File 
dotenv.config();

const router = express.Router();



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


app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
//form-urlencoded

router.get('/uploadpicture', async (_: any, res) => {
  res.json({
    'message': "This work"
  })

})


router.post('/uploadpicture', upload.single('image'), async (req: any, res) => {
  try {
    console.log("Uploading a picture");
    const { buffer } = req.file;
    const da = Date.now();

    console.log("the name is ", req.file);
    const hdFileName = `hd-${da}-${req.file.originalname}`;
    const thumbnailFileName = `thumb-${da}-${req.file.originalname}`;

    const bucketName = 'reality-aandt';
    const bucket = storage.bucket(bucketName);

    // Upload HD image
    const hdFile = bucket.file(hdFileName);
    await hdFile.save(buffer);

    // Create and upload thumbnail
    const thumbnailBuffer = await createThumbnail(buffer);

    const thumbnailFile = bucket.file(thumbnailFileName);
    await thumbnailFile.save(thumbnailBuffer);

    console.log("the hd file is ", hdFileName);
    console.log("thumbnail file name is: ", thumbnailFileName)

    res.status(200).send('Files uploaded successfully');
  } catch (error) {

    console.error(error);
    res.status(500).send(error);
  }
});


// @ts-ignore
router.get('/contact-infos', async (req, res) => {
  const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);

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

router.post('/contact-form', async (req, res) => {
  let contactInfo = req.body;
  
  const listingId = contactInfo.listingId;

  const Listing = mongoose.model("Listing", ListingSchema);

  const listing = await Listing.findById(listingId);

  contactInfo = {...contactInfo, ownerNumber: listing.owner.phone, ownerName: listing.owner.name }

  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  
  const getAccessToken = async () => {
    const token = await axios.post("https://app.gosms.eu/oauth/v2/token",
      "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&grant_type=client_credentials"
    );
    return token;
  }

  const sendMessage = async ({ title, ownerName, ownerNumber, note, name, phoneNumber, email }: any) => {

    const { data: { access_token } } = await getAccessToken();

    console.log("the token is ", access_token);

    const result = await axios.post(
      "https://app.gosms.eu/api/v1/messages?access_token=" + access_token,
      {
        "message": `${title}
https://realityaandt.com/properties/${listingId}
Tulaj: ${ownerName}, ${ownerNumber}
Uzenet: ${note}
Info:
${name}
${phoneNumber}
${email}
            `,
        "recipients": ["+421940718402"],
        "channel": 404294,
      }
    );

    // TODO: save everything to the DB + IP address + timestamp

    console.log("the result is ", result);

    return result;
  }

 sendMessage({ ...listing, ...contactInfo});
 const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

 //@ts-ignore
  const contact = new ContactInfo({
    ...contactInfo,
    _id: undefined,
   
    });

    // Save the contact information to the database
   contact.save();

  res.json({ "message": "Success" });
})

// Get Listings
// @ts-ignore
router.get('/listings', async (req, res) => {
  const Listing = mongoose.model("Listing", ListingSchema);

  const listings = await Listing.find({ availability: AvailabilityState.AVAILABLE }).select('-owner').exec();
  console.log("the listings are ", listings);
  console.log("it filters the listings ", listings.filter((listing: any) => listing.availability === AvailabilityState.AVAILABLE));

  res.json(listings);
});

// Update Listing
router.put('/listings/:id', async (req, res) => {
  const Listing = mongoose.model("Listing", ListingSchema);
  const { id } = req.params;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, { new: true }).exec();
    res.json(updatedListing);
  } catch (err) {
    res.status(400).json(err);
  }
});

// @ts-ignore
router.get('/admin/listings', async (req, res) => {
  const Listing = mongoose.model("Listing", ListingSchema);

  const listings = await Listing.find({}).exec();

  res.json(listings);
});



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



app.use(express.static('public'));


export default router;

app.use(cors());


app.use('/', router);

// Allow requests from all origins (for development purposes)

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

/*


// scripts
// 1. Find all the listings that have photos but not have thumbnail-photos


const Listing = mongoose.model("Listing", ListingSchema);
const bucketName = 'reality-aandt';
const bucket = storage.bucket(bucketName);


async function uploadToGCS(filePath: any, destFileName: any) {

  const file = bucket.file(destFileName);

  // Check if the file exists in the bucket
  const [exists] = await file.exists();

  if (exists) {
    console.log(`File ${destFileName} already exists in the bucket.`);
  } else {
    // Upload the file if it does not exist
    await bucket.upload(filePath, {
      destination: destFileName,
     metadata: {
        cacheControl: 'public, max-age=31536000'
    } 
    });
    console.log(`File ${filePath} uploaded to ${bucketName} as ${destFileName}.`);
  }

  // await bucket.upload(filePath, {
  //     destination: destFileName,
  //     // public: true // Make the file publicly accessible
  //     metadata: {
  //      cacheControl: 'public, max-age=31536000'
  //  } 
  // })
  console.log(`${filePath} uploaded to ${bucketName} as ${destFileName}`)
}

// Function to create an HD version of an image
async function createHdVersion(imageUrl: string, destFileName: string) {
  try {
    // Load the image
    const image = await Jimp.read(imageUrl)

    const file = bucket.file(destFileName);

    // Check if the file exists in the bucket
    const [exists] = await file.exists();
    if (!exists) {
      // Process the image (resize, enhance, etc.)
      // For HD version, we might simply increase the quality, resolution, etc.
      image.resize(Jimp.AUTO, 720) // Resize the image height to 1080px, keeping aspect ratio
      const tempFilePath = path.join(__dirname, "temp", destFileName)

      // Save the processed image locally
      await image.writeAsync(tempFilePath)

      // Upload to Google Cloud Storage
      await uploadToGCS(tempFilePath, destFileName)
    }
  } catch (error) {
    console.error("Error processing the image:", error)
  }
}

async function findListings() {
  try {
    // Query to find listings with a photo attribute but without previews
    const listings = await Listing.find({
      photos: { $exists: true },
      previews: { $exists: false },
    }).select('_id photos').exec();

    console.log("listings", listings);


    listings.forEach(listing => {
         listing.photos.forEach((photo: string) => {
      // https://storage.googleapis.com/reality-aandt/IMG_2119_20240218_210747.jpg
      const fileName = "previews/" + photo.split("/")[photo.split("/").length - 1]
      console.log("file name is", fileName);
      createHdVersion(photo, fileName);
    });

    })
    // const firstListing = listings[0];
 
    // listings.forEach(({_id, photos}) => {

    //   photos.forEach(photo => {

    //   });
    // });
  } catch (error) {
    console.error("Error finding listings:", error);
  }
}

findListings(); */
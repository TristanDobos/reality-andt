"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const listing_1 = require("./schemas/listing");
const contactInfo_1 = require("./schemas/contactInfo");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Jimp = require('jimp');
async function createThumbnail(buffer) {
    try {
        const image = await Jimp.read(buffer);
        image.resize(150, Jimp.AUTO);
        const thumbnailBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
        return thumbnailBuffer;
    }
    catch (err) {
        console.error('Error creating thumbnail:', err);
        throw err;
    }
}
var multer = require('multer');
var upload = multer({ storage: multer.memoryStorage() });
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: "reality-at",
    credentials: process.env.GOOGLE_KEY
});
console.log("the env is: ", process.env.GOOGLE_KEY);
dotenv_1.default.config();
const router = express_1.default.Router();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
const uri = process.env.MONGO_URL;
router.get('/', async (req, res) => {
    const user = {
        name: 'John',
        lastname: 'Doe',
        email: 'sdfs@sdfsd.com',
    };
    res.json(user);
});
setTimeout(function () {
    console.log("the uri is ", uri);
    mongoose_1.default.connect(uri !== null && uri !== void 0 ? uri : '').then((res) => {
        console.log("the res is ", res);
    });
}, 1000);
mongoose_1.default.connection.on('error', err => {
    console.error(err);
});
app.use(express_1.default.json({ limit: '500mb' }));
app.use(express_1.default.urlencoded({ limit: '500mb', extended: true }));
router.get('/uploadpicture', async (_, res) => {
    res.json({
        'message': "This work"
    });
});
router.post('/uploadpicture', upload.single('image'), async (req, res) => {
    try {
        console.log("Uploading a picture");
        const { buffer } = req.file;
        const da = Date.now();
        console.log("the name is ", req.file);
        const hdFileName = `hd-${da}-${req.file.originalname}`;
        const thumbnailFileName = `thumb-${da}-${req.file.originalname}`;
        const bucketName = 'reality-aandt';
        const bucket = storage.bucket(bucketName);
        const hdFile = bucket.file(hdFileName);
        await hdFile.save(buffer);
        const thumbnailBuffer = await createThumbnail(buffer);
        const thumbnailFile = bucket.file(thumbnailFileName);
        await thumbnailFile.save(thumbnailBuffer);
        console.log("the hd file is ", hdFileName);
        console.log("thumbnail file name is: ", thumbnailFileName);
        res.status(200).send('Files uploaded successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
router.get('/contact-infos', async (req, res) => {
    const ContactInfo = mongoose_1.default.model("ContactInfo", contactInfo_1.ContactInfoSchema);
    const contactInfos = await ContactInfo.find({});
    res.json(contactInfos);
});
router.post('/listings', async (req, res) => {
    const Listing = mongoose_1.default.model("Listing", listing_1.ListingSchema);
    const newListing = new Listing(req.body);
    try {
        await newListing.save();
        res.json(newListing);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
router.get('/listings', async (req, res) => {
    const Listing = mongoose_1.default.model("Listing", listing_1.ListingSchema);
    const listings = await Listing.find({ availability: listing_1.AvailabilityState.AVAILABLE }).select('-owner').exec();
    console.log("the listings are ", listings);
    console.log("it filters the listings ", listings.filter((listing) => listing.availability === listing_1.AvailabilityState.AVAILABLE));
    res.json(listings);
});
router.put('/listings/:id', async (req, res) => {
    const Listing = mongoose_1.default.model("Listing", listing_1.ListingSchema);
    const { id } = req.params;
    try {
        const updatedListing = await Listing.findByIdAndUpdate(id, req.body, { new: true }).exec();
        res.json(updatedListing);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
router.get('/admin/listings', async (req, res) => {
    const Listing = mongoose_1.default.model("Listing", listing_1.ListingSchema);
    const listings = await Listing.find({}).exec();
    res.json(listings);
});
router.get('/properties', async (req, res) => {
    const ListingModel = mongoose_1.default.model("Listing", listing_1.ListingSchema);
    const { city, category } = req.query;
    try {
        const items = await ListingModel.find({
            city: city,
            category: category,
        }).exec();
        res.json(items);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/upload/listing/image', upload.array('images', 12), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const bucketName = 'reality-aandt';
    const uploadedUrls = [];
    for (const file of req.files) {
        const fileNameWithoutExtension = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.').pop();
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
        const fileName = `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;
        const bucket = storage.bucket(bucketName);
        const fileStream = bucket.file(fileName).createWriteStream({
            contentType: file.mimetype
        });
        const uploadPromise = new Promise((resolve, reject) => {
            fileStream.on('error', (err) => {
                console.error('Error uploading to GCS:', err);
                reject(err);
            });
            fileStream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
                uploadedUrls.push(publicUrl);
                resolve();
            });
        });
        fileStream.end(file.buffer);
        try {
            await uploadPromise;
        }
        catch (err) {
            return res.status(500).send('Error uploading image');
        }
    }
    res.status(200).json(uploadedUrls);
});
router.delete('/listings/:id', async (req, res) => {
    const ListingModel = mongoose_1.default.model("Listing", listing_1.ListingSchema);
    const { id } = req.params;
    try {
        await ListingModel.findByIdAndDelete(id).exec();
        res.status(200).json({ message: 'Listing deleted successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/listings/:id', async (req, res) => {
    const ListingModel = mongoose_1.default.model("Listing", listing_1.ListingSchema);
    const { id } = req.params;
    try {
        const listing = await ListingModel.findById(id).select('-owner').exec();
        res.json(listing);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.use(express_1.default.static('public'));
exports.default = router;
app.use((0, cors_1.default)());
app.use('/', router);
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map
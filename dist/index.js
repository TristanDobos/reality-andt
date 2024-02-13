"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contactInfo_1 = require("./schemas/contactInfo");
const listing_1 = require("./schemas/listing");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
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
router.get('/admin/listings', async (req, res) => {
    const Listing = mongoose_1.default.model("Listing", listing_1.ListingSchema);
    const listings = await Listing.find({}).exec();
    res.json(listings);
});
app.use(express_1.default.static('public'));
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
exports.default = router;
app.use((0, cors_1.default)());
app.use('/', router);
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');

// Initialize Google Cloud Storage client
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
  
  async function getImageDimensions(sourceBlob) {
    try {
      // Download the image from the source blob
      const [file] = await storage.bucket(bucketName).file(sourceBlob).download();
  
      // Get image dimensions
      const metadata = await sharp(file).metadata();
      const { width, height } = metadata;
  
      return { width, height };
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return null;
    }
  }
  
  async function createThumbnail(sourceBlob, destinationBlob) {
    try {
      // Download the image from the source blob
      const [file] = await storage.bucket(bucketName).file(sourceBlob).download();
  
      // Get image dimensions
      const metadata = await sharp(file).metadata();
      const { width, height } = metadata;

      console.log('the dimensions are ', width, height)
  
    //   // Check if the file size is greater than 2MB
    //   if (file.length > 2 * 1024 * 1024) {
    //     // Resize the image to create a thumbnail
    //     const thumbnailBuffer = await sharp(file).resize(100, 100).toBuffer();
  
    //     // Upload the thumbnail to the destination blob
    //     await storage.bucket(bucketName).file(destinationBlob).save(thumbnailBuffer, {
    //       contentType: 'image/jpeg',
    //       metadata: {
    //         contentType: 'image/jpeg',
    //         width,
    //         height
    //       }
    //     });
  
    //     console.log(`Thumbnail created for ${sourceBlob} and uploaded to ${destinationBlob}`);
    //   } else {
    //     console.log(`${sourceBlob} does not require a thumbnail`);
    //   }
    } catch (error) {
      console.error('Error creating thumbnail:', error);
    }
  }
  
  async function processImagesInBucket() {
    try {
      // Get a list of files in the bucket
      const [files] = await storage.bucket(bucketName).getFiles();
  
      // Process each file in the bucket
      for (const file of files) {
        // Check if the file is an image
        if (['.png', '.jpg', '.jpeg', '.gif'].includes(file.name.toLowerCase().slice(-4))) {
          // Create a thumbnail for the image
          const destinationBlob = `thumbnails/${file.name}`;
          await createThumbnail(file.name, destinationBlob);
        }
      }
    } catch (error) {
      console.error('Error processing images:', error);
    }
  }
  
  // Start processing images in the bucket
  processImagesInBucket();
  
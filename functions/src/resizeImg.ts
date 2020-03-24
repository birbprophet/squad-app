const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { tmpdir } = require('os');
const { Storage: storage } = require('@google-cloud/storage');
const { dirname, join } = require('path');
const sharp = require('sharp');
const fs = require('fs-extra');
const gcs = new storage();
admin.initializeApp();
const db = admin.firestore();

export const resizeImg = functions
  .runWith({ memory: '2GB', timeoutSeconds: 120 })
  .storage.object()
  .onFinalize(async (object: any) => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const bucketDir = dirname(filePath);

    const workingDir = join(tmpdir(), 'resize');
    const tmpFilePath = join(workingDir, 'source.png');

    console.log(`Got ${fileName} file`);

    if (fileName.includes('@s_') || !object.contentType.includes('image')) {
      console.log(`Already resized. Exiting function`);
      return false;
    }

    await fs.ensureDir(workingDir);
    await bucket.file(filePath).download({ destination: tmpFilePath });

    let uid = fileName.replace(`.${fileName.split('.').pop()}`, '');
    let session = 'default';
    let imageIdx = '0';

    if (bucketDir === 'userUploads') {
      const uid_split = uid.split('____');
      uid = uid_split[0];
      const sessionIdx = uid_split[1];
      session = sessionIdx.split('_')[0];
      imageIdx = sessionIdx.split('_')[1];
    }

    const sizes = [1080, 640, 200, 64];

    const uploadPromises = sizes.map(async size => {
      console.log(`Resizing ${fileName} at size ${size}`);

      const newImgName = `${uid}@s_${size}.jpg`;
      const imgPath = join(workingDir, newImgName);
      await sharp(tmpFilePath)
        .resize({
          width: size,
          height: size,
          fit: sharp.fit.cover,
          position: sharp.strategy.entropy,
        })
        .toFormat('jpeg')
        .jpeg({
          quality: 100,
          chromaSubsampling: '4:4:4',
          force: true,
        })
        .toFile(imgPath);

      console.log(`Just resized ${newImgName} at size ${size}`);

      return bucket.upload(imgPath, {
        destination: join(bucketDir, newImgName),
        predefinedAcl: 'publicRead',
      });
    });

    await Promise.all(uploadPromises);

    const currentTime = new Date();
    const currentTimestamp = currentTime.getTime();
    const templateString = `https://firebasestorage.googleapis.com/v0/b/the-squad-app.appspot.com/o/${bucketDir}%2F__USER_UID__%40s___SIZE__.jpg?alt=media&t=${currentTimestamp.toString()}`;

    if (bucketDir === 'userProfilePictures') {
      await db
        .collection(bucketDir)
        .doc(uid)
        .set(
          {
            profilePictureUrls: {
              ['size_' + sizes[0].toString()]: templateString
                .replace('__USER_UID__', uid)
                .replace('__SIZE__', sizes[0].toString()),
              ['size_' + sizes[1].toString()]: templateString
                .replace('__USER_UID__', uid)
                .replace('__SIZE__', sizes[1].toString()),
              ['size_' + sizes[2].toString()]: templateString
                .replace('__USER_UID__', uid)
                .replace('__SIZE__', sizes[2].toString()),
              ['size_' + sizes[3].toString()]: templateString
                .replace('__USER_UID__', uid)
                .replace('__SIZE__', sizes[3].toString()),
            },
          },
          { merge: true }
        )
        .catch((error: any) => {
          console.log('Error writing document: ' + error);
          return false;
        });
    } else if (bucketDir === 'userUploads') {
      await db
        .collection(bucketDir)
        .doc(uid)
        .collection(session)
        .doc(imageIdx)
        .set(
          {
            ['size_' + sizes[0].toString()]: templateString
              .replace('__USER_UID__', uid)
              .replace('__SIZE__', sizes[0].toString()),
            ['size_' + sizes[1].toString()]: templateString
              .replace('__USER_UID__', uid)
              .replace('__SIZE__', sizes[1].toString()),
            ['size_' + sizes[2].toString()]: templateString
              .replace('__USER_UID__', uid)
              .replace('__SIZE__', sizes[2].toString()),
            ['size_' + sizes[3].toString()]: templateString
              .replace('__USER_UID__', uid)
              .replace('__SIZE__', sizes[3].toString()),
          },
          { merge: true }
        )
        .catch((error: any) => {
          console.log('Error writing document: ' + error);
          return false;
        });
    }

    return fs.remove(workingDir);
  });

const multer = require('multer');
const upload = multer();
var Minio = require('minio');
import _ from 'lodash';

const bucket = 'photos';

var minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'thanhson',
  secretKey: 'thanhson',
});
var metaData = {
  'Content-Type': 'application/octet-stream',
};

export class UploadFile {
  async UpLoad(request: any, response: any) {
    let data: any;
    let url: string[] = [];
    return new Promise(function (resolve, reject) {
      upload.any(request)(request, response, async (err: any) => {
        if (err !== undefined) return reject(err);
        await request.files.map(async (file: any) => {
          minioClient.bucketExists(bucket, function (err: any, exists: any) {
            if (!exists) {
              minioClient.makeBucket(bucket, 'us-east-1', function (err: any) {
                if (err) {
                  console.log('loi~ o day hae', err);
                } else {
                  console.log('Bucket created successfully in "us-east-1".');
                }
              });
            }
          });
          minioClient.putObject(
            bucket,
            file.originalname,
            file.buffer,
            file.size,
            metaData,
            function (err: any, etag: any) {
              if (err) return console.log('loi~ day hae ', err);
              console.log('File uploaded successfully.');
            },
          );
          //   data = file.originalname;
          url.push(`http://[::1]:3000/${bucket}/download/${file.originalname}`);
        });
        resolve(url);
      });
    });
  }
}

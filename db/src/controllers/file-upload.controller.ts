import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  Request,
  requestBody,
  response,
  Response,
  RestBindings,
} from '@loopback/rest';
import _ from 'lodash';
import {Files} from '../models/files.model';
import {FilesRepository} from '../repositories/files.repository';
import {UploadFile} from '../services/upload.service';
var Minio = require('minio');

const bucket = 'photos';
var minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'thanhson',
  secretKey: 'thanhson',
});

export class FileUploadController {
  constructor(
    @repository(FilesRepository) public fileRepository: FilesRepository,
    @inject('services.UpLoadService') public uploadFile: UploadFile,
  ) {}
  @post('/files', {
    responses: {
      200: {
        content: {
          'application/json': {
            url: 'hehe',
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = await this.uploadFile.UpLoad(request, response);
    console.log(file);
    return file;
  }

  @get('/{bucket}/download/{fileName}', {
    responses: {
      '200': {
        description: `Download asset`,
        content: {'application/json': {}},
      },
    },
  })
  async download(
    @param.path.string('bucket') bucket: string,
    @param.path.string('fileName') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const stat = await minioClient.statObject(bucket, fileName);
    const {size, metaData} = stat;
    response.writeHead(200, {
      ...metaData,
      'Content-Type': 'application/octet-stream',
      'Accept-Ranges': 'bytes',
      'Content-Length': size,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Meta': JSON.stringify(metaData),
    });
    minioClient.getObject(bucket, fileName, (err: any, dataStream: any) => {
      if (err) {
        return console.log(err);
      }
      dataStream.pipe(response);
    });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OSS from 'ali-oss';

@Injectable()
export class OssService {

  private client: OSS;

  constructor(private configService: ConfigService) {
    console.log('OSS Region:', this.configService.get('oss_region'));
    console.log('AccessKey ID:', this.configService.get('accessKey_id'));
    console.log('accessKey_secret:', this.configService.get('accessKey_secret'));
    this.client = new OSS({
      region: this.configService.get('oss_region'), // 根据你的区域修改
      accessKeyId: this.configService.get('accessKey_id'),
      accessKeySecret: this.configService.get('accessKey_secret'),
      bucket: this.configService.get('bucket_name'),
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    try {
      const result = await this.client.put(filename, file.buffer, {
        Headers: {
          'Content-Disposition': 'inline'
        }
      }); // 直接使用 buffer 上传
      return {
        url: result.url,
        name: filename,
      };
    } catch (err) {
      console.error('OSS上传失败：', err);
      throw err;
    }
  }
}

import { Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import type { Request } from 'express';
import { ReportPipeline } from '../../pipelines/report.pipeline';
import { FormDataInterceptor } from '../../common/interceptors/multipart/form-data.interceptor';

@Controller('report')
export class ReportController {
  @UseInterceptors(FormDataInterceptor)
  @Post()
  async sendReport(@Req() req: Request) {
    // const report = await ReportPipeline.generete(req);
    // return report;
  }
}

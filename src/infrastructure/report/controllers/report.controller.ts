import { Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ReportPipeline } from '../../pipelines/report.pipeline';

@Controller('report')
export class ReportController {
  @Post()
  async sendReport(@Req() req: Request) {
    const report = await ReportPipeline.generete(req);
    return report;
  }
}

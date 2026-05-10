import { Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import type { Request } from 'express';
import { FormDataInterceptor } from '../../common/interceptors/multipart/form-data.interceptor';
import { ReportService } from '../services/report.service';

@Controller('report')
export class ReportController {
  constructor(private ReportService: ReportService) {}

  @UseInterceptors(FormDataInterceptor)
  @Post()
  async sendReport(@Req() req: Request) {
    const report = await this.ReportService.sendReport(req);
    return report;
  }
}

import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import type { Request, Response } from 'express';
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

  @Get()
  reportAll() {
    const report = this.ReportService.reportAll();
    return report;
  }

  @Get('/:filename/download')
  dowloadReportPerName(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const report = this.ReportService.dowloadReportPerName(res, filename);
    return report;
  }
}

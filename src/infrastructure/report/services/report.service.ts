import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ReportPipeline } from '../../pipelines/report.pipeline';
import { ReportJson } from '../../pipelines/types/report-json.type';

@Injectable()
export class ReportService {
  async sendReport(request: Request): Promise<ReportJson> {
    const report = await ReportPipeline.generete(request);
    return report;
  }
}

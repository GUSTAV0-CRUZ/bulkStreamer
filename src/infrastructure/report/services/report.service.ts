import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReportPipeline } from '../../pipelines/report.pipeline';
import { ReportJson } from '../../pipelines/types/report-json.type';
import path from 'path';
import fs from 'fs';

@Injectable()
export class ReportService {
  private pathStorage = path.resolve(
    __dirname,
    '../../../../../storage/report',
  );

  async sendReport(request: Request): Promise<ReportJson> {
    const report = await ReportPipeline.generete(request);
    return report;
  }

  reportAll() {
    const report = fs.readdirSync(this.pathStorage);
    return report;
  }

  dowloadReportPerName(response: Response, filename: string) {
    const report = ReportPipeline.dowloadFile(response, filename);

    return report;
  }
}

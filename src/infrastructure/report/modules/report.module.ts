import { Module } from '@nestjs/common';
import { ReportController } from '../controllers/report.controller';
import { ReportService } from '../services/report.service';

@Module({
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}

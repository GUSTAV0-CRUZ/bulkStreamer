import { Module } from '@nestjs/common';
import { ReportModule } from './infrastructure/report/modules/report.module';

@Module({
  imports: [ReportModule],
})
export class AppModule {}

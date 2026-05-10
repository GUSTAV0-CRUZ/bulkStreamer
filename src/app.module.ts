import { Module } from '@nestjs/common';
import { ReportController } from './infrastructure/report/controllers/report.controller';

@Module({
  imports: [],
  controllers: [ReportController],
  providers: [],
})
export class AppModule {}

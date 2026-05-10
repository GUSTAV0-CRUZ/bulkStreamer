import fs, { WriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Transform, TransformCallback } from 'stream';
import path from 'path';
import { Transaction } from '../../domain/entities/Transaction';
import { BadRequestException, Logger, StreamableFile } from '@nestjs/common';
import { ReportJson } from './types/report-json.type';
import { Request, Response } from 'express';
import Busboy from 'busboy';
import { once } from 'events';

export class ReportPipeline {
  private static logger = new Logger(ReportPipeline.name);
  private static pathRoot = path.resolve(
    __dirname,
    '../../../../storage/report',
  );

  static dowloadFile(response: Response, filename: string) {
    const report = fs.createReadStream(`${this.pathRoot}/${filename}.csv`);

    response.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(report);
  }

  static async generete(request: Request) {
    const reportInJson: ReportJson = {
      transactions: 0,
      accepted: 0,
      rejected: 0,
      executionTime: '',
    };
    const reportDate = new Date().toJSON();
    const pathTransactionAccepted = `${this.pathRoot}/acceted_transactions-${reportDate}.csv`;
    const pathTransactionRejecte = `${this.pathRoot}/rejected_transactions-${reportDate}.csv`;
    const pathReport = `${this.pathRoot}/report-${reportDate}.csv`;
    const transactionAccepted = fs.createWriteStream(pathTransactionAccepted);
    const transactionRejecte = fs.createWriteStream(pathTransactionRejecte);
    const reportWrite = fs.createWriteStream(pathReport);
    const transform = this.transformReport(
      transactionAccepted,
      transactionRejecte,
      reportWrite,
      reportInJson,
    );
    const busboy = Busboy({ headers: request.headers });

    try {
      request.pipe(busboy);

      const [, file] = (await once(busboy, 'file')) as [
        name: string,
        file: Buffer,
      ];

      const executionTimeStart = Date.now();
      await pipeline(file, transform);
      reportInJson.executionTime = `${Date.now() - executionTimeStart}ms`;

      return reportInJson;
    } catch (error: any) {
      this.logger.error(
        `Error in pipeline processes in transaction: (${reportInJson.transactions}) `,
        {
          error: JSON.stringify(error),
        },
      );
      throw new BadRequestException(
        `Error in pipeline processes in transaction: (${reportInJson.transactions})`,
      );
    } finally {
      transactionAccepted.end();
      transactionRejecte.end();
      reportWrite.end();
    }
  }

  private static transformReport(
    transactionAcceptedWrite: WriteStream,
    transactionRejecteWrite: WriteStream,
    reportWrite: WriteStream,
    reportInJson: ReportJson,
  ): Transform {
    let lastLine: string = '';

    return new Transform({
      transform(chunk: Buffer, encoding: string, callback: TransformCallback) {
        const lines = (lastLine + chunk.toString('utf-8')).split(/\r?\n/);
        lastLine = lines.pop() || '';

        const transactionAccepted: Array<string> = [];
        const transactionRejected: Array<string> = [];

        lines.forEach((line) => {
          reportInJson.transactions += 1;
          const transaction = ReportPipeline.createTransactionPerLine(line);

          const lineInString =
            ReportPipeline.createLinePerTrasacntion(transaction);

          if (transaction.isApproved()) {
            transactionAccepted.push(lineInString);
            reportInJson.accepted += 1;
            return;
          }
          reportInJson.rejected += 1;
          transactionRejected.push(lineInString);
        });

        const transactionAcceptedBuffer =
          ReportPipeline.arrayStringToBuffer(transactionAccepted);
        const transactionRejectedBuffer =
          ReportPipeline.arrayStringToBuffer(transactionRejected);

        transactionAcceptedWrite.write(transactionAcceptedBuffer);
        transactionRejecteWrite.write(transactionRejectedBuffer);

        callback(null, '\n');
      },
      flush(callback) {
        const report = ReportPipeline.reportInGeral(
          reportInJson.transactions,
          reportInJson.accepted,
          reportInJson.rejected,
        );

        if (lastLine) {
          const lastTransaction =
            ReportPipeline.createTransactionPerLine(lastLine);
          const lineInString =
            ReportPipeline.createLinePerTrasacntion(lastTransaction);
          const lineInBuffer = ReportPipeline.arrayStringToBuffer([
            '\n' + lineInString,
          ]);

          if (lastTransaction.isApproved()) {
            reportInJson.accepted += 1;
            transactionAcceptedWrite.write(lineInBuffer);
            reportWrite.write(report);
            return callback();
          }
          reportInJson.rejected += 1;
          transactionRejecteWrite.write(lineInBuffer);
        }
        reportWrite.write(report);
        callback();
      },
    });
  }

  private static arrayStringToBuffer(array: Array<string>): Buffer {
    return Buffer.from(array.join(''), 'utf-8');
  }

  private static createTransactionPerLine(line: string) {
    const filds = line.split(',');
    const transaction_id = filds[0];
    const account_id = filds[1];
    const amount = Number(filds[2]);
    const transaction_type = filds[3];
    const timestamp = new Date(filds[4]);

    return new Transaction(
      transaction_id,
      account_id,
      amount,
      transaction_type,
      timestamp,
    );
  }

  private static createLinePerTrasacntion(transaction: Transaction) {
    return `${transaction.getTransaction_id()},${transaction.getAccount_id()},${transaction.getAmount()},${transaction.getTransaction_type()},${transaction.getTimestamp()},${transaction.getRejection_reason()}\n`;
  }

  private static reportInGeral(
    numberTransactions: number,
    numberTransactionsAccepted: number,
    numberTransactionsRejected: number,
  ) {
    const header = 'Transactions,Accepted,Rejected,ReportDate\n';
    const report = `${numberTransactions},${numberTransactionsAccepted},${numberTransactionsRejected},${new Date().toJSON()}`;
    return ReportPipeline.arrayStringToBuffer([header, report]);
  }
}

import fs, { WriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Transform, TransformCallback } from 'stream';
import path from 'path';
import { Transaction } from '../../domain/entities/Transaction';
import { Logger } from '@nestjs/common';

const csvPath = path.resolve(__dirname, '../../../mediun-transactions.csv');

export class ReportPipeline {
  private static logger = new Logger(ReportPipeline.name);

  static async generete(buffer: Buffer | string) {
    try {
      const readedFile = fs.createReadStream(buffer);

      const transactionAccepted = fs.createWriteStream(
        'acceted_transactions.csv',
      );
      const transactionRejecte = fs.createWriteStream(
        'rejected_transactions.csv',
      );

      const transform = this.transformReport(
        transactionAccepted,
        transactionRejecte,
      );

      await pipeline(readedFile, transform);
    } catch (error: any) {
      this.logger.error('Erro in proccess pipeline: ', {
        error: JSON.stringify(error),
      });
    }
  }

  private static transformReport(
    transactionAcceptedWrite: WriteStream,
    transactionRejecteWrite: WriteStream,
  ): Transform {
    let lastLine: string = '';

    return new Transform({
      transform(chunk: Buffer, encoding: string, callback: TransformCallback) {
        const lines = (lastLine + chunk.toString('utf-8')).split(/\r?\n/);
        lastLine = lines.pop() || '';

        const transactionAccepted: Array<string> = [];
        const transactionRejected: Array<string> = [];

        lines.forEach((line) => {
          const transaction = ReportPipeline.createTransactionPerLine(line);

          const lineInString =
            ReportPipeline.createLinePerTrasacntion(transaction);

          if (transaction.isApproved()) {
            transactionAccepted.push(lineInString);
            return;
          }
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
        if (lastLine) {
          const lastTransaction =
            ReportPipeline.createTransactionPerLine(lastLine);
          const lineInString =
            ReportPipeline.createLinePerTrasacntion(lastTransaction);
          const lineInBuffer = ReportPipeline.arrayStringToBuffer([
            '\n' + lineInString,
          ]);

          if (lastTransaction.isApproved()) {
            transactionAcceptedWrite.write(lineInBuffer);
            return callback();
          }

          transactionRejecteWrite.write(lineInBuffer);
        }
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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const teste = ReportPipeline.generete(csvPath).then((t) => t);

// console.log(teste);

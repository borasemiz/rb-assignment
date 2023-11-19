import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";
import { FileCustomerStatementRecordParser } from "./FileCustomerStatementRecordParser";
import { SaxesParser, TagForOptions } from "saxes";
import { MalformedRecord } from "./errors/MalformedRecord";

type GetSaxesParserOptions<TParser extends SaxesParser> = TParser['opt'];

const RECORDS_TAG = 'records';
const RECORD_TAG = 'record';
const REFERENCE_ATTRIBUTE = 'reference';

const ACCOUNT_NUMBER_TAG = 'accountNumber';
const DESCRIPTION_TAG = 'description';
const START_BALANCE_TAG = 'startBalance';
const MUTATION_TAG = 'mutation';
const END_BALANCE_TAG = 'endBalance';

export class XMLCustomerStatementRecordParser extends FileCustomerStatementRecordParser {
  private xmlParser = new SaxesParser();

  private currentRecordBeingParsed: RawCustomerStatementRecord = {};
  private currentRecordAttribute: keyof RawCustomerStatementRecord | undefined;

  private isParserInsideRecordsTag = false;
  private isParserInsideARecordTag = false;

  constructor(file: File) {
    super(file);

    this.xmlParser.on('opentag', this.handleOpenTag.bind(this));
    this.xmlParser.on('text', this.handleText.bind(this));
    this.xmlParser.on('closetag', this.handleCloseTag.bind(this));
    this.xmlParser.on('error', this.handleError.bind(this));
  }

  protected async tryParsingNextChunk(chunk: string): Promise<boolean> {
    this.xmlParser.write(chunk);

    return true;
  }

  protected closeStream(): void {
    this.xmlParser.close();
    this.recordStream$$.complete();
  }

  private handleOpenTag({ attributes, name }: TagForOptions<GetSaxesParserOptions<typeof this.xmlParser>>): void {
    if (name === RECORDS_TAG) {
      this.isParserInsideRecordsTag = true;
    }

    if (!this.isParserInsideRecordsTag) return;

    if (name === RECORD_TAG) {
      this.isParserInsideARecordTag = true;
      this.currentRecordBeingParsed.transactionReference = typeof attributes[REFERENCE_ATTRIBUTE] === 'string'
        ? attributes[REFERENCE_ATTRIBUTE]
        : undefined;
    }

    if (!this.isParserInsideARecordTag) return;

    switch (name) {
      case ACCOUNT_NUMBER_TAG:
        this.currentRecordAttribute = ACCOUNT_NUMBER_TAG;
        break;
      case DESCRIPTION_TAG:
        this.currentRecordAttribute = DESCRIPTION_TAG;
        break;
      case START_BALANCE_TAG:
        this.currentRecordAttribute = START_BALANCE_TAG;
        break;
      case MUTATION_TAG:
        this.currentRecordAttribute = MUTATION_TAG;
        break;
      case END_BALANCE_TAG:
        this.currentRecordAttribute = END_BALANCE_TAG;
        break;
    }
  }

  private handleText(text: string): void {
    if (
      !this.isParserInsideARecordTag
      || this.currentRecordAttribute === undefined
      || this.currentRecordAttribute === 'transactionReference'
    ) return;

    this.currentRecordBeingParsed[this.currentRecordAttribute] = text;
  }

  private handleCloseTag({ name }: TagForOptions<GetSaxesParserOptions<typeof this.xmlParser>>): void {
    if (name === RECORDS_TAG) {
      this.isParserInsideRecordsTag = false;
    }

    if (name === RECORD_TAG) {
      this.isParserInsideARecordTag = false;
      this.recordStream$$.next({ ...this.currentRecordBeingParsed });
      this.currentRecordBeingParsed = {};
    }

    if ([ACCOUNT_NUMBER_TAG, DESCRIPTION_TAG, START_BALANCE_TAG, MUTATION_TAG, END_BALANCE_TAG].includes(name)) {
      this.currentRecordAttribute = undefined;
    }
  }

  private handleError(): void {
    this.recordStream$$.error(new MalformedRecord());
  }
}
import { lastValueFrom, reduce } from "rxjs";
import { XMLCustomerStatementRecordParser } from "./XMLCustomerStatementRecordParser";
import { RawCustomerStatementRecord } from "@/model/RawCustomerStatementRecord";
import { MalformedRecord } from "./errors/MalformedRecord";

const collector = () => reduce<RawCustomerStatementRecord, RawCustomerStatementRecord[]>((acc, item) => [...acc, item], []);
const makeFile = (xml: string) => new File([xml], 'records.xml', {
  type: 'application/xml'
});

describe('XMLCustomerStatementRecordParser tests', () => {
  it('if the XML doesn\'t contain a records tag, no record should be supplied to the stream', async () => {
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<not-a-record>',
      '</not-a-record>'
    ].join('');

    const parser = new XMLCustomerStatementRecordParser(makeFile(xml));

    const records = await lastValueFrom(
      parser.loadRecords().pipe(collector())
    );

    expect(records).toEqual([]);
  });

  it('if the XML contains a records tag, but no record tag, no record should be supplied to the stream', async () => {
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<records>',
      '</records>'
    ].join('');

    const parser = new XMLCustomerStatementRecordParser(makeFile(xml));

    const records = await lastValueFrom(
      parser.loadRecords().pipe(collector())
    );

    expect(records).toEqual([]);
  });

  it('if the XML contains a records tag, it should be parsed correctly', async () => {
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<records>',
      '<record reference="138932">',
      '<accountNumber>NL90ABNA0585647886</accountNumber>',
      '<description>Flowers for Richard Bakker</description>',
      '<startBalance>94.9</startBalance>',
      '<mutation>+14.63</mutation>',
      '<endBalance>109.53</endBalance>',
      '</record>',
      '</records>'
    ].join('');

    const parser = new XMLCustomerStatementRecordParser(makeFile(xml));

    const records = await lastValueFrom(
      parser.loadRecords().pipe(collector())
    );

    expect(records).toEqual([
      {
        transactionReference: '138932',
        accountNumber: 'NL90ABNA0585647886',
        description: 'Flowers for Richard Bakker',
        startBalance: '94.9',
        mutation: '+14.63',
        endBalance: '109.53'
      },
    ] as RawCustomerStatementRecord[]);
  });

  it('if the XML is malformed, it should throw MalformedRecord error', async () => {
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<records>',
      '<record reference="138932">',
      '<accountNumber>NL90ABNA0585647886</accountNumber>',
      '<description>Flowers for Richard Bakker</description>',
      '<startBalance>94.9</startBalance>',
      '<mutation>+14.63</mutation>',
      '<endBalance>109.53</endBalance>',
      '</records>',
      '</record>',
    ].join('');

    const parser = new XMLCustomerStatementRecordParser(makeFile(xml));

    const records = parser.loadRecords().pipe(collector());

    await expect(() => lastValueFrom(records)).rejects.toThrow(MalformedRecord);
  });

  it('if a record does not contain some values, they should be undefined', async () => {
    const noAccountNumberAndNoMutation = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<records>',
      '<record reference="138932">',
      '<description>Flowers for Richard Bakker</description>',
      '<startBalance>94.9</startBalance>',
      '<endBalance>109.53</endBalance>',
      '</record>',
      '</records>'
    ].join('');

    const parser = new XMLCustomerStatementRecordParser(makeFile(noAccountNumberAndNoMutation));

    const records = await lastValueFrom(
      parser.loadRecords().pipe(collector())
    );

    expect(records).toEqual([
      {
        transactionReference: '138932',
        accountNumber: undefined,
        description: 'Flowers for Richard Bakker',
        startBalance: '94.9',
        mutation: undefined,
        endBalance: '109.53'
      },
    ] as RawCustomerStatementRecord[]);
  });

  it('if a record does not have a reference, the resulting record should have its `transactionReference` to be undefined', async () => {
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<records>',
      '<record>',
      '<accountNumber>NL90ABNA0585647886</accountNumber>',
      '<description>Flowers for Richard Bakker</description>',
      '<startBalance>94.9</startBalance>',
      '<mutation>+14.63</mutation>',
      '<endBalance>109.53</endBalance>',
      '</record>',
      '</records>'
    ].join('');

    const parser = new XMLCustomerStatementRecordParser(makeFile(xml));

    const records = await lastValueFrom(
      parser.loadRecords().pipe(collector())
    );

    expect(records).toEqual([
      {
        transactionReference: undefined,
        accountNumber: 'NL90ABNA0585647886',
        description: 'Flowers for Richard Bakker',
        startBalance: '94.9',
        mutation: '+14.63',
        endBalance: '109.53'
      },
    ] as RawCustomerStatementRecord[]);
  });
});
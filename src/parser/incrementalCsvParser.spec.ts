import { CSVParser } from 'incremental-csv-parser';

describe('incremental-csv-parser library tests', () => {
  it('should parse items when they provided chunk by chunk', () => {
    const results: unknown[] = [];

    const parser = new CSVParser(row => results.push(row));

    parser.process('a,b');
    parser.process(',c,d,e');
    parser.process('\n');
    parser.process('1,2');
    parser.process(',3,4,5');
    parser.process('\n');

    expect(results).toEqual([
      {
        a: '1',
        b: '2',
        c: '3',
        d: '4',
        e: '5'
      }
    ]);
  });

  it('should not produce item if not enough chunk is provided', () => {
    const results: unknown[] = [];

    const parser = new CSVParser(row => results.push(row));

    parser.process('a,b');
    parser.process(',c,d,e');
    parser.process('\n');
    parser.process('1,2');

    expect(results).toEqual([]);
  });
});

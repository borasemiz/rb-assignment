import { CSVParser } from 'incremental-csv-parser';

describe('incremental-csv-parser library tests', () => {
  it('should parse items when they provided chunk by chunk', async () => {
    const results: unknown[] = [];

    const parser = new CSVParser(row => results.push(row));

    await parser.process('a,b');
    await parser.process(',c,d,e');
    await parser.process('\n');
    await parser.process('1,2');
    await parser.process(',3,4,5');
    await parser.process('\n');

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

  it('should not produce item if not enough chunk is provided', async () => {
    const results: unknown[] = [];

    const parser = new CSVParser(row => results.push(row));

    await parser.process('a,b');
    await parser.process(',c,d,e');
    await parser.process('\n');
    await parser.process('1,2');

    expect(results).toEqual([]);
  });

  it('should throw error if there is a malformed row', async () => {
    const results: unknown[] = [];

    
    const parser = new CSVParser(row => results.push(row));

    await parser.process('a,b');
    await parser.process(',c,d,e');
    await parser.process('\n');
    

    await expect(async () => parser.process('1,2\n')).rejects.toThrow();
  });
});

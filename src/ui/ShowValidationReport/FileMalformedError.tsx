export function FileMalformedError() {
  return (
    <p className="my-4 bg-red-900 text-white">
      The file is either corrupted or its contents not correctly formatted. Therefore can&apos;t validate its entries.
    </p>
  );
}

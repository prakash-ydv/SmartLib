const xlsx = require("xlsx");

const excelToJSON = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const bookMap = new Map();

  for (const row of rows) {
    const key = `${row.TitleDesc}-${row.SubjectName}`;

    if (!bookMap.has(key)) {
      bookMap.set(key, {
        title: row.SubjectName,
        desc: row.TitleDesc,
        author: row.AuthNames,
        accNos: [],
        supplier: row.supplier,
        edition: row.Year,
        language: row.TitleLanguage,
        college: row.GenAccNo,
        department : "agriculture",
        branch:"agriculture",
        subBranch: "",
        year:0,
        bookImage: row.IMG,
        isbNo: row.ISBN,
        totalCopies: 0,
      });
    }

    const book = bookMap.get(key);

    book.accNos.push(row.ACCNo);
    book.totalCopies += 1;
  }

  return Array.from(bookMap.values());
};

module.exports = excelToJSON;

const csv = require('csvtojson');
const fs = require('fs');
const filePath = process.argv[2];

(async () => {
  try {
    const linksData = await csv().fromFile(filePath);

    fs.writeFile(
      'links_data.json',
      JSON.stringify(linksData, null, 4),
      (err) => {
        if (err) {
          throw err;
        }
        console.log('CSV converted successfully!');
      }
    );
  } catch (err) {
    console.log(err);
  }
})();

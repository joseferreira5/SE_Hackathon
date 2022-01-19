const csv = require('csvtojson');
const fs = require('fs');

(async () => {
  try {
    const linksData = await csv().fromFile('SFDC_Example.csv');
    console.log(linksData);

    fs.writeFile(
      'links_data.json',
      JSON.stringify(linksData, null, 4),
      (err) => {
        if (err) {
          throw err;
        }
        console.log('JSON array is saved.');
      }
    );
  } catch (err) {
    console.log(err);
  }
})();

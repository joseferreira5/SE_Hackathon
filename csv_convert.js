const csv = require('csvtojson');

(async () => {
  try {
    const linksData = await csv().fromFile('test.csv');
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

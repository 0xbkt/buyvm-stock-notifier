const client = require('superagent');
const $ = require('cheerio');

(async () => {
  const resp = await client.get('https://my.frantech.ca/cart.php?gid=39');

  const sliceSel = $('#product3 .package-qty', resp.text);
  const sliceText = sliceSel.text().trim() || "??? Available";

  const availableCount = parseInt(sliceText.split(' ')[0], 10);

  console.log('Selector text: %o', sliceText);
  console.log('Inferred count: %o', availableCount);

  if(availableCount > 0 || isNaN(availableCount)) {
    await client.post('https://platform.tillmobile.com/api/send')
      .query({
        username: process.env.TILL_ID,
        api_key: process.env.TILL_KEY,
      })
      .send({
        phone: [process.env.PHONE_NUMBER],
        text: "Slice is available dude. Rush, rush, rush!",
      });
  }
})();

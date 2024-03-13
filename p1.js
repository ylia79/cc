const express = require('express');
const axios = require('axios');

const app = express();

const exchangeRateApi = 'https://api.exchangerate-api.com/v4/latest/INR';

app.get('/convert/:from/to/:to/:amount', async (req, res) => {
  const { from, to, amount } = req.params;

  try {
    const response = await axios.get(exchangeRateApi);
    const exchangeRates = response.data.rates;

    if (!exchangeRates[from] || !exchangeRates[to]) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }

    const exchangeRateFrom = exchangeRates[from];
    const exchangeRateTo = exchangeRates[to];
    const convertedAmount = ((amount / exchangeRateFrom) * exchangeRateTo).toFixed(2);
    res.json({ convertedAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while converting currency' });
  }
});
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

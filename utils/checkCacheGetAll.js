const checkCache = async (req, res, client, model, query = {}) => {
  if (!req.originalUrl) {
    res.status(201).json({ dbData });
  }
  const key = req.originalUrl.split("/api/v1/")[1];
  const cache = await client.get(key);
  if (cache) {
    res.status(201).json(JSON.parse(cache));
  } else {
    const data = await model.find(query);
    client.set(key, JSON.stringify(data));
    res.status(201).json(data);
  }
};

module.exports = {
  checkCache
};

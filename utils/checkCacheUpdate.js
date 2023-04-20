const checkCacheUpdate = async (req, res, client, model, query = {}) => {
  if (!req.originalUrl) {
    res.status(201).json({ dbData });
  }

  const key = req.originalUrl.split("/api/v1/")[1];
  const cache = await client.get(key);

  let filteredObjects = JSON.parse(cache).filter((item) => item.id !== req.id);
  filteredObjects.push(req.body);

  client.set(key, JSON.stringify(filteredObjects));

  await model.findOneAndUpdate(query, req.body, {
    new: true,
    runValidators: true
  });

  res.status(203).json({ msg: "Announcement edited!" });
};

module.exports = {
  checkCacheUpdate
};

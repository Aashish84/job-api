const notFound = (req, res) => {
  // 404 - not found status code
  res.status(404).json({ msg: "page not found" });
};

module.exports = notFound;

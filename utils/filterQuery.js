const filterQuery = (filters, data) => {
  // const filters = req.query;
  // const photos = await Photo.find({});
  const filterData = filters
    ? data.filter((item) => {
        let isValid = true;
        for (key in filters) {
          // console.log(key, photo[key], filters[key]);
          isValid = isValid && item[key] == filters[key];
        }
        return isValid;
      })
    : data;
  return filterData;
};
module.exports = { filterQuery };

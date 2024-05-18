class apiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryStrCopy = { ...this.queryStr };
    const removeStr = ["keyword", "limit", "page"];
    removeStr.forEach((rmvstr) => delete queryStrCopy[rmvstr]);
    let qryStr = JSON.stringify(queryStrCopy);
    qryStr = qryStr.replace(/\b(gt|gte|lt|lte)/g, (match) => `$${match}`);
    this.query.find(JSON.parse(qryStr));
    return this;
  }
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = apiFeatures;

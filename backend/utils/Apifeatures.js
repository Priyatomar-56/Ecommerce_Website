class Apifeatures { 
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
        
    }
    search() { 
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword, // finding keyword in the database mongodb, regex is the regualr expression feature in mongodb
                $options:"i", //case insensitive
            }
        } : {}
        // console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
        
    }
    filter() { 
        const queryCopy = { ...this.queryStr };// to take it as not as refernce as in javascript every object pass as reference
        
       
        // removing some fields  for category

        const removeField = ["keyword", "page", "limit"];
        removeField.forEach((key) => delete queryCopy[key]);

        // Filter for Price and rating

        // convert queryCopy to string
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);
    
  
        // convert queryStr back to json using json parse
        this.query = this.query.find(JSON.parse(queryStr));
        return this;


    }
    pagination(ResultPerPage) { 
        const currentPage = Number(this.queryStr.page) || 1;
        const Skip = ResultPerPage * (currentPage - 1); //skip images that will skip when we change the page
        
        this.query = this.query.limit(ResultPerPage).skip(Skip);
        return this;
    }
}
module.exports = Apifeatures;
class APIfeatures {
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        let keyword = this.queryStr.keyword?{
            name:{
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }:{};

        this.query.find({...keyword});
        return this
    }

    filter(){
        let queryStrCopy={...this.queryStr};
        const removeFields=['keyword','limit','page']
        removeFields.forEach(field=>delete queryStrCopy[field]); 

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(lt|lte|gt|gte)/g, match=> `$${match}`)
        
        this.query.find(JSON.parse(queryStr));
        return this
    }

    paginate(ProdPerPage){
        const currentPage = Number(this.queryStr.page)||1;
        let skip = ProdPerPage * (currentPage-1)
        this.query.limit(ProdPerPage).skip(skip);
        return this
    }
}

module.exports = APIfeatures;
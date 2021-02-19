const dummy =(blogs)=>{
    return 1
}

const totalLikes =(blogs)=>{
    return blogs.length===0 ? 0 : blogs.reduce((current,obj)=>current+obj.likes,0)     
}

const favoriteBlog =(blogs)=>{
    if(blogs.length===0){
        return {}
    }else{
        const topFavourite = blogs.reduce((prev,current)=> {
                if(prev.likes === current.likes){
                    return prev
                }else{
                    return   prev.likes > current.likes ? prev : current
                }
            
            },)
        return topFavourite
    }
    
}


const mostBlogs =(blogsList)=>{
    if(blogsList.length===0){
        return {}
    }else{
        //get an array of author
        const authors = blogsList.map(blog=>blog.author)
        //get an object {authorName: 2, authorName: 5} - count how many time that author name appear
        const countBlogs = authors.reduce((result,author)=>{
            result[author] = (result[author]||0)+1
            return result
        },{})
       //turn the object above to an array of object [{author: name, blogs:3},{author:name, blogs:5}]
        const authorsWithBlogsCountArr = Object.keys(countBlogs).map(key=>({author: key,blogs:countBlogs[key]}))
        //find the author with the most blogs count
       const mostBlogs =  authorsWithBlogsCountArr.reduce((pre,current)=>{
            if(pre.blogs === current.blogs){
                return pre
            }else{
               
                return  pre.blogs > current.blogs ? pre : current
            }
        })
        return mostBlogs
    }
    
}

module.exports={
    dummy,totalLikes,favoriteBlog,mostBlogs
}
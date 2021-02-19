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
		//get an array of author like [a,b,c,a,b,b, c, c...]
		const authors = blogsList.map(blog=>blog.author)
		//count how many time an author name appears, returned object {authorName: 2, authorName: 5} 
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

const mostLikes =(blogsList)=>{
    if(blogsList.length===0){
        return {}
    }else{
        const authorLikes = blogsList.reduce((acc,item)=>{
            const {author,likes} = item
            return {...acc,[author]:(acc[author] || 0)+likes}
        },{}) //return object {author: likes, author likes,...}

        let authorLikesArr = []
        for(const[key,value] of Object.entries(authorLikes)){
            authorLikesArr = [...authorLikesArr, {author: key, likes: value}]
        }// turn the object to an array of object [{author:...,likes:...},{author:...,likes:...},...]

        const result = authorLikesArr.reduce((prev,current)=>{
            if(prev.likes === current.likes){
                return prev
            }
            return prev.likes > current.likes ? prev :current
        })//get the object with highest likes
        
        return result
    }
	
}

module.exports={
	dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes
}
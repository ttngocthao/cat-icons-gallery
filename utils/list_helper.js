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
            
            })
        return topFavourite
    }
    
}

module.exports={
    dummy,totalLikes,favoriteBlog
}
const { describe } = require('yargs')
const listHelper = require('../utils/list_helper')


test('dummy returns one',()=>{
    const blogs=[]
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes',()=>{

    test('of empty list is zero',()=>{
        const blogs=[]
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that',()=>{
        const blogs =[    {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(5)
    })

    test('of a bigger list is calculated right',()=>{
        const blogs =[
            {title: 'This is 1st blog', author: 'Thao', url: 'url',likes: 6 },
            {title: 'This is 2nd blog', author: 'Thao', url: 'url',likes: 4 },
            {title: 'This is 3rd blog', author: 'Thao', url: 'url',likes: 2 },
            {title: 'This is 4th blog', author: 'Thao', url: 'url',likes: 3 },
        ]
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(15)
    })
})

describe('finds out which blog has most likes',()=>{

    test('empty blog list',()=>{
        const blogs=[]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({})
    })

    test('blog list has 2 items, returns the blog with highest likes',()=>{
        const blogs = [
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
            },
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 6
            },
        ]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
            })
    })

    test('blog list has more than 2 items, returns the blog with highest likes',()=>{
        const blogs = [
             {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 4
            },
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
            },
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 6
            },
        ]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
            })
    })

    test('blog list has more than 2 items and many top favorites, returns one of them',()=>{
         const blogs = [
            {
                title: "First",
                author: "Edsger ",
                likes: 12
            },
            {
                title: "Second",
                author: " Dijkstra",
                likes: 12
            },
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 6
            },
        ]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({
                title: "First",
                author: "Edsger ",
                likes: 12
            })
    })
})

describe('finds author who has the largest amount of blogs in an array of blogs',()=>{

    test('returns empty if an array of blogs is empty',()=>{

    })

    test('returns an object (with author and blogs) of the author who has the largest amount of blogs',()=>{

    })

    test('if there are many top blogges, return any of them',()=>{
        
    })
})
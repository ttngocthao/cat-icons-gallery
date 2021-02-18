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
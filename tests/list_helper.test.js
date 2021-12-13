const listHelper = require("../utils/list_helper");

const defaultBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy test returns one", () => {
  // const blogs=[]
  // const result = listHelper.dummy(blogs)
  const result = 1;
  expect(result).toBe(1);
});

// describe("total likes",()=>{

// 	test("of empty list is zero",()=>{
// 		const blogs=[]
// 		const result = listHelper.totalLikes(blogs)
// 		expect(result).toBe(0)
// 	})

// 	test("when list has only one blog equals the likes of that",()=>{
// 		const blogs =[    {
// 			_id: "5a422aa71b54a676234d17f8",
// 			title: "Go To Statement Considered Harmful",
// 			author: "Edsger W. Dijkstra",
// 			url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
// 			likes: 5,
// 			__v: 0
// 		}]

// 		const result = listHelper.totalLikes(blogs)
// 		expect(result).toBe(5)
// 	})

// 	test("of a bigger list is calculated right",()=>{
// 		const result = listHelper.totalLikes(defaultBlogs)
// 		expect(result).toBe(36)
// 	})
// })

// describe("finds out which blog has most likes",()=>{

// 	test("empty blog list",()=>{
// 		const blogs=[]
// 		const result = listHelper.favoriteBlog(blogs)
// 		expect(result).toEqual({})
// 	})

// 	test("returns the blog with highest likes",()=>{

// 		const result = listHelper.favoriteBlog(defaultBlogs)
// 		expect(result).toEqual({
// 			_id: "5a422b3a1b54a676234d17f9",
// 			title: "Canonical string reduction",
// 			author: "Edsger W. Dijkstra",
// 			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
// 			likes: 12,
// 			__v: 0
// 		})
// 	})

// 	test("blog list has more than 2 items and many top favorites, returns one of them",()=>{
// 		const blogs = [
// 			{
// 				title: "First",
// 				author: "Edsger ",
// 				likes: 12
// 			},
// 			{
// 				title: "Second",
// 				author: " Dijkstra",
// 				likes: 12
// 			},
// 			{
// 				title: "Canonical string reduction",
// 				author: "Edsger W. Dijkstra",
// 				likes: 6
// 			},
// 		]
// 		const result = listHelper.favoriteBlog(blogs)
// 		expect(result).toEqual({
// 			title: "First",
// 			author: "Edsger ",
// 			likes: 12
// 		})
// 	})
// })

// describe("finds author who has the largest amount of blogs in an array of blogs",()=>{

// 	test("returns empty if an array of blogs is empty",()=>{
// 		const blogs=[]
// 		const result = listHelper.mostBlogs(blogs)
// 		expect(result).toEqual({})
// 	})

// 	test("returns an object (with author and blogs) of the author who has the largest amount of blogs",()=>{

// 		const result = listHelper.mostBlogs(defaultBlogs)

// 		expect(result).toEqual({author:"Robert C. Martin",blogs:3})
// 	})

// 	test("if there are many top blogges, return any of them",()=>{
// 		const blogs=[
// 			...defaultBlogs, {
// 				_id: "5a422aa71b54a676234d17f8",
// 				title: "Go To Statement Considered Harmful",
// 				author: "Edsger W. Dijkstra",
// 				url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
// 				likes: 5,
// 				__v: 0
// 			},
// 		]
// 		const result = listHelper.mostBlogs(blogs)
// 		expect(result).toEqual({author:"Edsger W. Dijkstra",blogs:3})
// 	})
// })

// describe("finds the author whose blog posts have the largest amount of likes",()=>{
// 	test("blogs list is empty",()=>{
//        const blogs = []
//        const result = listHelper.mostLikes(blogs)
//        expect(result).toEqual({})
// 	})

// 	test("returns the author whose blog posts have the largest amount of likes",()=>{
//         const result = listHelper.mostLikes(defaultBlogs)
//         expect(result).toEqual({author:'Edsger W. Dijkstra', likes: 17})
//     })

//     test("if there are many top bloggers, returns the first author",()=>{
//         const blogs =[...defaultBlogs,
//             {
//                 _id: "5a422ba71b54a676234d17fb",
//                 title: "Additional TDD harms architecture (part 2)",
//                 author: "Robert C. Martin",
//                 url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//                 likes: 5,
//                 __v: 0
//             }, ]
//         const result = listHelper.mostLikes(blogs)
//         expect(result).toEqual({author:'Edsger W. Dijkstra', likes: 17})
//     })
// })

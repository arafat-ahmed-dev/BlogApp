import React, { useEffect, useState } from 'react'
import appwriteService from "../AppWrite/config"
import { Container, PostCard } from "../Component"


const Home = () => {
  // const authStatus = useSelector((state) => state.auth.userData.userData.name);
  // console.log(authStatus);
  const [posts, setPosts] = useState([])
  appwriteService.getPosts([]).then((posts) => {
    if (posts) {
        setPosts(posts.documents)
    }
})
  if (posts.length === 0) {
    return (
      <div className='w-full py-8 mt-4 text-center'>
        <Container>
          <div className='flex flex-wrap'>
            <div className='p-2 w-full'>
              <h1 className='text-3xl font-bold hover:text-gray-500'>
                Login to read post
              </h1>
            </div>
          </div>
        </Container>
      </div>
    )
  }
  return (
    <div className='w-full py-8'>
      <Container>
        <div className='w-full flex flex-wrap justify-center'>
          {posts.map((post) => (
            <div key={post.$id} className='p-2 max-w-[300px] flex flex-wrap'>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default Home
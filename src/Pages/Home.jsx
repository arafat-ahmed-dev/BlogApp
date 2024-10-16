import React,{useEffect, useState} from 'react'
import appwriteService from "../AppWrite/config"
import {Container, PostCard} from "../Component"

export const Home = () => {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        appwriteService
          .getPosts()
          .then((posts) => {
            if(posts) {setPosts(posts.documents)}
          })
          .catch((error) => {
            console.log(error)
          })
    }, [])

    if (posts.length == 0) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='text-3xl font-bold hover:text-gray-500'>Login to read post</h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
  return (
    <div className='w-full py-8'>
      <Container>
        <div className='flex flex-wrap'>
          {posts.map((post) => (
            <div key={post.$id} className='p-2 w-1/4'>
              <PostCard {...post}/>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

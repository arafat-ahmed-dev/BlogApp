import React, {useEffect, useState} from 'react'
import appwriteService from "../AppWrite/config"
import {Container, PostCard} from "../Component"

const Allpost = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
      appwriteService
        .getAllPosts()
        .then((data) => {
          setPosts(data)
        })
        .catch((error) => {
          console.log(error)
        })
    },[])
    appwriteService.getPosts([]).then((posts)=> {
        if (posts) {
            setPosts(posts.documents)
        }
    }
    )
  return (
    <div className='w-full py-8'>
      <Container>
      <div className='flex flex-wrap'>
      {posts.map((post) => (
            <div key ={post.$id} className='p-2 w/2'>
          <PostCard  post={post} />
            </div>
        ))}
      </div>        
      </Container>
    </div>
  )
}
export default Allpost
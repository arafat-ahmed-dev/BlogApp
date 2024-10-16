import React,{useEffect, useState} from 'react'
import {Container, PostForm} from "../Component"
import appwriteService from "../AppWrite/config"
import { useNavigate, useParams } from 'react-router-dom'

const EditPost = () => {
    const [post, setPost] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((response) => {
                if (response) {
                    setPost(response)
                }
            })
        }else{
            navigate("/")
        }
    },[])

  return post? (
    <Container>
        <PostForm post={post} />
    </Container>
  ) : (
    null
  )
}

export default EditPost
import React from "react";
import appwriteService from "../AppWrite/config";
import { Link } from "react-router-dom";

function PostCard({ slug, title, featuredImage }) {

  return (
    <Link to={`/post/${slug}`}>
      <div className='w-full bg-gray-100/80 rounded-xl p-4 '>
        <div className='w-full justify-center mb-4'>
          <img src={appwriteService.getFilePreview(featuredImage)} alt={title}
            loading='lazy'
            className='rounded-xl w-[310px] h-[20vh] object-cover'
            />
        </div>
        <h2
          className='font-semibold text-[18px] md:text-[20px]'
        >
        {title}
        </h2>
      </div>
    </Link>
  )
}


export default PostCard


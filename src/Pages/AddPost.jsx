import React, { useState, useEffect } from 'react';
import { Container } from "../Component";
import PostForm from "../Component/Post-form/PostForm";
import { CirclesWithBar } from 'react-loader-spinner';

const AddPost = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay (e.g., fetching data or resources)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2-second delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='py-8'>
      <Container>
        {loading ? (
          <div className="flex justify-center items-center h-[60vh">
            <CirclesWithBar 
              height="80" 
              width="80" 
              color="#4fa94d" 
              wrapperStyle={{}}
              visible={true}
              ariaLabel='loading-indicator'
            />
          </div>
        ) : (
          <PostForm />
        )}
      </Container>
    </div>
  );
}

export default AddPost;

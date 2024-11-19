import React, { useState, useEffect } from 'react';
import { Container } from "../Component";
import PostForm from "../Component/Post-form/PostForm";

const AddPost = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='py-8'>
      <Container>
        {loading ? (
          <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                </div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                </div>
                <div className="flex justify-end space-x-2">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PostForm />
        )}
      </Container>
    </div>
  );
}

export default AddPost;

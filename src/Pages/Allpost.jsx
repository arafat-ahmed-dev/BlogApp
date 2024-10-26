import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../Component";
import appwriteService from "../AppWrite/config";
import { useSelector } from "react-redux";

function AllPosts() {
  const authStatus = useSelector((state) => state.auth.userData.userData.$id);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts([]);
        if (response) {
          setPosts(response.documents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const userPosts = posts.filter((post) => post.userId === authStatus);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="w-full flex flex-wrap justify-center">
          {userPosts.map((post) => (
            <div
              key={post.$id}
              className="p-2 w-[305px] sm:w-[320px] md:max-w-[310px] flex flex-wrap"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;

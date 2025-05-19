import { useEffect, useState } from 'react';

type Post = {
  id: string;
  title: string;
  slug: string;
};

export default function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/latest-posts')
      .then(res => res.json())
      .then(data => setPosts(data.data || []));
  }, []);

  console.log('posts',posts)

  return (
    <div className="card">
      <h3>Latest Posts</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`https://your-publication.beehiiv.com/p/${post.slug}`} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

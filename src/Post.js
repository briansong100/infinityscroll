import React from 'react';

const Post = React.forwardRef(({ post }, ref) => {

  return ref ? (
    <article ref={ref}>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p>Post ID: {post.id}</p>
    </article>
  ) : (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p>Post ID: {post.id}</p>
    </article>
  );
});

export default Post;

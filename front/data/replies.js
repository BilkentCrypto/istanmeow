module.exports = {
  getReplies: async (token, postId) =>
    (
      await fetch(
        `${process.env.NEXT_PUBLIC_FRONT_URL}/api/contracts/posts/replies/${postId}`,
        {
          credentials: 'include',
          headers: token
            ? {
                token: token,
              }
            : {},
        },
      )
    ).json(),
  getPost: async (token, address, post) =>
    (
      await fetch(
        `${process.env.NEXT_PUBLIC_FRONT_URL}/api/contracts/posts/${address}/${post}`,
        {
          credentials: 'include',
          headers: token
            ? {
                token: token,
              }
            : {},
        },
      )
    ).json(),
};

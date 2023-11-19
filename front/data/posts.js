module.exports = {
  getPosts: async (token, address) =>
    (
      await fetch(
        `${process.env.NEXT_PUBLIC_FRONT_URL}/api/contracts/posts/${address}`,
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

const CONFIG = {
  node_env: Bun.env.NODE_ENV || "development",
  jwt_public: Bun.env.JWT_PUBLIC,
  jwt_private: Bun.env.JWT_PRIVATE,
};

export default CONFIG;

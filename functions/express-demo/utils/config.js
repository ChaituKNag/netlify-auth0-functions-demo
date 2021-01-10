exports.BASE_URL= process.env.NODE_ENV !== 'development' 
    ? 'http://localhost:8888'
    : process.env.BASE_URL;
exports.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
exports.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
exports.SECRET = process.env.SECRET || 'SUPERSECRET';
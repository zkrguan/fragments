module.exports.validTypes = [
    `text/plain`,
    `application/json`,
    `text/markdown`,
    `text/html`,
    /*
   Currently, only text/plain is supported. Others will be added later.
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
  */
];

module.exports.supportedConversion = {
    'text/plain': ['.txt'],
    'text/markdown': ['.md', '.html', '.txt'],
    'text/html': ['.html', '.txt'],
    'text/csv': ['.csv', '.txt', '.json'],
    'application/json': ['.json', '.txt'],
    'image/png': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    'image/jpeg': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    'image/webp': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    'image/avif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    'image/gif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
};

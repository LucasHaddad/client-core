module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.*"
  ],
  "swDest": "dist/sw.js",
  "swSrc": "src/sw.js",
  "globIgnores": [
    "../workbox-config.js"
  ],
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024 //4MB
};
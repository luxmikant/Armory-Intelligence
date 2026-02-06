/**
 * Patches fs.readlink/readlinkSync to handle exFAT EISDIR errors.
 * exFAT returns EISDIR instead of EINVAL for non-symlink files,
 * which breaks webpack's snapshot resolution.
 * 
 * Usage: node --require ./fix-readlink.js <script>
 * Or via NODE_OPTIONS="--require ./fix-readlink.js"
 */
const fs = require('fs');

const originalReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function patchedReadlinkSync(path, options) {
  try {
    return originalReadlinkSync.call(fs, path, options);
  } catch (err) {
    if (err.code === 'EISDIR') {
      // Convert EISDIR to EINVAL so webpack treats it as "not a symlink"
      const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      newErr.code = 'EINVAL';
      newErr.errno = -4071;
      newErr.syscall = 'readlink';
      newErr.path = path;
      throw newErr;
    }
    throw err;
  }
};

const originalReadlink = fs.readlink;
fs.readlink = function patchedReadlink(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  originalReadlink.call(fs, path, options, (err, linkString) => {
    if (err && err.code === 'EISDIR') {
      const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      newErr.code = 'EINVAL';
      newErr.errno = -4071;
      newErr.syscall = 'readlink';
      newErr.path = path;
      return callback(newErr);
    }
    callback(err, linkString);
  });
};

// Also patch promises API if available
if (fs.promises) {
  const originalReadlinkPromise = fs.promises.readlink;
  fs.promises.readlink = async function patchedReadlinkPromise(path, options) {
    try {
      return await originalReadlinkPromise.call(fs.promises, path, options);
    } catch (err) {
      if (err.code === 'EISDIR') {
        const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        newErr.code = 'EINVAL';
        newErr.errno = -4071;
        newErr.syscall = 'readlink';
        newErr.path = path;
        throw newErr;
      }
      throw err;
    }
  };
}

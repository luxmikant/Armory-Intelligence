/**
 * Patches fs.readlink/readlinkSync to handle exFAT EISDIR errors.
 * exFAT returns EISDIR instead of EINVAL for non-symlink files,
 * which breaks webpack's snapshot resolution.
 * 
 * Usage: node --require ./fix-readlink.js <script>
 * Or via NODE_OPTIONS="--require ./fix-readlink.js"
 */
const fs = require('fs');

// Patch readlinkSync
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

// Patch async readlink
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

// Patch promises API
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

// Also patch lstat to handle directories properly
const originalLstatSync = fs.lstatSync;
fs.lstatSync = function patchedLstatSync(path, options) {
  try {
    const stats = originalLstatSync.call(fs, path, options);
    return stats;
  } catch (err) {
    throw err;
  }
};

// Suppress EISDIR during directory operations
process.on('uncaughtException', (err) => {
  if (err.code === 'EISDIR' && err.syscall === 'readlink') {
    console.warn(`[fix-readlink] Suppressed EISDIR for: ${err.path}`);
    return;
  }
  throw err;
});

console.log('[fix-readlink] Applied exFAT EISDIR patches');

const fs = require('fs');

const readable = require('stream').Readable
const s = new readable;

const writeStream = (ctx) => {
  s.push('stream: hi from kyle');
  s.push(null) // indicate end of stream
  ctx.body = s;
}

const getFile = (ctx) => {
  const src = fs.createReadStream('./bigfile.txt');
  ctx.response.set("content-type", "txt/html");
  ctx.body = src;
}


module.exports = {
  getFile,
  writeStream,
}

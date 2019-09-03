const fs = require('fs');

const readable = require('stream').Readable
const s = new readable;

const writeStream = (ctx) => {
  s.push('stream: hi from kyle');
  s.push(null) // indicate end of stream
  ctx.body = s;
}

const getFile = async (ctx) => {
  ctx.response.set("content-type", "txt/html");
  const src = await fs.createReadStream('./bigfile.txt');
  ctx.body = src;
}


module.exports = {
  getFile,
  writeStream,
}

export default function request(obj, cb) {
  process.nextTick(() => {
    const err = obj.url.match(/error/i) ? true : false;
    cb(err, { statusCode: 200 }, {})
  })
}

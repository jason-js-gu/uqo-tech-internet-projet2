var http = require("http");

var httpGetJSON = ( url, cb ) =>
  http.get( url, res => ( chunks =>
    res.setEncoding( "utf8" )
    .on('data', chunk => chunks.push(chunk))
    .on('end', () => {
      try { 
        cb(null, JSON.parse( chunks.join('') ));
      } catch (err) { cb(err); }
    }))([]))
  .on('error', cb);

module.exports = httpGetJSON;

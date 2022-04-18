# http-get-json

    var get = require("http-get-json");
    get("http://localhost:8080/my.json", (err, data) => {
      if (err) return console.error(error);
      console.log(data);
    });
    


const express = require('express');

const app = express();

app.get("/test", (request,response) => {
    return response.send({message: "Hello World - Test"});
});

app.listen(3333);
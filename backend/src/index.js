const express = require('express');
const { v4 } = require("uuid")

const app = express();
app.use(express.json());
const users = [];
/*
* cpf
* name
* id
* proofOfResidence
* proofOfIncome 
* statement[]
*/

app.post("/account", (request, response) => {
    const { cpf, name, proofOfResidence, proofOfIncome } = request.body;
    const userCpfValidator = users.some((user) => user.cpf === cpf);
    
    if(userCpfValidator){
        return response.status(400).json({error: "This user already exists. Please try another account or contact the support."})
    }

    users.push({
        cpf,
        name,
        id: v4(),
        proofOfResidence,
        proofOfIncome,
        statement: []
    });

    return response.status(201).send();
});

app.listen(3333);
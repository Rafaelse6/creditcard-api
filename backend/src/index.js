const express = require('express');
const { v4 } = require("uuid")

const app = express();
app.use(express.json());
const users = [];

function validateUserByCpf(request, response, next) {
    const { cpf } = request.headers;
    const user = users.find(user => user.cpf === cpf);

    if (!user) {
        return response.status(400).json({ error: "This user doesn't exist. Please, create an account or contact the support." });
    }

    request.user = user;

    return next();
}

app.post("/account", (request, response) => {
    const { cpf, name, proofOfResidence, proofOfIncome, limit } = request.body;
    const userCpfValidator = users.some((user) => user.cpf === cpf);

    if (userCpfValidator) {
        return response.status(400).json({ error: "This user already exists. Please try another account or contact the support." })
    }

    users.push({
        cpf,
        name,
        limit,
        id: v4(),
        proofOfResidence,
        proofOfIncome,
        statement: []
    });

    return response.status(201).send();
});

app.get("/statement", validateUserByCpf, (request, response) => {
    const { user } = request;
    return response.json(user.statement);
});

app.get("/account", validateUserByCpf, (request, response) => {
    const { user } = request;
    return response.json(user);
})

app.post("/loyaltyProgram", validateUserByCpf, (request, response) => {
    const { description, limit } = request.body;
    const { user } = request;
    const creditReceived = (limit * 5) / 100

    const loyalty = {
        limit,
        description,
        creditReceived,
        createdAt: new Date()
    }

    user.statement.push(loyalty);

    return response.status(201).send();
});

app.put("/account", validateUserByCpf, (request, response) => {
    const { limit } = request.body;
    const { user } = request;

    user.limit = limit;

    return response.status(201).send();
});

app.delete("/account", validateUserByCpf, (request, response) =>{
    const { user } = request;

    users.splice(user, 1);

    return response.status(200).json(users);
});


app.listen(3333);
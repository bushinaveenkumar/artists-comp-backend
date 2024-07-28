const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bodyParser=require("body-parser")
const app = express();

const dbPath = path.join(__dirname, "artists.db");
app.use(bodyParser.json())
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

///get transactions
app.get("/transactions/", async (request, response) => {
    const gettransactionsquery = `
      SELECT
        *
      FROM
        transactions;`;
    const transactionsArray = await db.all(gettransactionsQuery);
    response.send(transactionsArray);
  });

  //create a transaction
  app.post('/createtransaction/', async (request, response) => {
    try {
      const {date,type,amount,description, runningBalance} = request.body
  
      const addTransactionQuery = `
      INSERT INTO 
        transactions (date,type,amount,description, running_balance)
      VALUES 
        ("${date}","${type}",${amount}, "${description}", ${runningBalance});`
  
      db.run(addTransactionQuery)
      response.send('Player Added to Team')
    } catch (e) {
      console.log(`${e.message}`)
    }
  })

  //Update transaction
app.put('/transactions/:transactionsId/', async (request, response) => {
  const {transactionsId} = request.params
  const transactionDetails = request.body

  const {date,type,amount,description, runningBalance} = transactionDetails
  console.log(type)
  const updatePlayerQuery = `
  UPDATE
    transactions
  SET
    date="${date}"
    type = "${type}",
    amount = ${amount},
    description = "${description}"
    running_balance= "${runningBalance}"
  WHERE
    id = ${transactionsId};`

  db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

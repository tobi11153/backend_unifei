const express = require("express");
const { Client } = require('pg');
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

const app = express();

app.use(express.json())
app.use(cors());
app.use(bodyparser.json());

var conString = config.urlConnection;
var client = new Client(conString);
client.connect(function (err) {
    if (err) {
        return console.error('Não foi possível conectar ao banco.', err);
    }
    client.query('SELECT NOW()', function (err, result) {
        if (err) {
            return console.error('Erro ao executar a query.', err);
        }
        console.log(result.rows[0]);
    });
});

app.get("/", (req, res) => {
    console.log("Response ok.");
    res.send("Ok – Servidor disponível.");
});

app.get("/usuarios", (req, res) => {
    try {
        client.query("SELECT * FROM Usuarios", function
            (err, result) {
            if (err) {
                return console.error("Erro ao executar a qry de SELECT", err);
            }
            res.send(result.rows);
            console.log("Rota: get usuarios");
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/usuarios/:id", (req, res) => {
    try {
        console.log("Rota: usuarios/" + req.params.id);
        client.query(
            "SELECT * FROM Usuarios WHERE id = $1", [req.params.id],
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de SELECT id", err);
                }
                res.send(result.rows);
                //console.log(result);
            }
        );
    } catch (error) {
        console.log(error);
    }
});
app.delete("/usuarios/:id", (req, res) => {
    try {
    console.log("Rota: delete/" + req.params.id);
    client.query(
    "DELETE FROM Usuarios WHERE id = $1", [req.params.id], (err, result) => {
    if (err) {
    return console.error("Erro ao executar a qry de DELETE", err);
    } else {
    if (result.rowCount == 0) {
    res.status(404).json({ info: "Registro não encontrado." });
    } else {
    res.status(200).json({ info: `Registro excluído. Código: ${id}` });
    }
    }
    console.log(result);
    }
    );
    } catch (error) {
    console.log(error);
    }
   });
//Precisa ser a ultima função
app.listen(config.port, () =>
    console.log("Servidor funcionando na porta " + config.port)
);

module.exports = app; 

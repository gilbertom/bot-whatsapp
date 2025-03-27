const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const servidores = JSON.parse(fs.readFileSync("servidores.json", "utf8"));

function formatarResposta(nomes) {
  const respostas = nomes.map((nome) => {
    const servidor = servidores.find(
      (s) => s.nome.toLowerCase() === nome.toLowerCase()
    );

    if (!servidor) {
      return `Servidor: ${nome}\nStatus: não encontrado`;
    }

    const validacoes = servidor.validacoes.length
      ? servidor.validacoes.join(", ")
      : "nenhuma";

    const responsavel =
      servidor.responsavel === "eu" ? "você" : servidor.responsavel;

    return `Servidor: ${nome}\nResponsável: ${responsavel}\nValidações: ${validacoes}`;
  });

  return respostas.join("\n\n");
}

app.post("/webhook", (req, res) => {
  const mensagem = req.body.Body || "";
  const nomes = mensagem.split(",").map((n) => n.trim());

  const resposta = formatarResposta(nomes);
  res.set("Content-Type", "text/plain");
  res.send(resposta);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

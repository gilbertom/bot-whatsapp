const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const servidores = JSON.parse(fs.readFileSync("servidores.json", "utf8"));

function formatarResposta(nomes) {
  const respostas = nomes.map((nome) => {
    const encontrados = servidores.filter((s) =>
      s.nome.toLowerCase().includes(nome.toLowerCase())
    );

    if (encontrados.length === 0) {
      return `Servidor: ${nome}\nStatus: não encontrado`;
    }

    return encontrados
      .map((servidor) => {
        const validacoes = servidor.validacoes.length
          ? servidor.validacoes.join(", ")
          : "nenhuma";

        const responsavel =
          servidor.responsavel === "eu" ? "você" : servidor.responsavel;

        return `Servidor: ${servidor.nome}\nResponsável: ${responsavel}\nValidações: ${validacoes}`;
      })
      .join("\n\n");
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

app.get("/api/consulta", (req, res) => {
  const nomeBusca = req.query.nome;

  if (!nomeBusca) {
    return res.status(400).json({ erro: "Parâmetro 'nome' é obrigatório." });
  }

  // Quebra os nomes por vírgula ou espaço
  const nomes = nomeBusca
    .split(/[,\s]+/)
    .map((n) => n.trim())
    .filter((n) => n); // remove strings vazias

  const resultados = [];

  nomes.forEach((nome) => {
    const encontrados = servidores.filter((s) =>
      s.nome.toLowerCase().includes(nome.toLowerCase())
    );

    if (encontrados.length === 0) {
      resultados.push({
        nome,
        encontrado: false,
        mensagem: "Servidor não encontrado",
      });
    } else {
      encontrados.forEach((servidor) => {
        resultados.push({
          nome: servidor.nome,
          responsavel:
            servidor.responsavel === "eu" ? "você" : servidor.responsavel,
          validacoes: servidor.validacoes.length
            ? servidor.validacoes
            : ["nenhuma"],
          encontrado: true,
        });
      });
    }
  });

  res.json(resultados);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

# Bot de Servidores via WhatsApp

Este projeto é um bot simples em Node.js que recebe nomes de servidores via WhatsApp (integrado com Twilio) e retorna se o servidor é seu e quais validações devem ser feitas após atualizações.

## Como usar

1. Instale as dependências:
```
npm install
```

2. Inicie o servidor:
```
npm start
```

3. Use ngrok para expor sua porta local:
```
ngrok http 3000
```

4. Configure seu webhook no [Twilio Sandbox for WhatsApp](https://www.twilio.com/console/sms/whatsapp/sandbox)

5. Envie mensagens como:
```
srv-app-01, srv-db-03
```

E receba a resposta com os detalhes de cada servidor.

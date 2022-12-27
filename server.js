const http = require('http');
const fs = require('fs');
const qs = require('querystring');

// Génère un nombre aléatoire compris entre 1 et 100
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

// Traite la soumission de formulaire de l'utilisateur
function handleFormSubmission(request, response) {
  // Récupère la réponse de l'utilisateur
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString(); // convertit le chunk en chaîne de caractères
  });
  request.on('end', () => {
    const userResponse = qs.parse(body).userResponse;

    // Compare la réponse de l'utilisateur au nombre généré aléatoirement
    const randomNumber = getRandomNumber();
    let message;
    if (userResponse == randomNumber) {
      message = 'Vous avez gagné !';
    } else {
      message = 'Vous avez perdu. Le nombre était : ' + randomNumber;
    }

    // Affiche le résultat à l'utilisateur
    response.end(message);
  });
}

// Crée le serveur Web et écoute les requêtes entrantes
const server = http.createServer((request, response) => {
  if (request.method === 'POST') {
    handleFormSubmission(request, response);
  } else {
    // Affiche l'interface utilisateur
    fs.readFile('index.html', (err, data) => {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      response.end();
    });
  }
});

server.listen(8000);

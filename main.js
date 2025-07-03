// Arquivo que vai criar um usuário no banco de dados SQLite
// Certifique-se de que o servidor está rodando antes de executar este código

import axios from "axios";

const url = 'http://localhost:3001/api/users'; // URL do servidor que gerencia os usuários
/// Usuário que será criado (ainda não está completo, visto que o avatar será preenchido depois)
let user = {
  nome: 'Rick',
  avatar: '',
  bio: 'Software Developer'
}

// Faz uma requisição para a API do GitHub para obter o avatar do usuário
axios.get('https://api.github.com/users/queirozz8')
  .then(response => {
    user.avatar = response.data.avatar_url
    // Manda a requisição para criar o usuário no banco de dados. O corpo da requisição é o usuário que foi criado acima
    axios.post(url, user)
      .then(() => console.log('User created successfully:', user))
      .catch(error => console.error('Error creating user:', error));
  })
  .catch(error => {
    console.error('Error creating user:', error);
  });
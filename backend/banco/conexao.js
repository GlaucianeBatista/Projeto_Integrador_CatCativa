// Banco de dados em memória (simulado)
// Em produção, substituir por MongoDB, PostgreSQL, etc.

const db = {
    usuarios: [
        {
            id: '1',
            nome: 'Ana Escritora',
            email: 'ana@catbook.com',
            senha: '$2a$10$hashsimulado123', // senha: 123456
            avatar: null,
            bio: 'Amante de histórias românticas 🌸',
            seguidores: 128,
            seguindo: 45,
            historiasEscritas: 3,
            totalLikes: 567,
            dataCriacao: '2026-01-15T10:00:00Z',
            stickers: ['gatinho', 'coracao', 'estrela']
        },
        {
            id: '2',
            nome: 'Pedro Poeta',
            email: 'pedro@catbook.com',
            senha: '$2a$10$hashsimulado456',
            avatar: null,
            bio: 'Escrevendo versos desde 2020 ✍️',
            seguidores: 89,
            seguindo: 32,
            historiasEscritas: 5,
            totalLikes: 234,
            dataCriacao: '2026-02-01T14:30:00Z',
            stickers: ['poeta', 'lua', 'flor']
        }
    ],
    
    historias: [
        {
            id: '1',
            titulo: 'Please, Feel The Same',
            autorId: '1',
            autorNome: 'Ana Escritora',
            capa: null,
            sinopse: 'Uma história de amor que transcende o tempo. Quando dois corações se encontram, nada mais importa...',
            conteudo: `Capítulo 1 - O Encontro

Era uma tarde de outono quando ela o viu pela primeira vez. As folhas caíam suavemente ao redor, pintando o mundo em tons de laranja e dourado. Ele estava sentado no banco da praça, completamente absorto em um livro.

Ela não sabia o que a fez parar. Talvez fosse a forma como ele sorria para as páginas, como se o autor tivesse escrito aquelas palavras especialmente para ele. Ou talvez fosse apenas o destino, traçando seus caminhos para que finalmente se cruzassem.

— Bom livro? — ela perguntou, surpreendendo a si mesma com a audácia.

Ele levantou os olhos, e por um momento, o mundo parou. Seus olhos eram do tom mais incrível de castanho que ela já tinha visto, quase dourados sob a luz do sol poente.

— O melhor — ele respondeu, com um sorriso que fez seu coração disparar. — Mas agora estou pensando que talvez existam coisas melhores ainda.

E assim começou tudo. Nem ela, nem ele, sabiam que aquele encontro casual na praça mudaria suas vidas para sempre.

---

Capítulo 2 - Primeiras Conversas

Nas semanas seguintes, eles começaram a se encontrar naquela mesma praça. Às vezes por acaso, outras vezes combinado. Cada conversa os aproximava mais, revelando sonhos, medos e esperanças.

Ela descobriu que ele queria ser escritor, que passava noites acordado criando mundos com palavras. Ele descobriu que ela amava pintar, que via beleza em coisas que outros ignoravam.

— Você deveria ilustrar meus livros — ele disse certa vez, apenas meio brincando.

— E você deveria escrever sobre as minhas pinturas — ela respondeu, e ambos riram.

Mas em seus olhos, havia algo mais. Algo que nenhum dos dois ousava nomear, com medo de que dizendo em voz alta, pudesse desaparecer como fumaça.

---

Capítulo 3 - Confissões

A noite estava estrelada quando ele finalmente reuniu coragem suficiente. Eles estavam sentados na grama, olhando para o céu, em um silêncio confortável.

— Posso te contar um segredo? — ele perguntou, sua voz um pouco trêmula.

— Sempre — ela respondeu, virando-se para encará-lo.

Ele respirou fundo, como quem está prestes a pular de um precipício, confiando que o outro lado o seguraria.

— Eu... eu acho que estou apaixonado por você. Não, eu sei que estou. E sei que é louco, e que nos conhecemos há pouco tempo, mas...

Ela colocou um dedo em seus lábios, silenciando-o.

— Please, feel the same — ele sussurrou contra seu dedo.

Ela sorriu, lágrimas brilhando em seus olhos.

— Eu sinto — ela confessou. — Sinto há semanas, mas tinha medo de...

Ele não a deixou terminar. Seus lábios encontraram os dela, e naquele beijo, todas as palavras que não foram ditas, todos os sentimentos que foram guardados, finalmente encontraram seu lar.`,
            categoria: 'Romance',
            tags: ['romance', 'drama', '+18'],
            status: 'Completa',
            visualizacoes: 1250,
            curtidas: 89,
            comentarios: 23,
            classificacao: 4.5,
            dataCriacao: '2026-01-20T10:00:00Z',
            dataAtualizacao: '2026-02-15T16:00:00Z',
            capitulos: [
                { id: '1', titulo: 'Capítulo 1 - O Encontro', numero: 1 },
                { id: '2', titulo: 'Capítulo 2 - Primeiras Conversas', numero: 2 },
                { id: '3', titulo: 'Capítulo 3 - Confissões', numero: 3 }
            ]
        },
        {
            id: '2',
            titulo: 'Amor Unilateral',
            autorId: '2',
            autorNome: 'Pedro Poeta',
            capa: null,
            sinopse: 'Poesias sobre amores não correspondidos e a beleza da dor...',
            conteudo: `Amor Unilateral

Te vejo todos os dias,
Mas você nunca me vê.
Te amo em silêncio,
É assim que tem que ser.

---

Distância

O pior não é a distância entre nós,
É a certeza de que você nunca a notou.
Eu poderia estar ao seu lado,
E ainda assim, invisível.

---

Esperança

Talvez um dia você olhe,
E realmente me veja.
Talvez um dia você sinta,
O que eu sinto por você.

Mas até lá,
Eu continuarei aqui,
Amando no escuro,
Esperando pela luz.

---

Despedida

Hoje decidi que chegou a hora,
De deixar esse amor ir embora.
Não porque parei de te amar,
Mas porque preciso me amar.

Adeus, meu amor unilateral.
Que você encontre alguém que te ame,
Da forma que eu nunca pude te amar.
Em voz alta.`,
            categoria: 'Poesia',
            tags: ['poesia', 'drama', 'triste'],
            status: 'Completa',
            visualizacoes: 890,
            curtidas: 67,
            comentarios: 15,
            classificacao: 4.8,
            dataCriacao: '2026-02-01T14:30:00Z',
            dataAtualizacao: '2026-02-10T09:00:00Z',
            capitulos: [
                { id: '1', titulo: 'Amor Unilateral', numero: 1 },
                { id: '2', titulo: 'Distância', numero: 2 },
                { id: '3', titulo: 'Esperança', numero: 3 },
                { id: '4', titulo: 'Despedida', numero: 4 }
            ]
        },
        {
            id: '3',
            titulo: 'Noites de Verão',
            autorId: '1',
            autorNome: 'Ana Escritora',
            capa: null,
            sinopse: 'Um romance proibido que floresce durante as noites quentes de verão...',
            conteudo: `Prólogo

O verão daquele ano seria inesquecível. Não pelas festas na praia, nem pelas noites de insônia, mas por ele. Por nós. Por tudo que vivemos escondidos nas sombras.

---

Capítulo 1 - A Vizinha

Ela se mudou para a casa ao lado na primeira semana de janeiro. Eu a vi pela primeira vez quando estava regando as plantas na varanda. O sol batia em seus cabelos castanhos, criando um halo dourado ao seu redor.

— Oi! — ela acenou, notando meu olhar. — Sou a nova vizinha!

— Oi — respondi, sentindo meu rosto queimar. — Seja bem-vinda ao bairro.

Naquele momento, eu não fazia ideia de que aquela garota de sorriso fácil e riso contagiante se tornaria minha obsessão, meu segredo mais precioso.

---

Capítulo 2 - Encontros Noturnos

Começou inocente. Conversas pela cerca, trocas de livros, emprestimos de açúcar. Mas rapidamente se transformou em algo mais.

A primeira vez que a beijei foi em uma noite de lua cheia. Estávamos na minha varanda, conversando sobre sonhos e medos, quando nossos olhos se encontraram e não conseguimos mais nos desviar.

— Isso é errado — ela sussurrou contra meus lábios.

— Eu sei — respondi. — Mas às vezes o errado parece tão certo.

Ela não discordou.`,
            categoria: 'Romance',
            tags: ['romance', '+18', 'drama', 'proibido'],
            status: 'Em andamento',
            visualizacoes: 2340,
            curtidas: 156,
            comentarios: 42,
            classificacao: 4.7,
            dataCriacao: '2026-02-20T18:00:00Z',
            dataAtualizacao: '2026-03-01T20:00:00Z',
            capitulos: [
                { id: '1', titulo: 'Prólogo', numero: 0 },
                { id: '2', titulo: 'Capítulo 1 - A Vizinha', numero: 1 },
                { id: '3', titulo: 'Capítulo 2 - Encontros Noturnos', numero: 2 }
            ]
        }
    ],
    
    comentarios: [
        {
            id: '1',
            historiaId: '1',
            usuarioId: '2',
            usuarioNome: 'Pedro Poeta',
            conteudo: 'Que história linda! Me fez acreditar no amor novamente 💕',
            data: '2026-01-25T10:30:00Z',
            likes: 12,
            figurinhas: ['coracao']
        },
        {
            id: '2',
            historiaId: '1',
            usuarioId: '1',
            usuarioNome: 'Ana Escritora',
            conteudo: 'Obrigada, Pedro! Fico feliz que tenha gostado 🥰',
            data: '2026-01-25T11:00:00Z',
            likes: 8,
            figurinhas: ['gatinho']
        },
        {
            id: '3',
            historiaId: '2',
            usuarioId: '1',
            usuarioNome: 'Ana Escritora',
            conteudo: 'Que poesia tocante... Me identifiquei demais 😢',
            data: '2026-02-05T15:20:00Z',
            likes: 15,
            figurinhas: ['chorando']
        },
        {
            id: '4',
            historiaId: '3',
            usuarioId: '2',
            usuarioNome: 'Pedro Poeta',
            conteudo: 'Quero mais! Ansioso pelo próximo capítulo 🔥',
            data: '2026-02-25T09:00:00Z',
            likes: 23,
            figurinhas: ['fogo', 'olhos']
        }
    ],
    
    categorias: [
        { id: '1', nome: 'Romance', icone: '💕', quantidade: 2 },
        { id: '2', nome: 'Drama', icone: '🎭', quantidade: 2 },
        { id: '3', nome: 'Poesia', icone: '✨', quantidade: 1 },
        { id: '4', nome: '+18', icone: '🔞', quantidade: 1 },
        { id: '5', nome: 'Fantasia', icone: '🐉', quantidade: 0 },
        { id: '6', nome: 'Terror', icone: '👻', quantidade: 0 },
        { id: '7', nome: 'Comédia', icone: '😂', quantidade: 0 },
        { id: '8', nome: 'Aventura', icone: '🗺️', quantidade: 0 }
    ],
    
    figurinhas: [
        { id: '1', codigo: 'gatinho', nome: 'Gatinho', icone: '🐱', categoria: 'cute' },
        { id: '2', codigo: 'coracao', nome: 'Coração', icone: '❤️', categoria: 'love' },
        { id: '3', codigo: 'estrela', nome: 'Estrela', icone: '⭐', categoria: 'cute' },
        { id: '4', codigo: 'chorando', nome: 'Chorando', icone: '😢', categoria: 'emocao' },
        { id: '5', codigo: 'fogo', nome: 'Fogo', icone: '🔥', categoria: 'reacao' },
        { id: '6', codigo: 'olhos', nome: 'Olhos', icone: '👀', categoria: 'reacao' },
        { id: '7', codigo: 'poeta', nome: 'Poeta', icone: '📜', categoria: 'especial' },
        { id: '8', codigo: 'lua', nome: 'Lua', icone: '🌙', categoria: 'cute' },
        { id: '9', codigo: 'flor', nome: 'Flor', icone: '🌸', categoria: 'cute' },
        { id: '10', codigo: 'risada', nome: 'Risada', icone: '😂', categoria: 'emocao' },
        { id: '11', codigo: 'amor', nome: 'Amor', icone: '😍', categoria: 'love' },
        { id: '12', codigo: 'pensativo', nome: 'Pensativo', icone: '🤔', categoria: 'emocao' }
    ],
    
    // Métodos auxiliares
    findUserByEmail(email) {
        return this.usuarios.find(u => u.email === email);
    },
    
    findUserById(id) {
        return this.usuarios.find(u => u.id === id);
    },
    
    findHistoriaById(id) {
        return this.historias.find(h => h.id === id);
    },
    
    findComentariosByHistoriaId(historiaId) {
        return this.comentarios.filter(c => c.historiaId === historiaId);
    },
    
    getHistoriasByCategoria(categoria) {
        if (categoria === 'Todas') return this.historias;
        return this.historias.filter(h => h.categoria === categoria);
    },
    
    getTopHistorias(limit = 6) {
        return [...this.historias]
            .sort((a, b) => b.visualizacoes - a.visualizacoes)
            .slice(0, limit);
    },
    
    getHistoriasRecentes(limit = 6) {
        return [...this.historias]
            .sort((a, b) => new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao))
            .slice(0, limit);
    }
};

module.exports = db;

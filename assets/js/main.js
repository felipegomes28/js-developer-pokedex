const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0

const btn = document.querySelectorAll('.knowMoreButton')
const btns = document.querySelectorAll('.knowMoreButton')

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) =>
            `
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
                <button id="${pokemon.number}" class="knowMoreButton" type="button">Know More!</button>
            </li>
            `).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNextPage = offset + limit

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, limit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

pokemonList.addEventListener('click', (event) => {
    if (event.target.classList.contains('knowMoreButton')) {
        event.preventDefault();

        // Encontra o elemento pai do botão
        const listItem = event.target.closest('.pokemon');

        // Coleta os dados do Pokémon clicado
        const pokemonNumber = listItem.querySelector('.number').textContent.replace('#', '');
        const pokemonName = listItem.querySelector('.name').textContent;
        const pokemonPhoto = listItem.querySelector('.detail img').getAttribute('src');

        // Chama a função para obter os detalhes do Pokémon clicado
        pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber.toLowerCase()}` })
            .then(pokemonDetail => {

                // Coleta as estatísticas do Pokémon clicado
                const pokemonStats = pokemonDetail.stats;

                // Cria um HTML dinâmico para exibir informações adicionais sobre o Pokémon clicado
                const popupHTML = `
                    <h2>${pokemonName} #${pokemonNumber}</h2>
                    <img src="${pokemonPhoto}" alt="${pokemonName}">
                    <h3></h3>
                    <h3>Stats:</h3>
                    <ul>
                        ${pokemonStats.map(stat => `<li>${stat.name}: ${stat.base_stat}</li>`).join('')}  
                    </ul>
                `;

                // Abre uma nova janela em sobreposição
                const popupWindow = window.open('popup.html', '_blank', 'width=367,height=647');

                if (popupWindow) {
                    // Passa o conteúdo HTML gerado dinamicamente para a janela pop-up
                    popupWindow.document.write(popupHTML);
                } else {
                    alert('Pop-up bloqueado! Por favor, habilite pop-ups para ver mais informações.');
                }
            })
            .catch(error => {
                console.error('Erro ao obter detalhes do Pokémon:', error);
            });
    }
});

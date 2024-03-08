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
        event.preventDefault()

        fetch('popup.html')
            .then(response => response.text())
            .then(html => {
                const popupWindow = window.open('', '_blank', 'width=600,height=400');
                
                if (popupWindow) {
                    // Escreve o conteúdo HTML na nova janela pop-up
                    popupWindow.document.write(html);
                } else {
                    alert('Pop-up bloqueado! Por favor, habilite pop-ups para ver mais informações.');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar o conteúdo do arquivo HTML:', error);
            });
    }
});

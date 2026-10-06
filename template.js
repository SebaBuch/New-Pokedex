function getPokemonCardTemplate(pokemon, index) {
    return `
        <button data-id="card" class="pokemon-card bg-${pokemon.types[0].type.name}" onclick="openDialog(${index})">
            <span class="card-header">
                <span class="card-name">${pokemon.name.toUpperCase()}</span>
                <span class="pokemon-id">#${pokemon.id}</span>
            </span>
            <img data-id="card-image" class="card-image" src="${pokemon.sprites.other["official-artwork"].front_default}"
                alt="${pokemon.name}" loading="lazy">
            <span class="type-list">${getTypesTemplate(pokemon.types)}</span>
        </button>`;
}

function getTypesTemplate(types) {
    let typesHtml = "";
    for (let index = 0; index < types.length; index++) {
        typesHtml += `<span class="type-badge">${types[index].type.name}</span>`;
    }
    return typesHtml;
}

function getNotFoundTemplate() {
    return `<p data-id="not-found" class="not-found">No match found.</p>`;
}

function getDialogTemplate(pokemon) {
    return `
        <div data-id="overlay-pokemon-name" class="dialog-wrapper">
            <div class="dialog-card bg-${pokemon.types[0].type.name}">
                <div class="dialog-header">
                    <span class="pokemon-id">#${pokemon.id}</span>
                    <button data-id="close-dialog-button" class="close-button" onclick="closeDialog()">X</button>
                </div>
                <h2 class="dialog-name">${pokemon.name.toUpperCase()}</h2>
                <div class="type-list">${getTypesTemplate(pokemon.types)}</div>
                <img data-id="dialog-image" class="dialog-image"
                    src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
                <div class="stats">
                    ${getStatTemplate("HP", pokemon.stats[0].base_stat)}
                    ${getStatTemplate("ATT", pokemon.stats[1].base_stat)}
                    ${getStatTemplate("DEF", pokemon.stats[2].base_stat)}
                </div>
            </div>
            <div class="dialog-navigation">
                <button data-id="prev-button" class="nav-button" onclick="showPreviousPokemon()">&lt;</button>
                <button data-id="next-button" class="nav-button" onclick="showNextPokemon()">&gt;</button>
            </div>
        </div>`;
}

function getStatTemplate(label, value) {
    const barWidth = (value / 255) * 100;
    return `
        <div class="stat-row">
            <span class="stat-label">${label}</span>
            <span class="stat-value">${value}</span>
            <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${barWidth}%"></div>
            </div>
        </div>`;
}
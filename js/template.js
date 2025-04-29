function renderPokemon(pokemon, index) {
    return `    
            <div class="pokemon">
                <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <button onclick="addOverlay(${index})" class="button ${pokemon.types[0].type.name}">
                    <img class="pokemon_char" src="${pokemon.sprites.other.home.front_default}">
                </button>
                <div class="types">
                ${pokemon.types.map(t => getTypeIcon(t.type.name)).join('')}
                </div>
            </div>`
}

function getTypeIcon(typeName) {
    return `<span class="icon ${typeName}">${svgIcons[typeName]}</span>`;
}

function renderOverlayContent(pokemon, index) {
    return `<h2 class="dialog_h">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img class="pokemon_char_dialog ${pokemon.types[0].type.name}" src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}">
                <div class="types">
                ${pokemon.types.map(t => getTypeIcon(t.type.name)).join('')}
                </div>
        <div class="menu_box">
            <button onclick="getInfo(${index})" class="button_dialog">Info</button>
            <button onclick="getStats(${index})" class="button_dialog">Stats</button>
            <button onclick="getEvoChain(${index})" class="button_dialog">Evo Chain</button>
        </div>
        <div id="dialogBox" class="dialogBox"></div>
        <div class="arrowsOverlay"><p class="arrow-line" onclick="prevImage(${index})"><---</p>
        <p class="arrow-line" onclick="nextImage(${index})">---></p></div>`;
}

function showBaseInfo(pokemon) {
    return `
        <p>Height: ${pokemon.height} m</p>
        <p>Weight: ${pokemon.weight} kg</p>
        <p>Base EXP: ${pokemon.base_experience} XP </p>
        <p>Abilities: ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>`
}

function getStatBarFill(statName, percentage, color) {
    return `
    <div class="stat-row">
        <div class="stat-label">${statName.toUpperCase()}</div>
        <div class="stat-bar">
        <div class="stat-fill" style="width: ${percentage}%; background-color: ${color};"></div>
        </div>
    </div>
`;
}

function showStats(pokemon) {
    return `
    <div class="stats">
    ${pokemon.stats.map(stat =>
        renderStatBar(stat.stat.name, stat.base_stat)
    ).join('')}
    </div>`
}

function showEvoChain(evoPokemon, isLast) {
    return`
    <div class="evo-stage">
        <img src="${evoPokemon.sprites.other.home.front_default}" alt="${evoPokemon.name}">
    </div>
    ${!isLast ? '<span class="evo-arrow">➡️</span>' : ''}
`;}




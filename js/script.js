let BASE_URL= "https://pokeapi.co/api/v2/pokemon/"


let svgIcons = {};
let allPokemon = [];
let loadedCount = 0;
let newPokemons = 20;
let currentIndex = 21;


async function init() {
    await preloadTypeIcons();
    await showPokemon();
    await preloadEvoChains();
}

function loadingSpinner() {
    let loader = document.getElementById("loader");
    loader.classList.remove("d_none");
    let loadMore = document.getElementById("loadMore");
}

function disableSpinner() {
    loader.classList.add("d_none");
    content.classList.add("content");
    loadMore.classList.remove("d_none");
}
  
async function showPokemon() {
    loadingSpinner();
    for (let index = 1; index <= newPokemons; index++) {
        let response = await fetch(BASE_URL + index)
        let responseAsJson = await response.json();
        allPokemon.push(responseAsJson);
        let content = document.getElementById("content");        
        content.innerHTML += renderPokemon(responseAsJson, allPokemon.length - 1);
        loadedCount++;
            if (loadedCount === newPokemons) {
                disableSpinner();
            }
    }
}

async function loadMorePokemon() {
    loadingSpinner();
    for (let index = currentIndex; index <= currentIndex + newPokemons; index++) {
        let response = await fetch(BASE_URL + index)
        let responseAsJson = await response.json();
        allPokemon.push(responseAsJson);        
        document.getElementById("content").innerHTML += renderPokemon(responseAsJson, allPokemon.length - 1);
        loadedCount++;
            if (loadedCount === (newPokemons + currentIndex)) {
                loader.classList.add("d_none");
            }
    }
    currentIndex += newPokemons + 1;
    preloadEvoChains();
}

function addOverlay(index) {
    let pokemon = allPokemon[index];
    let addOverlayRef = document.getElementById('overlay')
    let dialogContentRef = document.getElementById("dialogContent")
    addOverlayRef.classList.remove('d_none');
    document.body.style.overflow = 'hidden';
    dialogContentRef.innerHTML = renderOverlayContent(pokemon, index);
    getInfo(index);
}

function nextImage(index) {
    addOverlay(index + 1);
}

function prevImage(index) {
    if (index === 0) {
        addOverlay(currentIndex - 2)
    }
    else{
        addOverlay(index - 1);
    }
}

function getInfo(index) {
    let pokemon = allPokemon[index];
    let getInfoRef = document.getElementById('dialogBox')
    getInfoRef.innerHTML = showBaseInfo(pokemon);    
}

function getStats(index) {
    let pokemon = allPokemon[index];
    let getStatsRef = document.getElementById('dialogBox');
    getStatsRef.innerHTML = "";
    getStatsRef.innerHTML = showStats(pokemon);
}

async function preloadEvoChains() {
    for (let i = 0; i < allPokemon.length; i++) {
        let pokemon = allPokemon[i];
        let speciesRef = await fetch(pokemon.species.url);
        let speciesData = await speciesRef.json();
        let evoChainUrl = speciesData.evolution_chain.url;
        let evoChainRef = await fetch(evoChainUrl);
        let evoChainData = await evoChainRef.json();
        let evoNames = [];
        let evo = evoChainData.chain;
            do {evoNames.push(evo.species.name);
                evo = evo.evolves_to[0];
            } while (evo && evo.hasOwnProperty('evolves_to'));
        pokemon.evolution = evoNames;
    }}

async function getEvoChain(index){
    let pokemon = allPokemon[index];
    let evoNames = pokemon.evolution;
    renderEvoChain(evoNames);
}

async function renderEvoChain(names) {
    let evoChainRef = document.getElementById('dialogBox');
    evoChainRef.innerHTML = '<div class="evolution-chain"></div>';
    let evoChainDiv = evoChainRef.querySelector('.evolution-chain');
    for (let i = 0; i < names.length; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${names[i]}`);
        let evoPokemon = await response.json();
        let evoHTML = showEvoChain(evoPokemon, i === names.length - 1);
        evoChainDiv.innerHTML += evoHTML;
    }
}

function filterPokemon() {
    let searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    let content = document.getElementById('content');
    if (searchInput.length < 3) {
        showFilteredPokemon(allPokemon.slice(0, loadedCount));
        loadMore.classList.remove("d_none");
        return;
    }
    let filteredPokemon = allPokemon
    .slice(0, loadedCount)
    .filter(pokemon => pokemon.name.toLowerCase().includes(searchInput));
    showFilteredPokemon(filteredPokemon);
}

function showFilteredPokemon(pokemonList) {
    let content = document.getElementById('content');
    let loadMore = document.getElementById('loadMore');
    loadMore.classList.add("d_none");
    content.innerHTML = pokemonList
    .map((pokemon) => renderPokemon(pokemon, allPokemon.indexOf(pokemon)))
    .join('');
}

function closeOverlay(event) {
    let addOverlayRef = document.getElementById('overlay');
    if(event.target === addOverlayRef || event.target.classList.contains('closeIcon')){
    addOverlayRef.classList.add('d_none');
    document.body.style.overflow = '';
    }
}

async function preloadTypeIcons() {
    let types = [
        'grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric',
        'ground', 'fairy', 'fighting', 'psychic', 'rock', 'ghost',
        'ice', 'dragon', 'dark', 'steel', 'flying'];

        for (let type of types) {
        let typeRespond = await fetch(`./assets/icons/${type}.svg`);
        let typeRespondText = await typeRespond.text();
        typeRespondText = typeRespondText.replace(/fill="[^"]*"/g, 'fill="currentColor"');
        svgIcons[type] = typeRespondText;
    }
}

function getStatColor(statName) {
    switch (statName.toLowerCase()) {
        case 'hp': return '#4CAF50';
        case 'attack': return '#F44336';
        case 'defense': return '#2196F3';
        case 'special-attack': return '#9C27B0'; 
        case 'special-defense': return '#3F51B5'; 
        case 'speed': return '#FFEB3B';   
        default: return '#9E9E9E';
    }
}

function renderStatBar(statName, statValue) {
    let percentage = (statValue / 299) * 100;
    let color = getStatColor(statName);
    return getStatBarFill(statName, percentage, color);
}


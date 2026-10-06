let currentOffset = 0;
let currentDialogIndex = 0;
let savedScrollPosition = 0;

async function init() {
    await loadPokemon();
}

async function loadPokemon() {
    showLoadingScreen();
    hideErrorMessage();
    try {
        const pokemonList = await fetchPokemonList();
        const newPokemon = await fetchAllPokemonDetails(pokemonList);
        addToAllPokemon(newPokemon);
        currentOffset = currentOffset + loadLimit;
        showAllPokemon();
    } catch (error) {
        showErrorMessage();
    }
    hideLoadingScreen();
}

async function fetchPokemonList() {
    const response = await fetch(`${baseUrl}?limit=${loadLimit}&offset=${currentOffset}`);
    const data = await response.json();
    return data.results;
}

async function fetchAllPokemonDetails(pokemonList) {
    const responsesAsPromise = [];
    for (let index = 0; index < pokemonList.length; index++) {
        responsesAsPromise.push(fetchSinglePokemon(pokemonList[index].url));
    }
    return await Promise.all(responsesAsPromise);
}

async function fetchSinglePokemon(url) {
    const response = await fetch(url);
    return await response.json();
}

function addToAllPokemon(newPokemon) {
    for (let index = 0; index < newPokemon.length; index++) {
        allPokemon.push(newPokemon[index]);
    }
}

function showLoadingScreen() {
    document.getElementById("loadingScreen").classList.remove("d-none");
    document.getElementById("loadMoreButton").disabled = true;
}

function hideLoadingScreen() {
    document.getElementById("loadingScreen").classList.add("d-none");
    document.getElementById("loadMoreButton").disabled = false;
}

function showErrorMessage() {
    document.getElementById("errorMessage").classList.remove("d-none");
}

function hideErrorMessage() {
    document.getElementById("errorMessage").classList.add("d-none");
}

function showAllPokemon() {
    displayedPokemon = [];
    for (let index = 0; index < allPokemon.length; index++) {
        displayedPokemon.push(allPokemon[index]);
    }
    renderPokemonCards();
}

function renderPokemonCards() {
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = "";
    if (displayedPokemon.length === 0) {
        cardContainer.innerHTML = getNotFoundTemplate();
    } else {
        for (let index = 0; index < displayedPokemon.length; index++) {
            cardContainer.innerHTML += getPokemonCardTemplate(displayedPokemon[index], index);
        }
    }
}

function getSearchValue() {
    return document.getElementById("searchInput").value.trim().toLowerCase();
}

function checkSearchInput() {
    const searchValue = getSearchValue();
    document.getElementById("searchButton").disabled = searchValue.length < 3;
    if (searchValue.length === 0) {
        document.getElementById("loadMoreButton").classList.remove("d-none");
        showAllPokemon();
    }
}

function handleSearchKey(event) {
    if (event.key === "Enter") {
        searchPokemon();
    }
}

function searchPokemon() {
    const searchValue = getSearchValue();
    if (searchValue.length < 3) {
        return;
    }
    displayedPokemon = [];
    for (let index = 0; index < allPokemon.length; index++) {
        if (allPokemon[index].name.includes(searchValue)) {
            displayedPokemon.push(allPokemon[index]);
        }
    }
    document.getElementById("loadMoreButton").classList.add("d-none");
    renderPokemonCards();
}

function openDialog(index) {
    currentDialogIndex = index;
    renderDialog();
    lockScroll();
    document.getElementById("pokemonDialog").showModal();
}

function renderDialog() {
    const pokemon = displayedPokemon[currentDialogIndex];
    document.getElementById("pokemonDialog").innerHTML = getDialogTemplate(pokemon);
}

function closeDialog() {
    document.getElementById("pokemonDialog").close();
}

function closeDialogOnBackdrop(event) {
    if (event.target.id === "pokemonDialog") {
        closeDialog();
    }
}

function showNextPokemon() {
    currentDialogIndex = currentDialogIndex + 1;
    if (currentDialogIndex >= displayedPokemon.length) {
        currentDialogIndex = 0;
    }
    renderDialog();
}

function showPreviousPokemon() {
    currentDialogIndex = currentDialogIndex - 1;
    if (currentDialogIndex < 0) {
        currentDialogIndex = displayedPokemon.length - 1;
    }
    renderDialog();
}

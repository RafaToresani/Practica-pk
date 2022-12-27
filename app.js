const alerta=document.querySelector(".alert");
const formulario=document.querySelector("#formulario");
const cardsDinamicas = document.querySelector("#card-dinamicas");
const template = document.querySelector("#templateCarta").content;
const fragment = document.createDocumentFragment();
const url = "https://pokeapi.co/api/v2/pokemon/";

let pokemons = [];

formulario.addEventListener("submit", e => {
    e.preventDefault();
    alerta.classList.add("d-none");

    const data = new FormData(formulario);
    const [numero] = [...data.values()];

    if(!numero.trim()){
        alerta.classList.remove("d-none");
        alerta.textContent="Ingrese un numero";
        return;
    }

    if(parseInt(numero)>151 || parseInt(numero)<1){
        alerta.classList.remove("d-none");
        alerta.textContent="Ingrese valor valido";
        return;
    }

    fetchData(numero);
})

const fetchData = async(numero) =>{
    try{
        const res = await fetch(`${url}${numero}`);
        const data = await res.json();
        agregarPokemon(
            data.name.toUpperCase(),
            data.sprites.other.home.front_default,
        );
    }catch (error){
        console.log(error);
    }
}

function agregarPokemon(nombre, imagen){
    const objetoPokemon = {
        nombre: nombre,
        imagen: imagen,
        id: `${Date.now()}`,
    }
    pokemons.push(objetoPokemon);
    mostrarPokemons();
}

function mostrarPokemons(){
    localStorage.setItem("pokemons", JSON.stringify(pokemons));
    cardsDinamicas.textContent = "";

    pokemons.forEach((item) => {
        const clone = template.cloneNode(true);
        clone.querySelector(".card-title").textContent=item.nombre;
        clone.getElementById('img').setAttribute("src", item.imagen);
        clone.querySelector(".btn-danger").dataset.id=item.id;
        

        fragment.appendChild(clone);
    })
    cardsDinamicas.appendChild(fragment);
}

document.addEventListener("DOMContentLoaded", e => {
    if(localStorage.getItem("pokemons")){
        pokemons = JSON.parse(localStorage.getItem("pokemons"));
        mostrarPokemons();
    }
})

document.addEventListener("click", e => {  
    if(e.target.matches(".btn-danger")){
        pokemons = pokemons.filter( (item) => item.id!==e.target.dataset.id);
        mostrarPokemons();
    }
})


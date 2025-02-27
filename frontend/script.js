const jokesContainer = document.getElementById('jokes_container');

const jokeForm = document.getElementById('joke_form');

let currentLength = 0;

const xhr = new XMLHttpRequest();
xhr.open("GET", 'http://localhost:3000/jokes');
xhr.send();
xhr.responseType = 'json';
xhr.onload = () => {
    const jokes = xhr.response;
    if (jokes.length) {
        jokesContainer.innerHTML = '';
        jokes.forEach(joke => {
            jokesContainer.innerHTML += getJokesHTML(joke);
        });
        currentLength = jokes.length;
    }
};


function getJokesHTML(joke) {
    return `
        <div class="joke" id="joke_${joke.id}">
            <div class="joke__content">
                ${joke.content}
            </div>
            <div class="joke__footer">
                <div class="joke__likes">
                    <span>${joke.likes}</span>
                    <button class="joke__btn" onclick="like(${joke.id})">
                        <span class="material-symbols-outlined">
                            thumb_up
                        </span>
                    </button>
                </div>
                <div class="joke__likes">
                    <span>${joke.dislikes}</span>
                    <button class="joke__btn" onclick="dislike(${joke.id})">
                        <span class="material-symbols-outlined">
                            thumb_down
                        </span>
                    </button>
                </div>
            </div>
        </div>
    `
}

jokeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = jokeForm.joke.value;
    const joke = {content, likes: 0, dislikes: 0, id: currentLength}
    const addJokeXHR = new XMLHttpRequest();
    addJokeXHR.open('POST', 'http://localhost:3000/jokes');
    addJokeXHR.send(JSON.stringify(joke));
    addJokeXHR.onload = () => {
        jokesContainer.innerHTML += getJokesHTML(joke);
        currentLength++;
    };
})

function like (id) {
    const likeXHR = new XMLHttpRequest();
    likeXHR.open('GET', 'http://localhost:3000/like?id='+id);
    likeXHR.send()
    likeXHR.responseType = 'json';
    likeXHR.onload = () => {
        const joke = likeXHR.response;
        document.getElementById('joke_'+id).outerHTML = getJokesHTML(joke)
    }
}

function dislike (id) {
    const likeXHR = new XMLHttpRequest();
    likeXHR.open('GET', 'http://localhost:3000/dislike?id='+id);
    likeXHR.send()
    likeXHR.responseType = 'json';
    likeXHR.onload = () => {
        const joke = likeXHR.response;
        document.getElementById('joke_'+id).outerHTML = getJokesHTML(joke)
    }
}
const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs')

let dataPath = path.join(__dirname, 'data')

function getAllJokes(req, res) {
    let dir = fs.readdirSync(dataPath)
    let allJokes = []
    for (let i = 0; i < dir.length; i++) {
        let file = fs.readFileSync(path.join(dataPath, i + '.json'))  // Отримуємо файл
        let jokeJson = Buffer.from(file).toString() // Отримуємо вміст файлу та перетворюємо в рядок
        let joke = JSON.parse(jokeJson); // Робимо з нього JS Object
        joke.id = i;

        allJokes.push(joke)
    }
    // повертаємо масив з жартами
    res.end(JSON.stringify(allJokes))
}

function addJokes(req, res) {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk
    })

    req.on('end', () => {
        let joke = JSON.parse(data)
        joke.likes = 0
        joke.dislikes = 0

        let dir = fs.readdirSync(dataPath)
        let fileName = dir.length + '.json'
        let filePath = path.join(dataPath, fileName)
        fs.writeFileSync(filePath, JSON.stringify(joke))

        res.end()
    })
}

function like(req, res) {
    const params = url.parse(req.url, true).query;
    let id = params.id;
    let dir = fs.readdirSync(dataPath)

    if (id && id <= dir.length) {
        let filePath = path.join(dataPath, id + '.json')
        let file = fs.readFileSync(filePath)
        let jokeJson = Buffer.from(file).toString()
        let joke = JSON.parse(jokeJson)

        joke.likes++;

        fs.writeFileSync(filePath, JSON.stringify(joke))
    }

    res.end();
}

function dislike(req, res) {
    const params = url.parse(req.url, true).query;
    let id = params.id;
    let dir = fs.readdirSync(dataPath)

    if (id && id <= dir.length) {
        let filePath = path.join(dataPath, id + '.json')
        let file = fs.readFileSync(filePath)
        let jokeJson = Buffer.from(file).toString()
        let joke = JSON.parse(jokeJson)

        joke.dislikes++;

        fs.writeFileSync(filePath, JSON.stringify(joke))
    }

    res.end();
}

const server = http.createServer((req, res) => {
    if (req.url == "/jokes" && req.method == "GET") { // Отримання всіх жартів
        getAllJokes(req, res);
    } else if (req.url == "/jokes" && req.method == "POST") { // Додавання жарта
        addJokes(req, res) 
    } else if (req.url.startsWith('/like') && req.method == "GET") { // Додавання лайка
        like(req, res)
    } else if (req.url.startsWith('/dislike') && req.method == "GET") { // Додавання дизлайка
        dislike(req, res)
    } else {
        res.end("Відповідного запита не було =(")
    }
})

server.listen(3000)
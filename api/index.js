const express = require('express')
const connectDB = require('./mongo/mongoose')
const { signIn, signUp } = require('./controllers/userController')
const app = express()
const port = 3000
const cors = require('cors')
const postController = require('./controllers/postController')
const commentController = require('./controllers/commentController')
const likeController = require('./controllers/likeController')
const { isUserLogged } = require('./middlewares/middleware')

connectDB()

const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/users/signIn', (req, res) => signIn(req, res))
app.post('/users/signUp', (req, res) => signUp(req, res))

app.get('/users/:id/likes', isUserLogged, (req, res) => likeController.getAllByUser(req, res))
app.get('/users/:id/comments', isUserLogged, (req, res) => commentController.getAllByUser(req, res))
app.get('/users/:id/posts', isUserLogged, (req, res) => postController.getAllByUser(req, res))

app.get('/posts', isUserLogged, (req, res) => postController.getAll(req, res))
app.get('/posts/:id', isUserLogged, (req, res) => postController.getById(req, res))
app.put('/posts/:id', isUserLogged, (req, res) => postController.update(req, res))
app.delete('/posts/:id', isUserLogged, (req, res) => postController.delete(req, res))
app.get('/posts/:id/comments', isUserLogged, (req, res) => commentController.getAllByPost(req, res))
app.post('/posts', isUserLogged, (req, res) => postController.create(req, res))

app.get('/comments/:id', isUserLogged, (req, res) => commentController.getById(req, res))
app.post('/comments', isUserLogged, (req, res) => commentController.create(req, res))

app.get('/likes/:id', isUserLogged, (req, res) => likeController.getById(req, res))
app.post('/likes', isUserLogged, (req, res) => likeController.create(req, res))
app.delete('/likes/:id', isUserLogged, (req, res) => likeController.delete(req, res))
app.post('/likes/isExist', isUserLogged, (req, res) => likeController.isExist(req, res))

app.listen(port, () => console.log('Server listen on port ' + port))
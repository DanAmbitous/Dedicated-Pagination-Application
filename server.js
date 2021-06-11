const express = require('express')
const app = express()
const PORT = process.env.PORT || 8698
const mongoose = require('mongoose')
const User = require('./models/usersSchema')
const Post = require('./models/postsSchema')

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', async () => {
  if (await User.countDocuments().exec() > 0) return

  Promise.all([
    User.create({name: 'User 1'}),
    User.create({name: 'User 2'}),
    User.create({name: 'User 3'}),
    User.create({name: 'User 4'}),
    User.create({name: 'User 5'}),
    User.create({name: 'User 6'}),
    User.create({name: 'User 7'}),
    User.create({name: 'User 8'}),
    User.create({name: 'User 9'}),
    User.create({name: 'User 10'}),
  ]).then(() => console.log(`Added Users`))
})

app.use(express.static('public'))

app.get('/posts', paginatedResults(Post), (req, res) => {
  res.json(res.pagination)
})

app.get('/users', paginatedResults(User), (req, res) => {
  res.json(res.pagination)
})

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}
    
    if (endIndex < await model.countDocuments().exec()) {
      results.nextPage = {
        page: page + 1, 
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previousPage = {
        page: page - 1, 
        limit: limit
      }
    }

    try {
      results.output = await model.find().limit(limit).skip(startIndex).exec()
      res.pagination = results  
      next()
    } catch (e) {
      res.status(500).json({message: e})
    }
  }
}

app.listen(PORT, () => console.log(`Running server on port ${PORT}`))
require('dotenv').config()

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const url = process.env.MONGODB_URI

module.exports = {
  url,
  PORT
}
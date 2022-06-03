const express = require('express')
const uuid = require('uuid')
const app = express()
const requests = []
app.use(express.json())

const verifyId = (req, res, next) => {
    const { id } = req.params
    const i = requests.findIndex(user => user.id === id)
    if (i < 0) {
        return res.status(404).json({ error: "User Not Found!" })
    }
    req.userId = id
    req.userIndex = i
    next()
}

const method = (req, res, next) => {
    console.log(`O metódo utilizado foi: ${req.method} e a URL: /order} `)
    next()
}

app.post('/order', method, (req, res) => {
    const { customeOrders, clientName, value } = req.body
    const clientOrder = { id: uuid.v4(), customeOrders, clientName, value, status: "Em preparação" }
    requests.push(clientOrder)
    return res.status(201).json( clientOrder )
})

app.get('/order', method, (req, res) => {
    return res.status(201).json( requests )
})

app.put('/order/:id', method, verifyId, (req, res) => {
    const { customeOrders, clientName, value } = req.body
    const i = req.userIndex
    const id = req.userId
    const updateOrder = { id, customeOrders, clientName, value, status: "Em preparação" }
    requests[i] = updateOrder
    return res.json(updateOrder)
})

app.delete('/order/:id', method, verifyId, (req, res) => {
    const { customeOrders, clientName, value } = req.body
    const i = req.userIndex
    const id = req.userId
    requests.splice( i, 1 )
    return res.status(201).json()
})

app.get('/order/:id', method, verifyId, (req, res) => {
    const i = req.userIndex
    const id = req.userId
    const checkOrder = requests[i]
    return res.json(checkOrder)
})

app.patch('/order/:id', method, verifyId, (req, res) => {
    const { customeOrders, clientName, value } = req.body
    const i = req.userIndex
    const id = req.userId
    const updateStatus = { id, customeOrders, clientName, value, status: "Pedido finalizado" }
    return res.json( updateStatus )
})

app.listen(3000)
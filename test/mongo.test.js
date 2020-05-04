const mongo = require('./mongo')
const { User, ProductManager, Programmer } = require('../models')

afterEach(async () => {
  await mongo.deleteAll()
})

afterAll(async () => {
  await mongo.disconnect()
})

describe('user', () => {

  test('user create', async () => {
    const name = 'test'
    const user = await User.create({name, email: 'test@gmail.com', password: 'pw'})
    expect(user.name).toBe(name)
    expect(!!user.token).toBeTruthy()
  })

  test('user create with role ProductManager', async () => {
    const programmer = await Programmer.create({skill: ['frontend', 'backend']})
    const productManager = await ProductManager.create({skill: ['frontend', 'backend', 'infra'], programmers: [programmer._id]})

    const user = await User.create({name: 'test', email: 'test@gmail.com', password: 'pw', role: {type: productManager._id, model: 'ProductManager'}})
    expect(user.role.model).toBe('ProductManager');
  })
})

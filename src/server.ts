import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'
import { v4 as uuidv4 } from 'uuid'

type IProduct = {
  id: string,
  productName: string,
  price: number,
  qty: number
}

// Products dataset
let products = [
  { id: "1", productName: "Apple", price: 3.99, qty: 2 },
  { id: "2", productName: "Banana", price: 1.99, qty: 3 },
  { id: "3", productName: "Orange", price: 2.00, qty: 4 },
  { id: "4", productName: "Mango", price: 5.50, qty: 5 },
  { id: "5", productName: "Watermelon", price: 8.99, qty: 2 }
]

// Type Definitions
const typeDefs = `#graphql
  type Product {
    id: ID!
    productName: String
    price: Float
    qty: Int
  }

  type Query {
    products: [Product]
    getProductById(id: ID): Product
    getProductTotalPrice(id: ID): Float
    getTotalQtyOfProducts: Int
  }

  type Mutation {
    addProduct(productName: String, price: Float, qty: Int): Product
    updateProduct(id: ID, productName: String, price: Float, qty: Int): Product
    deleteProduct(id: ID): Product
  }
`

// Resolvers - Finish This
const resolvers = {
  Query: {
    products: () => products,
    getProductById: (_: unknown, { id }: { id: string }) => {
      return products.find(product => product.id === id)
    },
    getProductTotalPrice: (_: unknown, { id }: { id: string }) => {
      const product = products.find(pro => pro.id === id)
      if (product) {
        return product.price * product.qty
      }
    },
    getTotalQtyOfProducts: () => {
      return products.reduce((sum, curr) => sum + curr.qty, 0)
    }
  },
  Mutation: {
    addProduct: (_: unknown, { productName, price, qty }: Omit<IProduct, 'id'>) => {
      const newProduct = {
        id: (products.length + 1).toString(),
        productName,
        price,
        qty
      }
      products.push(newProduct)
      return newProduct
    },
    updateProduct: (_: unknown, { id, productName, price, qty }: IProduct) => {
      const updatedProduct = { id, productName, price, qty }
      products[parseInt(id) - 1] = updatedProduct
      return updatedProduct
    },
    deleteProduct: (_: unknown, { id }: { id: string }) => {
      const productIndex = products.findIndex(product => product.id === id);
      const deletedProduct = products[productIndex];
      products = products.filter(product => product.id !== id);
      return deletedProduct;
    }
  },
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Start Apollo Server
const startServer = async () => {
  const { url } = await startStandaloneServer(server)
  console.log(`Server is running on ${url}...`)
}

startServer()

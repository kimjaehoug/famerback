import { MongoClient } from "mongodb";
const url =
  "mongodb+srv://" +
  process.env.DB_USERNAME +
  ":" +
  process.env.DB_PW +
  "@cluster0.ymcer3e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let connectDB;

if (process.env.NODE_ENV === "development") {
  if (!global._mongo) {
    global._mongo = new MongoClient(url).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(url).connect();
}
export { connectDB };

// const url = 'mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@cluster0.d3q0orm.mongodb.net/'
// let connectDB

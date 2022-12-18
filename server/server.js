const express = require("express");
const path = require("path");

const db = require("./config/connection");  // this file also pulls in dotenv

const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");

const PORT = process.env.PORT || 3001;
const app = express();

// stripe implementation
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-08-01",
});

//stripe
app.use(express.static(process.env.STATIC_DIR));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// stripe get routes
app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer();

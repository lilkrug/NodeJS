const { createServer } = require("http");
const { readFileSync } = require("fs");
const { graphql, buildSchema } = require("graphql");

const resolvers = require("./resolvers");
const schema = buildSchema(readFileSync("./schema.gql").toString());
const Repository = require("./repository");

const context = new Repository();

const server = createServer((request, response) => {
  let body = "";
  request.on("data", (chunk) => (body += chunk));
  request.on("end", () => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");

    if (request.url === "/" && request.method === "POST") {
      let graphqlRequest = "";
      try {
        graphqlRequest = JSON.parse(body);
        if (graphqlRequest.query) {
          graphql(
            schema,
            graphqlRequest.query,
            resolvers,
            context,
            graphqlRequest.variables
          )
            .then((result) => {
              if (result.errors) {
                response.statusCode = 400;
              }
              response.end(JSON.stringify(result, null, "  "));
            })
            .catch((err) => {
              response.statusCode = 500;
              response.end(JSON.stringify({ error: err }, null, "  "));
            });
        } else {
          response.statusCode = 400;
          response.end();
        }
      } catch (err) {
        response.statusCode = 500;
        response.end(JSON.stringify({ error: err }, null, "  "));
      }
    } else {
      response.statusCode = 404;
      response.end();
    }
  });
});

server.listen(3000, () => {
  console.log(`Server has been started on localhost:3000`);
});

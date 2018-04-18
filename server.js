var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var schema = buildSchema(`
    type Query {
        user(id: Int!): User
        users(country: String): [User]
    },
    type User {
        id: Int
        firstName: String
        lastName: String
        location: Location
        age: Int
    }
    type Location {
        address: String
        city: String
        postal: String
        country: String
    }
`);
var data = [
    {
        id: 1,
        firstName: 'Marc',
        lastName: 'Santos',
        age: 21,
        location: {
            address: '1234 Fake Street E',
            city: 'Toronto',
            postal: 'A1B2C3',
            country: 'Canada'
        }
    },
    {
        id: 2,
        firstName: 'Filip',
        lastName: 'Maj',
        age: 27,
        location: {
            address: '4512 Not Real Street W',
            city: 'Toronto',
            postal: 'A1B2C3',
            country: 'Canada'
        }
    },
    {
        id: 3,
        firstName: 'Bob',
        lastName: 'Builder',
        age: 34,
        location: {
            address: 'Not Canadian Street',
            city: 'Houston',
            postal: '123456',
            country: 'United States'
        }
    }
]

var getUser = function(args) {
    var id = args.id;
    return data.filter(user => {
        return user.id == id
    })[0];
}

var getUsers = function(args) {
    if (args.country) {
        var country = args.country;
        return data.filter(user => user.location.country == country);
    } else {
        return data;
    }
}
var root = {
    user: getUser,
    users: getUsers
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL server running on localhost:4000/graphql'));

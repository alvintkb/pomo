// src/apollo-client.ts
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
const httpLink = new HttpLink({
    uri: 'https://sp412b-763ef468411d.herokuapp.com/graphql',
});
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
export default client;
//# sourceMappingURL=apollo-client.js.map
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { PropsWithChildren } from 'react';
const client = new ApolloClient({
  uri: 'http://35.221.98.116:3000/graphql', 
  // uri: 'http://localhost:3000/graphql', 
  cache: new InMemoryCache(),
});

const CustomApolloProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default CustomApolloProvider;
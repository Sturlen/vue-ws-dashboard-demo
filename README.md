# Vue Websockets Demo

This is a demo showcasing how vue and vue-query can be integrate with WebSockets to enable live updates in real time.

It uses websockets to invalidate queries, not to fetch data. This is still being done with fetch and HTTP. This strategy makes sure only data that is actively used by the application will be fetched.

Could be expaned to use Tanstack DB and ElectricSQL to directly connect to a Postgres Database, or socket.io for pub/sub only for the data the app is interested in.

## Commands

Build the vue frontend.

```sh
npm run build
```

Start the backend and host files. uses "strip ts types" so it does not need a complile step.

```sh
npm run start
```

## Links

Original concept [Blog post from TkDodo](https://tkdodo.eu/blog/using-web-sockets-with-react-query)

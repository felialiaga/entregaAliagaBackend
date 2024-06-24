import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';



const PORT = process.env.PORT || 8080;
const app = express();


app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter)


const server = app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
const socketServer = new Server(server);

socketServer.on('connection', (socketClient) => {
    console.log('Client Connected');
    socketServer.emit('productAdded');

    socketClient.on('addProduct', data => {
        console.log(`Product added with id ${data}`);
        socketServer.emit('productAdded');
    })

});
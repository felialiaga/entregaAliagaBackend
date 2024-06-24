import fs from 'fs';
import __dirname from '../utils.js';

const PATH = `${__dirname}/db/carts.json`;

class CartsManager {
    constructor() {
        this.init();
    }

    async init() {
        if(fs.existsSync(PATH)) {
            console.log('Archivo carts encontrado');
        } else {
            try {
                await fs.promises.writeFile(PATH, JSON.stringify([]));
                console.log('Archivo creado con exito!');
            } catch(error) {
                console.log(`Ocurrio el siguiente error: ${error}`);
                process.exit(1);
            }
        }
    }

    async getCarts() {
        try {
            const data = fs.promises.readFile(PATH, 'utf-8');
            return JSON.parse(data);
        }catch(error) {
            return null;
        }
    }

    async getCartsById(id) {
        try {
            const carts = this.getCarts();

            const cart = carts.find(cart => cart.id === id);

            if(!cart) {
                return null;
            }

            return cart;

        }catch(error){
            return null;
        }
    }


    async saveCarts(cart) {
        try {
            fs.promises.writeFile(PATH, JSON.stringify(cart, null, '\t'));
        } catch(error){
            console.log('An error ocurred writing the file: ', + error);
        }
    }

    async createCart() {
        
        const newCart = {
            products: []
        }

        const carts = await this.getCarts();
        if(!carts){return -1};

        if(carts.length === 0) {
            newCart.id = 1;
        } else {
            newCart.id = carts[carts.length - 1].id + 1;
        }

        carts.push(newCart);

        const createdCart = await this.saveCarts(carts);

        if(!createdCart){
            return -1;
        }

        return newCart.id;
    }

    async addProductCart({cartId, productId}) {

        const carts = await this.getCarts();

        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);

        if(cartIndex === -1) {
            return null;
        }

        if(productIndex === -1) {
            carts[cartIndex].products.push({productId, quantity: 1});
        } else {
            carts[cartIndex].products[productIndex].quantity ++;
        }

        return carts;
    }
}

export default CartsManager;
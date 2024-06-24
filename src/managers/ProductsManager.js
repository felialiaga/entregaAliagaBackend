import fs from 'fs';
import __dirname from '../utils.js';

class ProductsManager {

    constructor() {
        this.path = `${__dirname}/db/products.json`;
        this.init();
    }

    async init() {
        if(fs.existsSync(this.path)) {

        } else {
            try {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
                console.log('File created!!');
            } catch(error) {
                console.log(`An error ocurred trying to create a product: ${error}`);
                process.exit(1);
            }
        }
    }

    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch(error) {
            console.log(`Error: ${error}`);
            return null;
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const newId = parseInt(id);
        const product = products.find(prod => prod.id === newId );

        return product;
    }

    async saveProducts(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch(error) {
            console.log(`Couldn't save product: ${error}`);
        }
    }

    async createProducts(product) {

        const products = await this.getProducts();

        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        products.push(product);

        await this.saveProducts(products);

        return product.id;

    }

    async updateProducts(products) {
        if(!products) {
            return -1;
        }

        const created = await this.saveProducts(products);

        if(!created) {
            return -1;
        }

        return 1;

    }




}


export default ProductsManager;
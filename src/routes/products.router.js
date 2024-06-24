import { Router } from "express";
import { productsService } from "../managers/index.js";
import uploader from '../services/uploader.js';
import express from 'express';

const router = Router();

router.use(express.json());

router.get('/', async (req, res) => {
    const products = await productsService.getProducts();

    if (products === null) {
        return res.status(500).send({status: 'error', error: 'Could not get the products'});
    }

    if(products.length === 0) {
        return res.status(500).send({status: 'error', error: 'There are not products'});
    }

    const limit = parseInt(req.query.limit) || products.length;

    if(limit > products.length) {
        return res.status(400).send({status: 'error', error: 'Invalid limit'});
    }

    const limitedProducts = products.slice(0, limit);

    res.send({status: 'success', payload: limitedProducts});

});

router.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    const newId = parseInt(id);

    const product = productsService.getProductById(newId);

    res.send({status: "success", payload: product});

});

router.post('/', uploader.array('thumbnail', 3) , async (req, res) => {

    const product = req.body;

    if(!product.name || !product.price || !product.stock || !product.thumbnails) {
        return res.status(400).send('Missing Information');
    }

    
    const newProduct = {
        name: product.name,
        price: product.price,
        code: `${product.category}-1`,
        category: product.catgeory,
        stock: product.stock,
        thumbnails: []
    }

    for(let i = 0; i < req.files.length; i++) {
        newProduct.thumbnails.push({
            mimetype: req.files[i].mimetype,
            path: `/files/${req.files[i].filename}`,
            main: i === 0
        })
    }

    const result = await productsService.createProducts(newProduct);
        
    if(result === -1) {
        return res.status(500).send({status: 'error', error: 'Could not create the product'});
    }

    res.send({status: 'success', message: `Product created with id ${result}` });

});

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const productUpdate = req.body;

    if(isNaN(id)) {
        return res.send({status: "error", mmessage: "The id has to be a number"});
    }

    const newId = parseInt(id);

    const products = await manager.getProducts();

    const productIndex = products.findIndex((product) => product.id === newId );

    const updatedProduct = {
        ...productUpdate,
        id: newId
    }

    products[productIndex] = updatedProduct;

    await manager.saveProducts(products);

    res.send({status: "success", message: `Product with id ${newId} has been updated successfully`});
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;

    if(isNaN(id)) {
        return res.send({status: "error", mmessage: "The id has to be a number"});
    }

    const newId = parseInt(id);

    const products = await productsService.getProducts();

    const product = products.filter( prod => prod.id !== newId);

    if(product === null) {
        return res.send({status:"error", message: "Product not found"})
    }

    await productsService.saveProducts(product);

    res.send({status: "succes", message: `Product with id ${newId}, has benn deleted successfully`})
});




export default router;
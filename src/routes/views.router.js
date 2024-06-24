import { Router } from "express";
import { productsService } from "../managers/index.js";

const router = Router();



router.get('/', async (req, res) => {

    const products = await productsService.getProducts();

    res.render('Home', {
        products,
        css: 'Home'
    });

});

router.get('/realTimeProducts', (req, res) => {
    res.render('RealTimeProducts', {
        css: 'RealTimeProducts'
    });
})

router.get('/products/:pid', async (req, res) => {

    const product = await productsService.getProductById(req.params.pid);

    if(!product) {
       return res.render('404');
    }
    res.render('ProductDetails', {
        product,
        mainImage: product.thumbnails.find(thumbnail => thumbnail.main),
        css: 'ProductDetails'
    });

});


export default router;
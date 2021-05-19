const router = require('express').Router();
const logger = require('../../utils/logger');
const paging = require('../../utils/paging');
const productService = require('../../services/product-service');
const upload = require('../../utils/multipart');

// getCategories
router.get('/categories', async (req, res, next) => {
    const result = await productService.getAllCategories();

    res.json(result);
});

// uploadImage
router.post('/upload', async (req, res, next) => {
    const imageSaveInfo = req.body;

    try {
        const result = await productService.uploadImages(imageSaveInfo);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// uploadMainImage
router.post('/upload/main', upload.single('uploadFile'), (req, res) => {
    const { filename } = req.file;
    res.json({
        product_image: `/main/${filename}`,
    });
});

// async getProductList
router.get('/', async (req, res) => {
    let pageNo = parseInt(req.query.pageNo, 10);
    const subcategoryId = parseInt(req.query.subcategoryId, 10);
    
    // Condition
    const isOnlyPageNo = (!Number.isNaN(pageNo)) && Number.isNaN(subcategoryId);

    try {
        pageNo = (Number.isNaN(pageNo)) ? 1 : pageNo;
        const category = await productService.getAllCategories();
        if(isOnlyPageNo) {
            const totalRows = await productService.totalRows();
            const pager = paging.init(10, 5, pageNo, totalRows);
            const products = await productService.getProductList(pager);
            res.json({ pager, category, products });
        } else {
            const totalRows = await productService.totalRows(subcategoryId);
            const pager = paging.init(10, 5, pageNo, totalRows);
            const products = await productService.getProductList(pager, subcategoryId);
            res.json({ pager, category, products });
        }
    } catch (err) {
        logger.error(err);
        res.json(err);
    }
});

// addProduct
router.post('/', async (req, res, next) => {
    const receivedData = req.body;
    try {
        const result = await productService.addProduct(receivedData);
        res.json(result);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

// modifyProduct
router.put('/', async (req, res, next) => {
    const productInfo = req.body;
    try {
        const result = await productService.modifyProduct(productInfo);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// getProduct
router.get('/:product_id', async (req, res) => {
    const productId = parseInt(req.params.product_id, 10);
    if(Number.isNaN(productId)) {
        res.json(undefined);
        return;
    }
    try {
        const result = await productService.getProductDetails(productId);
        if(result === null) {
            res.json(undefined);
            return;
        }
        res.json(result);
    } catch (err) {
        logger.error(err);
        res.json(err);
    }
});

// deleteProduct
router.put('/:product_id', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.product_id, 10);
        const result = await productService.deleteProduct(productId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});





module.exports = router;
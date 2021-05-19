const fs = require('fs').promises;
const homedir = require('os').homedir();
const db = require('../sequelize/models');
const logger = require('../utils/logger');


const { Op } = db.Sequelize;

/**
 * 상품 정보를 가져오기 위한 서비스
 * @param {Pager} pager 
 * @param {Number} subcategoryId 
 * @returns ProductData
 */
const getProductList = async (pager, subcategoryId) => {
    try {
        let result = '';
        if(subcategoryId) {
            result = await db.Product.findAll({
                limit: pager.rowsPerPage,
                offset: pager.startRowIndex,
                order: [
                    ['product_id', 'DESC'],
                ],
                where: {
                    product_deleted: 'NO',
                    subcategory_id: subcategoryId,
                },
            });
        } else {
            result = await db.Product.findAll({
                limit: pager.rowsPerPage,
                offset: pager.startRowIndex,
                order: [
                    ['product_id', 'DESC'],
                ],
                where: {
                    product_deleted: 'NO',
                },
            });
        }
        return result;
    } catch (error) {
        logger.info(error);
        throw error;
    }
};

/**
 * 페이저를 구현하기 위해 총 행의 수를 구하기 위한 서비스
 * @param {Number} subcategoryId 
 * @returns {Number} productRows
 */
const totalRows = async (subcategoryId) => {
    try {
        let result = null;
        if(subcategoryId) {
            const where = {
                subcategory_id: subcategoryId,
                product_deleted: 'NO',
            };
            result = await db.Product.count({ where });
        } else {
            const where = {
                product_deleted: 'NO',
            };
            result = await db.Product.count({ where });
        }
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

/**
 * 카테고리를 가져와 목록으로 제공하는 서비스
 */
const getAllCategories = async () => {
    try {
        // 카테고리 1- Outer, 2 - Top, 3 - Bottom
        const categoryInfo = [
            { id: 2, name: 'Top' },
            { id: 3, name: 'Bottom' },
            { id: 1, name: 'Outer' },
        ];

        // 반환할 객체를 선언
        const returnData = {};
    
        // 통신이 비동기기에 for await of로 loop
        for await (const item of categoryInfo) {
            const { id, name } = item;
            const data = [];

            const receivedData = await db.Subcategory.findAll({
                where: { category_id: id },
            });

            for await (const { dataValues } of receivedData) {
                data.push(dataValues);
            }
            returnData[name] = data;
        }

        return returnData;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getProductDetails = async (productId) => {
    try {
        const result = await db.Product.findOne({
            where: { product_id: productId },
        });

        if(!result) {
            return null;
        }

        const { dataValues } = result;

        dataValues.product_imgs_carousel_list = await result.getProductImgs({
            where: {
                product_id: productId,
                product_img_category: 'carousel',
            },
        });

        dataValues.product_imgs_detail_list = await result.getProductImgs({
            where: {
                product_id: productId,
                product_img_category: 'detail',
            },
        });

        dataValues.product_sizes_list = await result.getSizes({
            where: {
                product_id: productId,
            },
        });

        dataValues.product_colors_list = await result.getColors({
            where: {
                product_id: productId,
            },
        });


        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const deleteProduct = async (productId) => {
    try {
        const result = await db.Product.update({
            product_deleted: 'YES',
        }, {
            where: {
                product_id: productId,
            },
        });

        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const addProduct = async ({ products, sizes, colors }) => {
    try {
        // 상품 등록하기
        const productInfo = await db.Product.create({ ...products, product_deleted: 'NO' });

        // eslint-disable-next-line camelcase
        const { product_id } = productInfo.dataValues;

        // 사이즈 등록하기
        for await (const size of sizes) {
            const data = { size_name: size, product_id };
            await db.Size.create(data);
        }

        // 색상 등록하기
        for await (const color of colors) {
            const data = { color_name: color, product_id };
            await db.Color.create(data);
        }

        return productInfo;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const saveImage = async (filename, base64) => {
    try {
        const imageData = Buffer.from(base64, 'base64');
        const result = await fs.writeFile(filename, imageData);
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const uploadImages = async ({ 
    type, filename, product_id, base64,
}) => {
    try {
        const BASE_PATH = `${homedir}/images`;
        const FILE_PATH = `/${type}/${filename}`;
        const base64Data = base64.split(',');
        await saveImage(BASE_PATH + FILE_PATH, base64Data[1]);
        
        const imageInfo = {
            product_img_type: 'image/jpeg',
            product_img_category: type,
            product_img_name: FILE_PATH,
            product_id,
        };

        // 이미지 저장 이후 데이터베이스에 정보를 삽입한다.
        const result = await db.ProductImg.create(imageInfo);
    
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const modifyProduct = async (productInfo) => {
    const result = await db.Product.update(productInfo, {
        where: {
            product_id: productInfo.product_id,
        },
    });

    return result;
};



module.exports = {
    getProductList,
    totalRows,
    getAllCategories,
    getProductDetails,
    deleteProduct,
    addProduct,
    uploadImages,
    modifyProduct,
};



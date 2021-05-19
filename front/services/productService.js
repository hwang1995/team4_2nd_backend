/* eslint-disable */
angular
  .module("app")
  .factory("productService", function($http) {
    // RESTful API 통신을 하기 위한 기반 주소
    const BASE_URL = "http://localhost:8080/api/products";

    return {
      /**
       * 상품의 리스트를 가져오기 위해 사용하는 서비스
       * @param {number} pageNo 
       * @param {number} subcategoryId 
       * @returns {Promise}
       */
      getProductList : function (pageNo, subcategoryId){
        let sendURL = "";
        if(pageNo && !subcategoryId){
          sendURL = `${BASE_URL}?pageNo=${pageNo}`;
        } else if(!pageNo && subcategoryId){
          sendURL = `${BASE_URL}?subcategoryId=${subcategoryId}`;
        } else {
          sendURL = `${BASE_URL}?pageNo=${pageNo}&subcategoryId=${subcategoryId}`;
        }
        return $http.get(sendURL);
      },

      /**
       * 상품 상세 정보를 가져오기 위한 서비스
       * @param {number} productId 
       * @returns {Promise}
       */
      getProductDetails : function(productId) {
        return $http.get(BASE_URL + "/" + productId);
      },

      /**
       * 상품의 카테고리를 가져오기 위한 서비스
       * @returns {Promise}
       */
      getCategoryList : function () {
        return $http.get(BASE_URL + "/categories");
      },

      /**
       * 상품의 메인 이미지를 업로드 하기 위한 서비스
       * @param {object} formData 
       * @returns {string} product_image
       */
      uploadMainImage : async function (formData) {
        let uploadImage = await $http.post(`${BASE_URL}/upload/main`, formData, {headers : {"Content-Type" : undefined}});
        return uploadImage.data.product_image;
      },

      /**
       * 상품의 이미지들 (캐러셀, 디테일)을 업로드 하기 위한 서비스
       * @param {object} data 
       * @returns {Promise}
       */
      uploadImages : async function (data) {
        return $http.post(`${BASE_URL}/upload`, data);
      },

      /**
       * 상품 추가시에 필요한 product_id의 시퀀스 번호를 가져오는 서비스
       * @returns {number} product_id
       */
      getSequence : async function () {
        let sequence = await $http.get(`${BASE_URL}/sequence`);
        return sequence.data.product_id;
      },

      /**
       * 상품을 추가하기 위한 서비스
       * @param {object} data 
       * @returns {Promise}
       */
      postProducts : async function(data) {
        const products = await $http.post(BASE_URL, data);
        return products.data.product_id;
      },

      /**
       * 상품을 업데이트 하기 위한 서비스
       * @param {object} data 
       * @returns {Promise}
       */
      updateProduct : function(data) {
        return $http.put(BASE_URL, data);
      },

      /**
       * 상품을 삭제하기 위한 서비스
       * @param {number} product_id 
       * @returns {Promise}
       */
      deleteProduct : function(product_id) {
        return $http.put(BASE_URL + "/" + product_id);
      }
    }

  });
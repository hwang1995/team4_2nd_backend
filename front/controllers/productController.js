/* eslint-disable */
angular
  .module("app")
  .controller("productController", function($scope, $rootScope, productService, $location, $routeParams, $window){
    /**
     * $routeChangeSuccess 이벤트는 
     * 브라우저의 route 값이 변경됨을 감지하여
     * 각 해당하는 주소가 실행되기 이전에 가져와야하는 값이라던지, 
     * 설정해야 하는 변수들을 세팅하기 위해 필요한 이벤트 함수이다.
     * ==================================================
     * 작동 원리
     * ==================================================
     * 만약 location의 path가 "admin/product/add"로 들어왔다면?
     *    > 상품의 카테고리를 추가하기 위해 서비스를 통해 값을 가져온다.
     * 만약 location의 path가 "admin/product"가 아니라면? (상품 상세 페이지라면?)
     *    > routeParams의 값을 가져와 서버에서 상품의 상세 정보를 받아온다.
     *    > Promise 객체가 실행 후 응답받은 값이 없다면?
     *        > 사용자에게 alert을 해주고, 상품 목록 페이지로 이동시킨다.
     *    > Promise 객체가 실행 후 응답받은 값이 있다면?
     *        > 응답 받은 객체의 값을 $scope로 저장시킨다.
     * ==================================================
     */
    $scope.$on("$routeChangeSuccess", function() {
      const ENTER_SYMBOL = /\n/;

      if($location.path() == "/admin/product/add"){
        productService
          .getCategoryList()
          .then((response) => {
            console.log(response);
          $scope.categoryName = "Top";

          $scope.category = response.data;
          })

      } else if($location.path() !== "/admin/product"){
        
        $rootScope.productCtrl_ID = $routeParams.product_id;
        productService
        .getProductDetails($routeParams.product_id)
        .then((response) => {
          if(response.data.length === 0){
            alert("해당하는 상품이 없으므로 상품 목록 페이지로 이동합니다.")
            $location.url("/admin/product")
          } else {
            $scope.productInfo = response.data;
            $scope.productContents = response.data.product_content.split(ENTER_SYMBOL);
            $scope.productSubContents = response.data.product_subcontent.split(ENTER_SYMBOL);
          }
   
        })
        ;
      }
      
      $scope.getList(1);
      $scope.triggerEnabled = false;
    });
    
    // ========== 1. 상품 목록 보여주기 ========== 

    /**
     * 상품 목록 페이지에서 상품 상세 페이지로 이동 시키기 위한 함수
     * @param {number} product_id 
     */
    $scope.goReadPage = (product_id) => {
      const pathLocation = $location.path() + "/" + product_id;
      $location.path(pathLocation)
    }

    /**
     * 상품 상세 페이지에서 상품 목록 페이지로 이동 시키기 위한 함수
     */
    $scope.goProductPage = () => {
      $location.path("/admin/product")
    }

    /**
     * 상품 목록 페이지의 테이블에서 카테고리를 보여주기 위한 함수
     * @param {number} categoryId 
     * @returns {string} 
     */
    $scope.showCategory = (categoryId) => {
      $scope.categoryList = [
        "Outer - Jacket", "Outer - Coat", "Outer - Cardigan",
        "Top - Knit", "Top - Shirt", "Top - Tee",
        "Bottom - Pants", "Bottom - Skirt"];
      return $scope.categoryList[categoryId - 1];
    }

    /**
     * 상품 목록 페이지에서 상품의 정보, 페이저의 정보를 받아
     * 사용자에게 보여주기 위한 함수
     * @param {number} pageNo (페이지 번호)
     * ==================================================
     * 작동 원리
     * ==================================================
     * 만약 $scope.triggerEnabled가 true라면? 
     * (사용자가 카테고리를 선택해서 트리거가 발생했다면?)
     *    > pageNo와 $scope.subcategory_id를 서비스에 전달하고
     *    > 만약 Promise 객체 실행 후 값을 받았다면?
     *        > pager, category, products, pageRange
     *        > startPageNo, endPageNo를 $scope에 세팅
     * 만약 $scope.triggerEnabled가 false라면?
     * (사용자가 카테고리를 선택하지 않았다면? == 초기값)
     *    > pageNo를 서비스에 전달하고
     *    > 만약 Promise 객체 실행 후 값을 받았다면?
     *        > 위와 같이 $scope에 값을 세팅해준다.
     * ==================================================
     */
    $scope.getList = (pageNo) => {

      if($scope.triggerEnabled) {
        productService
        .getProductList(pageNo, $scope.subcategory_id)
        .then((response) => {
          $scope.pager = response.data.pager;
          $scope.category = response.data.category;
          $scope.products = response.data.products;


          $scope.pageRange = [];
          $scope.startPageNo = $scope.pager.startPageNo;
          $scope.endPageNo = $scope.pager.endPageNo;
          for(let i = $scope.startPageNo; i <= $scope.endPageNo; i++){
            $scope.pageRange.push(i);
          }

        });
      } else {
        productService
        .getProductList(pageNo)
        .then((response) => {
          $scope.pager = response.data.pager;
          $scope.category = response.data.category;
          $scope.products = response.data.products;

          $scope.pageRange = [];
          $scope.startPageNo = $scope.pager.startPageNo;
          $scope.endPageNo = $scope.pager.endPageNo;

          for(let i = $scope.startPageNo; i <= $scope.endPageNo; i++){
            $scope.pageRange.push(i);
          }

          $scope.selected = "Top";
          $scope.subcategories = $scope.category[$scope.selected];
          $scope.subcategory_id = $scope.subcategories[0].subcategory_id;

        });
      }
      /**
       * 사용자가 카테고리를 변경시에 작동하는 이벤트 함수
       * @param {string} selected 
       * ==================================================
       * 작동 원리
       * ==================================================
       * 만약 selected가 'all'이라면?
       *    > triggerEnabled를 false로 바꾸고, getList(1)를 수행한다.
       * 아니라면?
       *    > triggerEnabled를 true로 바꾸고, 선택한 카테고리의 값을 getList와 함께 보낸다.
       * ==================================================
       */
      $scope.changeCategories = (selected) => {
        if(selected === "all"){
          $scope.triggerEnabled = false;
          $scope.getList(1);
        }else {
          $scope.triggerEnabled = true;
          $scope.subcategories = $scope.category[selected];
          $scope.subcategory_id = $scope.subcategories[0].subcategory_id;
          $scope.getList(1, $scope.subcategory_id);
        }
        
      };

      /**
       * 사용자가 서브 카테고리를 변경시에 작동하는 이벤트 함수
       * @param {number} selected 
       */
      $scope.changeSubcategory = (selected) => {
        $scope.triggerEnabled = true;
        $scope.subcategory_id = selected;
        console.log($scope.subcategory_id);
        $scope.getList(1, $scope.subcategory_id);
      }

      /**
       * 데이터베이스에서 받아온 파일 경로를 실제로 가져오기 위해
       * 서버에서 파일을 받을 수 있도록 제공하는 경로와 파일 경로를 
       * 붙여서 파일을 받는 함수
       * @param {string} path 
       * @returns {object} imagefile
       */
      $scope.getImagePath = (path) => {
        if(path === undefined) {
          return;
        }
        const BASE_URL = "http://localhost:8080/image?path=";
        return BASE_URL + path;
      }

      /**
       * 상품 추가 페이지에서 카테고리를 변경시에 작동하는 이벤트 함수
       * @param {string} selected 
       */
      $scope.add_Categories = (selected) => {
        $scope.subcategories = $scope.category[selected.trim()];
        $scope.subcategory_id = $scope.subcategories[0].subcategory_id;
      }

      /**
       * 상품 추가 페이지에서 서브 카테고리를 변경시에 작동하는 이벤트 함수
       * @param {number} selected 
       */
      $scope.add_Subcategories = (selected) => {
        $scope.subcategory_id = selected;
      }

      /**
       * 상품 추가 페이지에서 추가 버튼을 클릭시에 작동하는 이벤트 함수
       * @param {object} item 
       * ==================================================
       * 작동 원리
       * ==================================================
       * 만약 메인 이미지, 캐러셀 이미지, 디테일 이미지 배열의 크기가 1 이하라면? (존재 하지 않는다면?)
       *  > 이미지를 업로드 하라고 alert을 날려주고, 함수를 종료한다.
       * 만약 item object의 값들이 다 존재한다면?
       *  1. 먼저 상품을 추가하기 위해서 선행되야 하는 작업이 
       *  메인 이미지 업로드와 상품의 시퀀스를 받아와야 한다.
       *  이 두 작업이 완료 되기 전까지는 상품 추가가 실행되면 안되기 때문에
       *  addItem 함수를 async function으로 만들고
       *  비동기 작업들을 순차적으로 진행해야 하기에 await로
       *  작업이 완료시까지 다음 코드로의 진행을 잠시 일시 중지하고 받아올때 까지 기다린다.
       *  그리하여 상품의 메인 이미지와 시퀀스 가져오기를 끝낸 후
       *  2. 받아온 정보를 이용하여 상품의 객체와 사이즈 배열, 색상 배열을 
       *  보내고 서버에서 값이 반환되기 까지 기다린다.
       *  3. 작업이 끝났다면, 캐러셀 이미지, 디테일 이미지의 배열을 처리하고,
       *  image를 base64로 컨버팅 한 후, 파일이름, 타입등을 JSON 객체로 만들고
       *  서버에 값을 전달한다.
       *  4. 모든 작업이 끝난 후 해당하는 상품의 상세 페이지로 이동한다.
       * ================================================== 
       */
      $scope.addItem = async (item) => {

        const ENTER_SYMBOL = /\n/;

        
        // 이미지 가져오기
        let mainImageEl = document.querySelector('#mainImage').files;
        let carouselImageEl = document.querySelector("#carouselImage").files;
        let detailImageEl = document.querySelector('#detailImage').files;

        if(mainImageEl.length < 1 || carouselImageEl.length < 1 || detailImageEl.length < 1 ){
          alert("이미지를 선택하지 않으셨습니다. 이미지를 선택 후 다시 추가를 해주세요.")
          return;
        } 

        if(item && item.sizes && item.colors && item.product_price && item.product_name && item.content && item.subcontent){
            // 1차적으로 메인 이미지를 업로드하고, 주소를 얻어온다.
             let formData = new FormData();
             formData.append("uploadFile", mainImageEl[0]);
             try {
              let product_image = await productService.uploadMainImage(formData);


              let sendData = {
                "products" : {
                  "product_name" : item.product_name,
                  "product_price" : item.product_price,
                  "product_content" : item.content,
                  "product_subcontent" : item.subcontent,
                  product_image,
                  "subcategory_id" : $scope.subcategory_id
                },
                "sizes" : item.sizes.split(","),
                "colors" : item.colors.split(",")
              }

              const product_id = await productService.postProducts(sendData);

              for(let file of carouselImageEl){
                const base64Data = await toBase64(file);
                let data = {
                  "type" : "carousel",
                  "filename" : getUUID() + ".jpg",
                  "product_id" : product_id,
                  "base64" : base64Data
                };
                await productService.uploadImages(data);
              }

              for(let file of detailImageEl) {
                const base64Data = await toBase64(file);
                let data = {
                  "type" : "detail",
                  "filename" : getUUID() + ".jpg",
                  "product_id" : product_id,
                  "base64" : base64Data
                };
                await productService.uploadImages(data);
              }

              alert("성공적으로 업로드 되었습니다. 상품 상세 페이지로 이동합니다.");
              $window.location.href = `/#!/admin/product/${product_id}`;
              console.log("여기도 찍히면 안됩니다.");
             } catch (error) {
               console.log(error);
             }

             
        } else {
          alert("상품 정보에 비어있는 값이 존재합니다. 다시 작성해주세요.")
        }

      };
    

      /**
       * 파일을 base64 string으로 바꾸는 Promise 함수
       * @param {File} file 
       * @returns 
       *  > 성공시 resolve(reader.result);
       *  > 실패시 reject(error);
       */
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      /**
       * 이미지 파일을 base64로 컨버팅 할 때에 
       * 파일 이름을 UUID로 생성 전략을 취하기 위해
       * 만든 함수
       * @returns {string} v.toString(16)
       */
      const getUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
          return v.toString(16);
        });
      };

      /**
       * 상품 상세 페이지에서 상품 수정을 클릭 시에 작동하는 이벤트 함수
       * ==================================================
       * 작동 원리
       * ==================================================
       * 만약 이미지 + 정보가 같이 들어왔다면?
       *  > 메인 이미지를 업로드 시까지 await하고,
       *  > 상품을 업로드 하고, Promise 객체가 resolve되었다면?
       *    > 업데이트 성공이라고 alert해준 뒤 새로고침 해준다.
       * 만약 정보만 들어왔다면?
       *  > 상품을 업로드하고, Promise 객체가 resolve 된 뒤 alert해준다.
       * ==================================================
       */
      $scope.modifyProducts = async () => {
        let product_name = $('#product_name').val();
        let product_price = $('#product_price').val();
        let product_content = $('#contentTextarea').val();
        let product_subcontent = $('#subTextarea').val();
        let mainImage= document.querySelector("#mainImage").files[0];

        let isUploadWithImage = product_name && product_price && product_content && product_subcontent && mainImage;
        let isUploadOnlyContent = product_name && product_price && product_content && product_subcontent;
        // 이미지가 존재하지 않고 내용만 수정한다면?
        if(isUploadWithImage){
          let formData = new FormData();
          formData.append("uploadFile", mainImage);

          let product_image = await productService.uploadMainImage(formData);
          let data = {
            "product_id" : $scope.productInfo.product_id,
            product_name, product_price, product_content, product_subcontent, product_image
          };

          productService
            .updateProduct(data)
            .then((response) => {
              console.log("업데이트 성공", response);
              $window.location.reload()
          })

        } else if (isUploadOnlyContent) {
          let product_image = $scope.productInfo.product_image;
          let data = {
            "product_id" : $scope.productInfo.product_id,
            product_name, product_price, product_content, product_subcontent, product_image
          };
          productService
          .updateProduct(data)
          .then((response) => {
            console.log("업데이트 성공", response)
            $window.location.reload()
          })

        } else {
          alert("내용을 입력해주세요");
          return ;

        }
      }
    };

    /**
     * 상품 상세 페이지에서 삭제 버튼을 클릭시에 작동하는 이벤트 함수
     * ==================================================
     * 작동 원리
     * ==================================================
     * 만약 confirm의 result가 true라면?
     *  > $scope에 있는 product_id를 받아서 삭제 후 상품 리스트 페이지로 이동
     * 아니라면?
     *  > 함수 실행을 종료한다.
     */
    $scope.removeProduct = () => {
      const result = confirm("삭제하시겠습니까?");
      if(result) {
        productService
        .deleteProduct($scope.productInfo.product_id)
        .then((response) => {
          alert("삭제되었습니다.")
          $location.url('/admin/product');
        });
      } else {
        return;
      }
    

    }
  });


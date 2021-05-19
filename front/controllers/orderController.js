/* eslint-disable */
angular.module("app")
  .controller("orderController", function($scope, $rootScope, $location, orderService){
    $scope.$on("$routeChangeSuccess", () => {
      //처음으로 1페이지를 보여주기
      $scope.getList(1);
    });

    //model.orderId, model.delivery 초기값 null로 설정
    $scope.model = {
      orderId: null,
      delivery: null
    }
    //select가 바뀔 때, model.orderId, model.delivery null로 설정
    $scope.searchChange = () => {
      $scope.model.orderId = null;
      $scope.model.delivery = null;
    }

    $scope.view = "list";
    $scope.getView = () => {
      switch($scope.view) {
        case "list": return "views/order/orderList.html";
        case "read": return "views/order/detail.html";
        case "modify": return "views/order/modify.html";
      }
    };

    //검색조건이 없고, 페이지번호를 클릭했을 때
    $scope.getList = (pageNo) => {
      orderService.list(pageNo)
        .then((response) => {
          $scope.pager = response.data.pager;
          $scope.orders = response.data.orders;
          $scope.pageRange = [];
          for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++) {
            $scope.pageRange.push(i);
          }
          $scope.view = "list";
        });
    };

    //검색조건이 있고, 검색버튼을 눌렀을 때
    $scope.searchListBtn = (pageNo, model) => {
        orderService.list(pageNo, model.orderId, model.delivery)
        .then((response) => {
          $scope.pager = response.data.pager;
          $scope.orders = response.data.orders;
          $scope.pageRange = [];
          for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++) {
            $scope.pageRange.push(i);
          }
          $scope.view = "list";
      });
    };

    //보기버튼을 눌렀을 때
    $scope.read = (orderId) => {
      orderService.read(orderId)
        .then((response) => {
          $scope.order = response.data.order;
          $scope.member = response.data.member;
          $scope.products = response.data.orderInfoList;
          $scope.totalPrice = response.data.totalPrice;
          //view 변경
          $scope.view = "read";
        });
    };

    //수정버튼을 눌렀을 때, view 변경
    $scope.modifyForm = () => {
      $scope.view = "modify";
    };

    //저장버튼을 눌렀을 때
    $scope.modifyOrder = (order) => {
      orderService.modify(order)
        .then((response) => {
          console.log(response.data);
          $scope.order = response.data.order;
          $scope.view = "read";
        });
    };

});
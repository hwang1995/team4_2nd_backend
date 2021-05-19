/* eslint-disable */
angular
  .module("app")
  .factory("orderService", function($http) {
    const BASE_URL = "http://localhost:8080/api/orders";
    return {
      // 주문 리스트를 가져오기 위해 제공하는 서비스
      list: function(pageNo=1, orderId, delivery) {
        if((orderId === null && delivery === null)||(orderId === undefined && delivery === undefined)){
          //전체주문 (orderId, delivery의 값이 들어오지 않았을 때)
          const promise = $http.get(BASE_URL + "?pageNo=" + pageNo, {params:{pageNo}});
          return promise;
        } else if(delivery === null) {
          //주문번호로 검색 (delivery가 null이고 orderId가 있을 때)
          const promise = $http.get(BASE_URL + "?pageNo=" + pageNo + "&orderId=" + orderId , {params:{pageNo}});
          return promise;
        } else {
          //배송상태로 검색
          const promise = $http.get(BASE_URL + "?pageNo=" + pageNo + "&delivery=" + delivery, {params:{pageNo}});
          return promise;
        }
      },
      // 주문 상세를 가져오기 위해 제공하는 서비스
      read: function(orderId) {
        const promise = $http.get(BASE_URL + "/" + orderId);
        return promise;
      },
      // 주문정보를 수정하기 위해 제공하는 서비스
      modify: function(order) {
        const promise = $http.put(BASE_URL, order);
        return promise;
      }
    }
  });
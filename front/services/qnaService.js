/* eslint-disable */
angular
  .module("app")
  .factory("qnaService", function($http) {
    const BASE_URL = "http://localhost:8080/api/qna";

    return {
      //전체 목록 조회
      list: function(pageNo=1) {
        const promise = $http.get(BASE_URL, {params:{pageNo}});
        return promise;
      },
      //검색 옵션에 따라 조회
      listBySearch: function(pageNo=1, search) {
        if(search.email != "") {
          const promise = $http.get(BASE_URL + "?member_email=" + search.email, {params:{pageNo}});
          return promise;
        } else if(search.category != "") {
          var category;
          if(search.category == "상품문의") {
            category = "products";
          } else if(search.category == "배송문의") {
            category = "delivery";
          } else if(search.category == "교환문의") {
            category = "exchange";
          } else {
            category = "etc";
          }
          const promise = $http.get(BASE_URL + "?qna_category=" + category, {params:{pageNo}});
          return promise;
        } else if(search.answer != "") {
          const promise = $http.get(BASE_URL + "?qna_answer=" + search.answer, {params:{pageNo}});
          return promise;
        }
      },
      //qna_id로 해당하는 것 조회
      read: function(qna_id) {
          const promise = $http.get(BASE_URL + "/" + qna_id);
          return promise;
      },
      //update를 해주고 mail을 전송
      update: function (qna, mail) {
          const promise = $http.put(BASE_URL, qna);
          const emailSend = $http.post("http://localhost:8080/api/mail", mail);
          return promise;
      },
      //Q&A 삭제
      delete: function (qna_id) {
          const promise = $http.delete(BASE_URL + "/" + qna_id);
          return promise;
      }
    }
  });
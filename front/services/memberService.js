/* eslint-disable */
angular
  .module("app")
  .factory("memberService", function($http) {
    //spring boot 서버의 members 경로 설정
    const BASE_URL = "http://localhost:8080/api/members";

    return {
      //회원 리스트 서비스(get)
      list: function(pageNo=1, email, name) {
        //검색 조건이 없을 경우 전체 회원 리스트와 페이저를 가져옴
        if((email == "" && name =="") || (email === undefined && name === undefined)) {
          const promise = $http.get(BASE_URL + "?pageNo=" + pageNo, {params: {pageNo}});
          return promise;
        }
        //검색 조건으로 email이 있을 경우 email로 검색한 회원 리스트와 페이저를 가져옴
        else if (name == "") {
          const promise = $http.get(BASE_URL + "?pageNo=" + pageNo + "&email=" + email, {params: {pageNo}});
          return promise;
        }
        //검색 조건으로 name이 있을 경우 name으로 검색한 회원 리스트와 페이저를 가져옴
        else if(email == "") {
          const promise = $http.get(BASE_URL + "?pageNo=" + pageNo + "&name=" + name, {params: {pageNo}});
          return promise;
        }
     },
     //회원 수정 서비스(put)
     modify: function(member) {
      const promise = $http.put(BASE_URL, member);
      return promise;
     },
     //회원 삭제 서비스(delete)
     delete: function(member_id) {
       const promise = $http.delete(BASE_URL + "/" + member_id);
       return promise;
     }
    }
  });
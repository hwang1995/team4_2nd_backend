/* eslint-disable */
angular
  .module("app")
  .factory("authService", function($http) {
    //spring boot 서버의 auth 경로 설정
    const BASE_URL = "http://localhost:8080/api/auth";

    return {
      //로그인 서비스(post)
      login : function(user) {
        const promise = $http.post(BASE_URL + "/login", user);
        return promise;
      },
      //회원가입 서비스(post)
      register : function(user) {
        const promise = $http.post(BASE_URL + "/register", user);
        return promise;
      },
      //email이 존재하는지 확인하기 위한 서비스(post)
      existed_email : function(user) {
        const promise = $http.post(BASE_URL + "/existed-email", user);
        return promise;
      }
    }
  });
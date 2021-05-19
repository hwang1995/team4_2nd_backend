/* eslint-disable */
angular
  .module("app")
  .factory("dashService", function ($http) {
    const BASE_URL = "http://localhost:8080/api/dashboard";

    return {
      getDashboardInfo : function () {
        return $http.get(BASE_URL);
      }
    }

  })
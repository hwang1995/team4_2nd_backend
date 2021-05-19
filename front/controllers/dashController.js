/* eslint-disable */
angular
  .module("app")
  .controller("dashController", function ($scope, $rootScope, $location, dashService) {
    //로딩이 아직 안되었을 때 spinner를 보여주기 위한 scope
    $scope.isLoaded = false;

    //routeChangeSuccess되었을 때, 필요한 값을 가져와서 세팅해줌
    $scope.$on("$routeChangeSuccess", function () {
      // 로그인이 되어있지 않다면 메인 페이지로 이동시킨다.
      if(!$rootScope.email){
        alert("비정상적인 경로로 접근하셨습니다. 로그인 페이지로 이동합니다.");
        $location.url('/');
        return;
      } else {
        dashService
        .getDashboardInfo()
        .then((response) => {
          $scope.totalMembers = response.data.totalMembers;
          $scope.totalQnaFinished = response.data.totalQnaFinished;
          $scope.totalQnaWaiting = response.data.totalQnaWaiting;
          $scope.totalDeliveryFinished = response.data.totalDeliveryFinished;
          $scope.totalDeliveryWaiting = response.data.totalDeliveryWaiting;
          $scope.totalProducts = response.data.totalProducts;
          $scope.chart = response.data.chart;
          $scope.labels = [];
          $scope.data = [];
          $scope.tempData = [];
          $scope.series = ["총매출액"];

          for(let chartInfo of $scope.chart){
            $scope.labels.push(chartInfo.order_date.substring(2,10));
            $scope.tempData.push(chartInfo.sum_price / 10000);
          }
          $scope.data = [$scope.tempData];
          $scope.isLoaded = true;
        })
      }
      
    });   
  })
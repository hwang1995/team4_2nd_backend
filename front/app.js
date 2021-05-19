angular
  .module("app", ["ngRoute", "chart.js"])
  .config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
      chartColors : ['#1c7ed6', '#FF8A80'],
      responsive : true
    });

    ChartJsProvider.setOptions('bar', {
      showLines : true,

    });

  }])
  .run(function($rootScope, $http) {
    // sessionStorage에 email, authToken이 있는지 확인
    $rootScope.email = sessionStorage.getItem("email");
    $rootScope.authToken = sessionStorage.getItem("authToken");
  


    // $rootScope.authToken의 값이 변경될 떄에 헤더를 넣을지 안넣을지 확인
    $rootScope.$watch("authToken", (newValue) => {
      if(newValue){
        // 로그인 시에 넣어도 된다.
        $http.defaults.headers.common.authToken = newValue;
      } else {
        // 로그아웃 시에 넣어도 된다.
        delete $http.defaults.headers.common.authToken;
      }

    });
  })
  .filter('trim', function () {
    return function(value) {
      if(!angular.isString(value)){
        return value;
      }
      return value.replace(/^\s+|\s+$/g, '')
    }
  })
  .controller("mainController", function($scope, $location, $route, authService, $window, $rootScope, $location, $timeout) {
    //로그인 되어 있지 않을 때 접속 경로 제한
    $scope.$on("$routeChangeSuccess", function () {
      if($location.url() === "" || $location.url() === "/" || $location.url() === "/register") {
        // console.log("정상적인 경로");
        // console.log($rootScope.authToken);
      } else {
        if($rootScope.authToken == null) {
          alert("비정상적인 경로로 접근하셨습니다. 로그인 페이지로 이동합니다.")
          $location.url("/");
        }
      }
    })

    // 로그인 처리
    $scope.login = (user) => {
      console.log("USER", user);
      authService
        .login(user)
        .then((response) => {
          console.log(response);
          $rootScope.email = response.data.email;
          $rootScope.authToken = response.data.authToken;

          sessionStorage.setItem("email", response.data.email);
          sessionStorage.setItem("authToken", response.data.authToken);

          $location.url("/admin");
        })
        .catch((response) => {
          $window.alert("로그인에 실패하였습니다.");
          console.log(response);
        });
    };

    //사이드바의 메뉴를 클릭할 경우 reload
    $scope.reloadable = (path) => {
      if($location.url().includes(path)){
        $route.reload();
      }
    };

    //회원가입 폼으로 이동
    $scope.registerForm = () => {
      $location.url("/register");
    };

    //회원가입
    $scope.register = (user) => {
      //유효성 검사
      const emailRegExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      const telRegExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
      const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/; //  8 ~ 10자 영문, 숫자 조합

      const emailElem = $("#emailInput").val();
      const nameElem = $("#nameInput").val();
      const passwordElem = $("#passwordInput").val();
      const telElem = $("#telInput").val();
      const addressElem = $("#adressInput").val();
      const ageAgreement = $("#ageAgreement").prop("checked");
      const adminAgreement = $("#adminAgreement").prop("checked");
      const agreement = $("#agreement").prop("checked");

      console.log(ageAgreement);
      if(!emailElem){
        alert("이메일을 입력해주세요.");
        return;
      } else if(!emailRegExp.test(emailElem)){
        alert("이메일 형식이 올바르지 않습니다.");
        return;
      }
      if(!passwordElem){
        alert("비밀번호를 입력해주세요.");
        return;	
      } else if(!passwordRegExp.test(passwordElem)){
        alert("비밀번호 형식이 올바르지 않습니다.");
        return;
      }
      if(!nameElem){
        alert("이름을 입력해주세요.");
        return;
      }
      if(!telElem){
        alert("전화번호를 입력해주세요.");
        return;
      } else if(!telRegExp.test(telElem)){
        alert("전화번호 형식이 올바르지 않습니다.");
        return;
      }
      if(!addressElem){
        alert("주소를 입력해주세요.");
        return;
      }
      if(!(ageAgreement && adminAgreement && agreement)) {
        alert("약관에 동의해주세요.");
        return;
      }

      //user객체의 이메일이 존재하면 alert, 존재하지 않으면 register
      authService
      .existed_email(user)
      .then((response) => {
        if(response.data) {
          alert("이미 존재하는 이메일입니다.");
          return;
        }else {
          authService
          .register(user)
          .then((response) => {
            $location.url("/");
          });
        }
      });
    };

    //로그아웃 rootScope에 email, authToken 공백으로, 세션에도 email, authToken 삭제
    $scope.logout = () => {
      $rootScope.email = "";
      $rootScope.authToken = "";
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("authToken");
      $location.url('/');
      $route.reload();
    };

    $scope.goPage = (url) => {
      $location.url(url);
    }


  });
/* eslint-disable */
angular
  .module("app")
  .controller("memberController", function($scope, $rootScope, memberService, $location, $route){
  $scope.$on("$routeChangeSuccess", () => {
    if($location.url() === "/admin/member/modify"){
      if($rootScope.member == null){
        alert("비정상적인 경로로 접근하셨습니다.");
        $location.url("/admin/member");
      }
    }
      $scope.getList(1);
  });
  //회원 검색 화면의 ng-include를 위한 list.html 경로 설정
  $scope.view = "list";
  $scope.getView = () => {
    switch($scope.view) {
      case "list" : return "views/member/list.html";
    }
  };
  //pageNo를 가지고 페이저와 전체 회원 리스트 정보를 membersService를 통해 가져옴.
  $scope.getList = (pageNo) => {
    memberService.list(pageNo)
      .then((response) => {
          $scope.pager = response.data.pager;
          $scope.members = response.data.list;
          console.log(response.data.list);
          $scope.pageRange = [];
          for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++) {
              $scope.pageRange.push(i);
          }
          console.log($scope.pager.endPageNo);
          $scope.view = "list";
      });
  };
  //검색 조건에 필요한 search 객체의 email, name을 공백으로 초기화
  $scope.search = {
    email: "",
    name: ""
  };
  //pageNo와 search 객체를 가지고 페이저와 검색된 회원 리스트 정보를 membersService를 통해 가져옴.
  $scope.getSearchList = (pageNo, search) => {
    memberService.list(pageNo, search.email, search.name)
      .then((response) => {
          $scope.pager = response.data.pager;
          $scope.members = response.data.list;
          $scope.pageRange = [];
          if($scope.pager.totalRows == 0) {
            $scope.pager.endPageNo = 1;
          }
          for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++) {
              $scope.pageRange.push(i);
          }
          $scope.view = "list";
      });
  };
  //회원 정보 수정 폼으로 경로 이동
  $scope.modifyForm = (member) => {
    $rootScope.member = member;
    $location.url("/admin/member/modify");
  };
  //회원 정보 수정 폼에서 취소 클릭 시 회원 목록 경로로 이동
  $scope.cancel = () => {
    $location.url("/admin/member");
  };
  //유효성 검사 후 수정될 정보를 가지고 있는 member를 membersService로 보냄.
  $scope.modify = (member) => {
      const telRegExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;

      const nameElem = $("#modifiedName").val();
      const telElem = $("#modifiedTel").val();
      const addressElem = $("#modifiedAddress").val();
      
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

    memberService.modify(member)
    .then((response) => {
      $location.url("/admin/member");
    });
  };
  //member_id를 membersService로 보냄.
  $scope.deleteMember = (member_id) => {
    memberService.delete(member_id)
    .then((response) => {
      alert("삭제되었습니다.");
      $route.reload();
    });
  };

  //검색 조건을 변경할 경우(select의 option이 변할 경우) search 객체를 다시 공백으로 초기화
  $scope.select_change = () => {
    $scope.search.email = "";
    $scope.search.name = "";
  };
});
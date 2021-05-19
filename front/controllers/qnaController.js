/* eslint-disable */
angular
  .module("app")
  .controller("qnaController", function($scope, $rootScope, qnaService, $location){
    $scope.$on("$routeChangeSuccess", () => {
      $scope.getList(1);
    });

    //검색을 위한 scope
    $scope.searchOptions = ["이메일", "분류", "답변상태"];
    $scope.searchOption = "이메일";

    $scope.categorys = ["상품문의", "배송문의", "교환문의", "기타문의"];

    $scope.answers = ["답변중", "답변완료"];

    //ng-include에 보여줄 html을 상황에 따라 다르게 보여줌
    $scope.view = "list";
    $scope.getView = () => {
        switch($scope.view) {
            case "list": return "views/qna/qna.html";
            case "read": return "views/qna/detail.html";
            case "update": return "views/qna/modify.html";
        }
    };

    //ng-change로 select박스가 바뀌었을 때 search를 초기화시켜줌
    $scope.setNull = () => {
      $scope.search = {email:"", category:"", answer:""};
    };

    $scope.search = {email:"", category:"", answer:""};

    //Q&A 목록을 보여줌
    //search가 들어왔을 때는 검색 옵션에 따라 데이터를 다르게 가져옴
    //search가 없다면 모든 Q&A 리스트를 가져옴
    $scope.getList = (pageNo, search) => {
      if(search != null) {
        $scope.search_finished = true;
        qnaService.listBySearch(pageNo, search)
          .then((response) => {
            $scope.pager = response.data.pager;
            $scope.qnas = response.data.qnas;
            $scope.pageRange = [];
            for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++) {
                $scope.pageRange.push(i);
            }
            $scope.view = "list";
          });
      } else {
        qnaService.list(pageNo)
          .then((response) => {
              $scope.pager = response.data.pager;
              $scope.qnas = response.data.qnas;
              $scope.pageRange = [];
              for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++) {
                  $scope.pageRange.push(i);
              }
              $scope.view = "list";
          });
      }
    };

    //qna_id로 해당하는 객체를 가져와 read.html을 보여줌
    $scope.read = (qna_id) => {
      qnaService.read(qna_id)
          .then((response) => {
              $scope.qna = response.data;
              $scope.view = "read";
          });
    };

    //update.html을 보여줌
    $scope.updateQnaForm = () => {
      $scope.qna.qna_answer="";
      $scope.view = "update";
    };

    //read.html을 다시 보여줌
    $scope.cancel = (qna_id) => {
      $scope.read(qna_id);
    };

    //답변 완료시, DB를 업데이트 해주고 email로 답변내용을 보내줌
    $scope.updateQna = (qna) => {
      if(qna.qna_answer) {
        $scope.mail = {address: qna.member_email, title: "고객님이 문의하신 Q&A 답변입니다.", message: qna.qna_answer};
        qnaService.update(qna, $scope.mail)
            .then((response) => {
                $scope.read(qna.qna_id);
            });
      }
    };

    //Q&A 삭제
    $scope.deleteQna = (qna_id) => {
      qnaService.delete(qna_id)
          .then((response) => {
              $scope.getList(1);
          });
    };

    //리스트에 마우스를 가져다 댔을 때 색을 변경
    $scope.handleMouseEvent = (event) => {
      if(event.type === "mouseenter") {
          $(event.target).parent("tr").css("background-color", "#e9ecef");
      } else {
          $(event.target).parent("tr").css("background-color", "#ffffff");
      }
    };

    //삭제 버튼 클릭 시, 확인창을 출력
    $scope.delete_check = (qna_id) => {
      if (confirm("정말 삭제하시겠습니까??") == true){    //확인
          $scope.deleteQna(qna_id);
      } else{   //취소
          return;
      }
    };

    //답변상태에 따라 색깔을 다르게 설정
    $scope.customColor = (answer_status) => {
      if(answer_status == "ⓧ") {
        return "#ff6b6b";
      } else {
        return "#20c997";
      }
    };

    //검색옵션에 마우스를 가져다 댔을 때 색을 변경
    $scope.handleMouseEventSearch = (event) => {
      if(event.type === "mouseenter") {
          $(event.target).css("background-color", "#e9ecef");
      } else {
          $(event.target).css("background-color", "#ffffff");
      }
    };

  });
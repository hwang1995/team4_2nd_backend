/**
 * 페이저 모듈
 * @param {Number} rowsPerPage 페이지당 행 수 
 * @param {Number} pagesPerGroup 그룹당 페이지 수
 * @param {Number} pageNo 현재 페이지 번호 
 * @param {Number} totalRows 전체 행수
 * @returns {Object} pagerObject
 */
const init = (rowsPerPage, pagesPerGroup, pageNo, totalRows) => {   
    var totalPageNo = Math.ceil(totalRows / rowsPerPage);         //전체 페이지 수
    var totalGroupNo = Math.ceil(totalPageNo / pagesPerGroup);    //전체 그룹 수
 
    var groupNo = Math.floor((pageNo - 1) / pagesPerGroup) + 1;   //현재 그룹 번호
    var startPageNo = (groupNo-1) * pagesPerGroup + 1;            //그룹의 시작 페이스 번호
    var endPageNo = startPageNo + pagesPerGroup - 1;              //그룹의 끝 페이지 번호
    if(groupNo == totalGroupNo) endPageNo = totalPageNo;
    
    var startRowNo = (pageNo - 1) * rowsPerPage + 1;              //페이지의 시작 행 번호 0 부터 시작
    var startRowIndex = startRowNo - 1;                           //페이지의 시작 행 번호 1 부터 시작
    var endRowNo = pageNo * rowsPerPage;                          //페이지의 마지막 행 번호   
    var endRowIndex = endRowNo - 1;
 
    return {
       rowsPerPage,
       pagesPerGroup,
       totalRows,
       pageNo,
       totalPageNo,
       totalGroupNo,
       groupNo,
       startPageNo,
       endPageNo,
       startRowNo,
       startRowIndex,
       endRowNo,
       endRowIndex
    };
 };

module.exports = {init};
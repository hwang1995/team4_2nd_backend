/**
 * JSON에 에러 메시지를 감싸서 보내기 위한 모듈
 * @param {String} message 
 * @param {String} description 
 * @returns {Object} response
 */
module.exports = (message, description) => {
    const response = {
        message, description,
    };

    return response;
};
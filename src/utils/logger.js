/**
 * NodeJS의 Console 객체를 전역적으로 사용하기 위해
 * 만든 모듈
 * by SUNG WOOK HWANG
 */

const { Console } = require('console');

module.exports = new Console({ stdout: process.stdout, stderr: process.stderr });
const bcrypt = require('bcrypt');
const db = require('../sequelize/models');
const logger = require('../utils/logger');
const loginMessageWrapper = require('../utils/login-message-wrapper');

const { Op } = db.Sequelize;

const login = async ({ email, password }) => {
    try {
        const memberInfo = await db.Member.findOne({
            where: {
                member_email: email,
                member_authority: 'ROLE_ADMIN',
            },
        });
        const memberEmail = memberInfo.dataValues.member_email;
        logger.info('- MemberService', memberEmail);
        let result = '';
        if(memberInfo) {
            const passwordCheck = await bcrypt.compare(password, memberInfo.dataValues.member_pw);
            logger.info(passwordCheck);
            if(!passwordCheck) {
                result = loginMessageWrapper('wrongPassword', '비밀번호를 잘못 입력하셨습니다.');
            } else {
                result = loginMessageWrapper('success', '로그인 성공');
            }
        } else {
            result = loginMessageWrapper('wrongEmail', '이메일이 존재하지 않습니다.');
        }

        return result;
    } catch (error) {
        logger.info(error);
        throw error;
    }
};

const isExistedEmail = async (memberInfo) => {
    try {
        const memberEmail = memberInfo.member_email;
        const result = await db.Member.findOne({
            where: {
                member_email: memberEmail,
            },
            attributes: ['member_email'],
            
        });
    
        if(result === null) {
            return null;
        }
    
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const registMember = async (memberInfo) => {
    const newMember = memberInfo;
    try {
        newMember.member_authority = 'ROLE_ADMIN';
        newMember.member_enabled = true;
        const result = await db.Member.create(newMember);
        const sendResult = {
            member_id: result.dataValues.member_id,
            member_email: result.dataValues.member_email,
        };
        return sendResult;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const totalRows = async (email, name) => {
    const isOnlyEmail = (email !== undefined) && (name === undefined);
    const isOnlyName = (email === undefined) && (name !== undefined);
    
    let where = {};

    if(isOnlyEmail) {
        where = {
            member_email: email,
        };
    } else if(isOnlyName) {
        where = {
            member_name: name,
        };
    }

    const result = await db.Member.count({ where });

    return result;
};

const getMembersList = async (pager, email, name) => {
    const isOnlyEmail = (email !== undefined) && (name === undefined);
    const isOnlyName = (email === undefined) && (name !== undefined);

    let where = {};

    if(isOnlyEmail) {
        where = {
            member_email: email,
        };
    } else if(isOnlyName) {
        where = {
            member_name: name,
        };
    }

    const result = await db.Member.findAll({
        limit: pager.rowsPerPage,
        offset: pager.startRowIndex,
        order: [
            ['member_id', 'DESC'],
        ],
        where,
        attributes: {
            exclude: ['member_pw', 'member_authority'],
        },
    });
    
    return result;
};

const modifyMemberInfo = async (memberInfo) => {
    try {
        const result = await db.Member.update(memberInfo, {
            where: {
                member_id: memberInfo.member_id,
            },
        });
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const deleteMember = async (memberId) => {
    try {
        const result = await db.Member.destroy({
            where: {
                member_id: memberId,
            },
        });
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

module.exports = {
    login,
    isExistedEmail,
    registMember,
    totalRows,
    getMembersList,
    modifyMemberInfo,
    deleteMember,
};
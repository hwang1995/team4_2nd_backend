const db = require('../sequelize/models');
const logger = require('../utils/logger');

const { Op } = db.Sequelize;

const totalRows = async ({ member_email, qna_category, qna_answer }) => {
    try {
        let where = {};
        if(member_email) {
            // 이메일에 관련된 정보가 없기에 이메일 정보를 가져와야 함.
            const memberInfo = await db.Member.findOne({
                where: { member_email },
            });

            // 만약 회원 정보가 없다면 null을 반환
            if(!memberInfo) {
                return null;
            }

            where = { member_id: memberInfo.dataValues.member_id };
        } else if(qna_category) {
            where = { qna_category };
        } else if (qna_answer) {
            // 답변완료
            if(qna_answer !== '답변중') {
                where = {
                    qna_answer: {
                        [Op.not]: '답변중',
                    },
                };
            } else {
                where = { qna_answer };
            }
        } 
        const result = await db.Qna.count({ where });
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getQnasList = async (pager, { member_email, qna_category, qna_answer }) => {
    try {
        let where = {};
        if(member_email) {
            // 이메일에 관련된 정보가 없기에 이메일 정보를 가져와야 함.
            const memberInfo = await db.Member.findOne({
                where: { member_email },
            });

            // 만약 회원 정보가 없다면 null을 반환
            if(!memberInfo) {
                return null;
            }

            where = { member_id: memberInfo.dataValues.member_id };
        } else if(qna_category) {
            where = { qna_category };
        } else if (qna_answer) {
            // 답변완료
            if(qna_answer !== '답변중') {
                where = {
                    qna_answer: {
                        [Op.not]: '답변중',
                    },
                };
            } else {
                where = { qna_answer };
            }
        } 
        const result = await db.Qna.findAll({
            limit: pager.rowsPerPage,
            offset: pager.startRowIndex,
            order: [
                ['qna_id', 'DESC'],
            ],
            where,
        });

        for await(const { dataValues } of result) {
            // categoryStatus 정의 
            const categoryStatus = {
                products: '상품문의',
                delivery: '배송문의',
                exchange: '교환문의',
                etc: '기타문의',
            };
            
            // qna_answer에 따라 답변 상태 정의
            dataValues.answer_status = (dataValues.qna_answer !== '답변중') ? 'ⓞ' : 'ⓧ';

            // qna_category에 따라 분류 상태 정의
            dataValues.category_status = categoryStatus[dataValues.qna_category];

            const memberInfo = await db.Member.findOne({
                where: { member_id: dataValues.member_id },
                attributes: ['member_email'],
            });

            dataValues.member_email = memberInfo.dataValues.member_email;
            // logger.info(memberInfo);
        }

        // result.dataValues.Qna.answer_status = 'X';
        // Lazy Loading으로 result안에 있는 dataValues에 answer_status, member_email, category_status를 넣어준다
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getQnaDetails = async (qnaId) => {
    try {
        const result = await db.Qna.findOne({
            where: {
                qna_id: qnaId,
            },
        });
        const { member_id } = result.dataValues;
        const memberInfo = await db.Member.findOne({
            where: { member_id },
            attributes: ['member_email'],
        });

        const { member_email } = memberInfo.dataValues;
        result.dataValues.member_email = member_email;
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const modifyQna = async (qnaInfo) => {
    try {
        const result = await db.Qna.update(qnaInfo, {
            where: {
                qna_id: qnaInfo.qna_id,
            },
        });
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const deleteQna = async (qnaId) => {
    try {
        const result = await db.Qna.destroy({
            where: {
                qna_id: qnaId,
            },
        });
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

module.exports = {
    totalRows,
    getQnasList,
    getQnaDetails,
    modifyQna,
    deleteQna,
};
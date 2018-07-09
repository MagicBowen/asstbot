const logger = require('../utils/logger').logger('mongo-statistic');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    value : String,
    count : Number
});

const SubjectSchema = new Schema({
    id : Number,
    answers : [AnswerSchema]
});

mongoose.model('SurveyStatistics', new Schema({
    surveyId: { type: String, unique: true, required: true},
    subjects: [SubjectSchema],
}, { timestamps: { createdAt: 'created_at' } }));

const SurveyStatistic = mongoose.model('SurveyStatistics');

const model = {};

model.getSurveyStatistic = async (surveyId) => {
    logger.debug(`Looking up survey statistic by survey id ${surveyId}`);
    return await SurveyStatistic.findOne({surveyId : surveyId}).exec();
}

model.getEmptyStatisticBy = (survey) => {
    return {
        surveyId : survey.id,
        subjects : survey.subjects.map(subject => {
            return {
                id : subject.id,
                answers : subject.answers.map(answer => {
                    return {
                        value : answer.value,
                        count : 0
                    }
                })
            }
        })
    };
}

model.addSurveyStatistic = async (survey) => {
    logger.debug(`add new survey Statistic for survey ${survey.id}`);
    const newStatistic = new SurveyStatistic(model.getEmptyStatisticBy(survey));
    await newStatistic.save();
    logger.debug(`add new survey statistic for ${survey.id} successful!`);    
};

const updateSurveyResultInStatistic = (surveyResult, statistic) => {
    for (let answer of surveyResult.answers) {
        const id = answer.id;
        for (let result of answer.result) {
            for (let statisticSubject of statistic.subjects) {
                if (id !== statisticSubject.id) continue;
                for (let statisticAnswer of statisticSubject.answers) {
                    if (statisticAnswer.value === result.value) {
                        statisticAnswer.count++;
                    }
                }
            }
        }
    }
    return statistic;
}

model.addSurveyResult = async (surveyResult) => {
    logger.debug(`add new survey result for statistic of survey ${surveyResult.surveyId}`);
    let statistic = await SurveyStatistic.findOne({surveyId : surveyResult.surveyId}).exec();
    let newStatistic = updateSurveyResultInStatistic(surveyResult, statistic.toObject());
    statistic.set(newStatistic);
    await statistic.save();
    logger.debug(`update survey result to statistic of survey ${statistic.surveyId} successful!`);
}

model.updateSurveyStatistic = async (statistic) => {
    logger.debug(`update survey statistic for ${statistic.surveyId}`);
    const oriSurveyStatistic = await SurveyStatistic.findOne({surveyId : statistic.surveyId}).exec();
    if (!oriSurveyStatistic) {
        throw Error(`update unexisted survey statistic of survey ${statistic.surveyId}`);
    }
    oriSurveyStatistic.set(statistic);
    await oriSurveyStatistic.save();
    logger.debug(`update survey statistic of survey ${statistic.surveyId} successful!`); 
};

model.deleteSurveyStatistic = async (surveyId) => {
    await SurveyStatistic.deleteOne({surveyId : surveyId});
    logger.debug(`delete survey statistic ${surveyId} successful!`);    
}

module.exports = model;
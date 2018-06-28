const logger = require('../utils/logger').logger('mongo-survey');
const mongoose = require('mongoose');
const uuid = require('node-uuid');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    value : String,
    correct : Boolean
});

const SubjectSchema = new Schema({
    id: Number,
    type : String,   // single-choice | multiple-choice | text
    question : String,
    answers  : [AnswerSchema]
});

const ConclusionSchema = new Schema({
    scoreRange : {
        min : Number,
        max : Number
    },
    text  : String
});

mongoose.model('Surveys', new Schema({
    id      : { type: String, unique: true, required: true},
    userId  : { type: String, unique: true, required: true},
    type    : { type: String, required: true }, // inquiry | poll | exam
    title   : { type: String, required: true},
    subjects: [SubjectSchema],
    conclusions : [ConclusionSchema]
}, { timestamps: { createdAt: 'created_at' } }));

mongoose.model('SurveysResults', new Schema({
    id      : { type: String, unique: true, required: true},
    userId  : { type: String, unique: true, required: true},
    answers : [AnswerSchema],
    score   : Number
}, { timestamps: { createdAt: 'created_at' } }));

const Survey = mongoose.model('Surveys');
const SurveyResult = mongoose.model('SurveyResults');

const model = {};

model.getSurveyById = async (id) => {
    logger.debug(`Looking up survey by id ${id}`);
    return await Survey.findOne({id : id}).exec();
};

model.getSurveyByUser = async (userId) => {
    logger.debug(`Looking up survey by user id ${userId}`);
    return await Survey.find({userId : userId}).exec();
};

model.addSurvey = async (userId, survey) => {
    logger.debug(`add new survey for user ${userId}`);
    const newSurvey = new Survey({
        id : uuid.v1(),
        userId : userId,
        type : survey.type,
        title: survey.title,
        subjects: survey.subjects,
        conclusions: survey.subjects
    });
    await newSurvey.save();
    logger.debug(`Add new survey ${newSurvey.id} for user ${userId} successful!`);    
};

model.updateSurvey = async (userId, survey) => {
    if (!survey.id) {
        model.addSurvey(userId, survey);
        return;
    }

    logger.debug(`update survey ${survey.id} for user ${userId}`);
    const oriSurvey = await Survey.findOne({id : survey.id}).exec();
    if (!oriSurvey) {
        throw Error(`update unexisted survey ${survey.id} of user ${userId}`);
    }
    logger.debug(`update survey ${newSurvey.id} for user ${userId}`);
    oriSurvey.set(survey);
    await oriSurvey.save();
    logger.debug(`update survey ${newSurvey.id} for user ${userId} successful!`);    
};

module.exports = model;

const mongoosePaginate = require('mongoose-paginate');
const timeZone = require('mongoose-timezone');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let ProfitSchema = mongoose.Schema({
        pf_member_id: {type: Number, required: true}
        , pf_member_name: {type: String, required: true}
        , pf_member_phone: {type: String, required: true}
        , pf_value: {type: Number, required: true}
        , pf_type: {type: String, required: true}
        , pf_category: {type: String, required: true}
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('ProfitSchema 정의함.');

    ProfitSchema.plugin(mongoosePaginate);
    ProfitSchema.plugin(timeZone, { paths: ['created_at'] });

    return ProfitSchema;
};

module.exports = Schema;


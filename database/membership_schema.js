const mongoosePaginate = require('mongoose-paginate');
const timeZone = require('mongoose-timezone');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let MembershipSchema = mongoose.Schema({
        ms_member_id: {type: Number, required: true}
        , ms_member_name: {type: String, required: true}
        , ms_member_phone: {type: String, required: true}
        , ms_value: {type: Number, required: true}
        , ms_type: {type: String, required: true}
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('MembershipSchema 정의함.');

    MembershipSchema.plugin(mongoosePaginate);
    MembershipSchema.plugin(timeZone, { paths: ['created_at'] });

    return MembershipSchema;
};

module.exports = Schema;


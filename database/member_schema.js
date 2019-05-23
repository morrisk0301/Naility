const mongoosePaginate = require('mongoose-paginate');
const timeZone = require('mongoose-timezone');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let MemberSchema = mongoose.Schema({
        member_name: {type: String, required: true}
        , member_phone: {type: String, required: true}
        , member_membership: {type: Number, 'default': 0}
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('MemberSchema 정의함.');

    MemberSchema.plugin(mongoosePaginate);
    MemberSchema.plugin(timeZone, { paths: ['created_at'] });

    return MemberSchema;
};

module.exports = Schema;


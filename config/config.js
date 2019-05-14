module.exports = {
    db_url: 'mongodb://localhost:27017/naility',
    db_schemas: [
        {file:'./user_schema', collection:'user', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./procedure_schema', collection:'procedure', schemaName:'ProcedureSchema', modelName:'ProcedureModel'},
        {file:'./member_schema', collection:'member', schemaName:'MemberSchema', modelName:'MemberModel'},
        {file:'./appointment_schema', collection:'appointment', schemaName:'AppointmentSchema', modelName:'AppointmentModel'},
    ],
};
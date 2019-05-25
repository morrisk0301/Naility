var Excel = require('exceljs');

var workbook = new Excel.Workbook();
var worksheet = workbook.addWorksheet('My Sheet');
worksheet.columns = [
    { header: '아이디', key: 'id'},
    { header: '이름', key: 'name'},
    { header: '연락처', key: 'contact' }
];
worksheet.addRow({id: "oceanfog", name: '경록', contact: "010-3588-6265"});
worksheet.addRow({id: "oceanfog2", name: '경록2', contact: "010-3588-6265"});

workbook.xlsx.writeFile("hello.xlsx").then(function() {
    // done
    console.log("success");
});

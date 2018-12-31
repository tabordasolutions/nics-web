({
    dir: '../../../target/classes/META-INF/resources/js/nics/modules/',

    paths: {
        'ol': 'empty:',
        'ext': 'empty:',
        'd3': 'empty:',
        'iweb/CoreModule': 'empty:',
        'nics/modules/UserProfileModule': 'empty:',
        'iweb/modules/MapModule' : 'empty:',
        'nics/modules/GeneralReportModule': 'empty:',
        'nics/modules/DamageReportModule': 'empty:',
        'nics/modules/RocReportModule': 'empty:',
        'nics/modules/FmagReportModule': 'empty:',
        'nics/modules/I215ReportModule': 'empty:',
    },

    modules: [{
            name: 'report',
            create: true,
            include: ['nics/modules/ReportModule', 'nics/modules/report/common/ReportTableController', 'nics/modules/report/common/ReportTableView', 'nics/modules/report/common/ReportImageModel', 'nics/modules/report/common/UserPickerView', 'nics/modules/report/common/BarChart', 'nics/modules/report/common/FormVTypes', 'nics/modules/report/common/PieChart'],
        }],
    removeCombined: true,
    skipDirOptimize: true
})

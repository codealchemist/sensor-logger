db.log.aggregate([
    {$unwind: '$data'},
    {$project: {
        _id: 0,
        temp: '$data.value',
        date: {$dateToString: {
            format: '%Y-%m-%d %H:%M',
            date: '$data.date'
        }}
    }}
])
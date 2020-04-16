const {db, Tasks, Notes} = require('./db')

// adding some initial data
async function addTask(){
    await db.sync()

    await Tasks.bulkCreate([
        {
            title: 'Node-js',
            description: 'Learning Basic of Node JS'
        },
        {
            title: 'Angular',
            description: 'Learning Basic of Angular'
        },
        {
            title: 'Java',
            description: 'Learning Advance Java'
        }
    ])

    await Notes.bulkCreate([
            {taskId: 1, note: 'Use Express'},
            {taskId: 1, note: 'Use Sequelize'},
            {taskId: 1, note: 'Use SQLite'},
            {taskId: 2, note: 'Learn TypeScript'}
    ])
}

addTask()
const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/tasks.db'
})

// returns the tommorow date
const tommorowDate = () => {
    const today = new Date()
    const tommorow = new Date(today)
    tommorow.setDate(tommorow.getDate() + 1)
    return tommorow
}

// task table
const Tasks = db.define('task', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    date: {
        type: Sequelize.DATEONLY,
        defaultValue: tommorowDate()
    },
    priority: {
        type: Sequelize.STRING,
        defaultValue: "medium"                           
    },
    state: {
        type: Sequelize.STRING,
        defaultValue: "incomplete"                        
    }
})

// notes table
const Notes = db.define('notes',{
    notesId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    note: {
        type: Sequelize.STRING,
        allowNull: false
    },
    taskId:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

// one to many relationship between tasks and notes
// Tasks.hasMany(Notes, {foreignKey: 'notesId'})
// Notes.belongsTo(Tasks)

module.exports = {
    db, Tasks, Notes
}
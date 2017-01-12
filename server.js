var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var nodeadmin = require('nodeadmin');
var Sequelize = require("sequelize");
var app = new express();

app.use(bodyParser.json());
app.use(cors());
app.use(nodeadmin(app));
app.use('/admin', express.static('admin'));

//INIT SEQUELIZE CONNECTION
var sequelize = new Sequelize('DBAH','alexandrahajnal','',{
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306
});

//BOOKS TABLE
var BOOKS = sequelize.define('books',{
    book_id: { type: Sequelize.INTEGER, field: 'book_id', primaryKey: true, autoIncrement: true },
    book_name: { type: Sequelize.STRING, field: 'book_name'},
    description : { type: Sequelize.STRING, field: 'description'},
}, { timestamps: false,
      classMethods: {
        associate: function(models){
            BOOKS.belongsTo(models.AUTHORS, {
          //  foreignKey: 'id', //autogenerates
             onDelete: "CASCADE"
            });
        }
    }
});

//AUTHORS TABLE
var AUTHORS = sequelize.define('authors',{
    id_author: { type: Sequelize.INTEGER, field: 'id_author', primaryKey: true, autoIncrement: true},
    name_author : { type: Sequelize.STRING, field: 'name_author'},
    about : { type: Sequelize.STRING, field: 'about'},
}, { timestamps: false,
        classMethods: {
        associate: function(models){
           AUTHORS.hasMany(models.BOOKS);
        }
     }
});

// //RELATION BETWEEN TABLES
// BOOKS.belongsTo(AUTHORS, { 
//     //foreignKey: 'id'
//     onDelete: "CASCADE" 
//     });
// AUTHORS.hasMany(BOOKS);

// //ADD BOOK IN BOOKS TABLE
// BOOKS.create({id:1, name:"Fluturi", author_name:"Irina Binder"}).then(function(task){
//     task.save();
// });
// AUTHORS.create({id:1, id_author: 1, description: " my description"}).then(function(task){
//     task.save();
// });

// //ADD BOOK IN BOOKS TABLE
// BOOKS.create({id:2, name:"Poezii", author_name:"Eminescu"}).then(function(task){
//     task.save();
// });
// AUTHORS.create({id:2, id_author: 2, description: " my description 2"}).then(function(task){
//     task.save();
// });

// //FIND BOOK WITH ID=1
// BOOKS.findAll({
//     where:{ id:1 }
// }).then(function(foundObject){
//     console.log("FOUNDED! BOOK: ID: " + foundObject[0].id + " NAME: " + foundObject[0].name);
// }).catch(function(err) {
//     console.log(err);
// });

//-------------------BOOKS REST-----------------------------------
//READ all
app.get('/books', function(request, response){
    BOOKS.findAll().then(function(books){
      response.status(200).send(books); 
    });
});
    
//CREATE NEW BOOK
app.post('/books', function(request, response){
    BOOKS.create(request.body).then(function(book){
        BOOKS.findById(book.id).then(function(book){
            response.status(201).send;
        });
    });
});

//READ ONE BOOK BY ID
app.get('/books/:id',function(request, response){
    BOOKS.findById(request.params.id).then(function(book){
        if(book){
            response.status(200).send(book);
        } else {
            response.status(404).send();
        }
    });
});

//UPDATE BOOK BY ID
app.put('/books/:id',function(request, response){
    BOOKS.findById(request.params.id).then(function(book){
            if(book){
                book.updateAttributes(request.body).then(function(){
                        response.status(200).send('Book updated!');
                    }).catch(function(error){
                        console.warn(error);
                        response.status(500).send('SERVER ERROR!!!');
                    });
            } else {
                 response.status(404).send();
            }
        });
});

//DELETE BOOK BY ID
app.delete('/books/:id',function(request, response){
 BOOKS.findById(request.params.id).then(function(book){
     if(book){
         book.destroy().then(function(){
             response.status(204).send();
         }).catch(function(error){
             response.status(500).send('SERVER ERROR!!!');
         });
     }else {
         response.status(404).send();
     }
 });
});

//-------------------AUTHORS REST-----------------------------------

//READ all
app.get('/authors', function(request, response){
    AUTHORS.findAll().then(function(authors){
      response.status(200).send(authors); 
    });
});
    
//CREATE NEW AUTHOR
app.post('/authors', function(request, response){
    AUTHORS.create(request.body).then(function(author){
        AUTHORS.findById(author.id).then(function(author){
            response.status(201).send(author);
        });
    });
});

//READ ONE AUTHOR BY ID
app.get('/authors/:id',function(request, response){
    AUTHORS.findById(request.params.id).then(function(author){
        if(author){
            response.status(200).send(author);
        } else {
            response.status(404).send();
        }
    });
});

//UPDATE AUTHOR BY ID
app.put('/authors/:id',function(request, response){
    AUTHORS.findById(request.params.id).then(function(author){
            if(author){
                author.updateAttributes(request.body).then(function(){
                        response.status(200).send('Author updated!');
                    }).catch(function(error){
                        console.warn(error);
                        response.status(500).send('SERVER ERROR!!!');
                    });
            } else {
                 response.status(404).send();
            }
        });
});

//DELETE AUTHOR BY ID
app.delete('/authors/:id',function(request, response){
 AUTHORS.findById(request.params.id).then(function(author){
     if(author){
         author.destroy().then(function(){
             response.status(204).send();
         }).catch(function(error){
             response.status(500).send('SERVER ERROR!!!');
         });
     }else {
         response.status(404).send();
     }
 });
});

sequelize.sync();

app.listen(process.env.PORT);
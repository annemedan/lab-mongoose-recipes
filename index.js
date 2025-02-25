const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    //mongoose.connection.db.dropDatabase() -- this is going to delete the db itself -- this is more severe
    return Recipe.deleteMany() // removes all docs from one collection

  })
  .then(() => {
    const newRecipe = {
      title: "Strawberry Mousse",
      level: "Easy Peasy", 
      ingredients: ["Condensed milk", "Milk powder", "Strawberry essence", "Gelatin", "Heavy cream"],
      cuisine:  "Brazilian",
      dishType: "dessert",
      duration: 10, 
      creator: "Anne",
    };

    //create the recipe
    const pr = Recipe.create(newRecipe);
    return pr
  })
  .then(()=>{
    return Recipe.insertMany(data);
  })
  .then(()=>{
     const recipeToUpdate = Recipe.findOneAndUpdate( { title: "Rigatoni alla Genovese"}, { duration: 100 }, {new: true} );
     return recipeToUpdate;
  })
  .then((updatedRecipe)=>{
    console.log("Recipe was updated:", updatedRecipe);
    // added {new: true} otherwise it's not updated right away 

    const recipeToDelete = Recipe.deleteOne( {title: "Carrot Cake"} );
    return recipeToDelete
  })
  .then(()=>{
    return mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  })
  .finally(() => {
    console.log("Connection closed!");
  })

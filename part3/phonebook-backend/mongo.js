const mongoose = require('mongoose');
const process = require('process');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

const dbName = 'phoneBook';

const url = `mongodb+srv://Animesh:${password}@cluster0.rmezn.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Record = mongoose.model('Record', personSchema);
const record = new Record({
  name: newName,
  number: newNumber,
});

async function interactwithDB() {
  if (process.argv.length === 3) {
    try {
      const result = await Record.find({});
      console.log('Phonebook: ');
      result.forEach((person) => {
        console.log(person.name + ' - ' + person.number);
      });
      mongoose.connection.close();
    } catch (error) {
      console.log('Could not find any value');
    }
    return;
  }

  if (process.argv.length === 5) {
    const result = await record.save();
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
    return;
  }
}

interactwithDB();

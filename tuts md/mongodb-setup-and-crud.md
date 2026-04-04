# MongoDB Setup and CRUD

MongoDB is a popular open-source NoSQL document database. It stores data in flexible, JSON-like documents, meaning fields can vary from document to document and data structure can be changed over time.

## 1. Installation

### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0 # Or latest version
brew services start mongodb/brew/mongodb-community@6.0
```

### Linux (using `apt` for Ubuntu/Debian)
```bash
sudo apt update
sudo apt install gnupg curl
curl -fsSL https://www.mongodb.com/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Windows
Download the MongoDB Community Server MSI installer from the [official MongoDB website](https://www.mongodb.com/try/download/community). Follow the installation wizard.

### Verify Installation
```bash
mongo --version # For older shell, might be mongosh --version for newer
```

## 2. Connecting with Node.js (Mongoose)

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It helps manage relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

**Install Mongoose:**
```bash
mkdir my-mongodb-app
cd my-mongodb-app
npm init -y
npm install mongoose
```

**File: `db.js`** (for connection)
```javascript
// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
```

## 3. Define a Schema and Model

Mongoose schemas define the structure of documents within a collection, default values, validators, etc. A model is a compiled version of a schema.

**File: `models/User.js`**
```javascript
// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  age: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
```

## 4. CRUD Operations

Let's perform Create, Read, Update, and Delete operations.

**File: `app.js`**
```javascript
// app.js
const connectDB = require('./db');
const User = require('./models/User'); // Import the User model

// Connect to the database
connectDB();

// === CREATE Operation ===
const createUser = async () => {
  try {
    const newUser = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 30
    });
    const user = await newUser.save();
    console.log('User created:', user);
    return user;
  } catch (err) {
    console.error('Error creating user:', err.message);
  }
};

// === READ Operations ===
const getAllUsers = async () => {
  try {
    const users = await User.find();
    console.log('All users:', users);
    return users;
  } catch (err) {
    console.error('Error fetching users:', err.message);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    console.log(`User by ID ${id}:`, user);
    return user;
  } catch (err) {
    console.error(`Error fetching user by ID ${id}:`, err.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }); // Find one document by email
    console.log(`User by Email ${email}:`, user);
    return user;
  } catch (err) {
    console.error(`Error fetching user by email ${email}:`, err.message);
  }
};

// === UPDATE Operation ===
const updateUser = async (id, updates) => {
  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    // { new: true } returns the updated document
    // { runValidators: true } runs schema validators on update
    console.log('User updated:', user);
    return user;
  } catch (err) {
    console.error(`Error updating user ${id}:`, err.message);
  }
};

// === DELETE Operation ===
const deleteUser = async (id) => {
  try {
    const result = await User.findByIdAndDelete(id);
    console.log('User deleted:', result);
    return result;
  } catch (err) {
    console.error(`Error deleting user ${id}:`, err.message);
  }
};

// --- Execute CRUD operations ---
(async () => {
  // Give a moment for DB connection
  await new Promise(resolve => setTimeout(resolve, 1000));

  const createdUser = await createUser();

  if (createdUser) {
    await getAllUsers();
    await getUserById(createdUser._id);
    await getUserByEmail('john.doe@example.com');

    await updateUser(createdUser._id, { age: 31, name: 'Jonathan Doe' });

    await deleteUser(createdUser._id);
    await getAllUsers(); // Should show one less user
  }

  // Disconnect after operations (optional for a running server)
  // mongoose.connection.close();
})();
```

**Run the script:**
```bash
node app.js
```
Observe the console output for the CRUD operations.

## 5. Basic Querying

Mongoose provides a rich querying API.

```javascript
// app.js (example queries)

const findUsers = async () => {
  console.log('\n--- Query Examples ---');

  // Find all users named 'Jonathan Doe'
  const jonathans = await User.find({ name: 'Jonathan Doe' });
  console.log('Users named Jonathan Doe:', jonathans);

  // Find users older than 25
  const olderUsers = await User.find({ age: { $gt: 25 } }); // $gt means 'greater than'
  console.log('Users older than 25:', olderUsers);

  // Find users with specific fields (projection)
  const namesAndEmails = await User.find({}, 'name email -_id'); // Select name and email, exclude _id
  console.log('Names and Emails:', namesAndEmails);

  // Find and sort by age (descending)
  const sortedUsers = await User.find().sort({ age: -1 });
  console.log('Users sorted by age (desc):', sortedUsers);

  // Find with limit
  const limitedUsers = await User.find().limit(2);
  console.log('Limited to 2 users:', limitedUsers);

  // Chained queries
  const youngAndNamed = await User.find({ age: { $lt: 30 }, name: /jonathan/i })
                                  .sort('name')
                                  .select('name age');
  console.log('Young users named Jonathan (case-insensitive):', youngAndNamed);
};

// Call these queries after creating some data
// (async () => {
//   await createUser(); // Create some users first
//   await findUsers();
// })();
```

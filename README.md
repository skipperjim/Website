# Guffaw - Web Gaming Platform

A comprehensive web gaming platform built with Node.js, Express, and multiple game engines. This project showcases various web technologies and game development frameworks in a unified platform.

## 🎮 Features

### Game Engines & Demos
- **Phaser.js** - HTML5 game framework demonstrations
- **ImpactJS** - 2D game engine with level editor (Weltmeister)
- **Canvas Games** - Native HTML5 Canvas-based games
- **Three.js** - 3D graphics and WebGL demos
- **PIXI.js** - 2D rendering engine examples
- **P2.js** - Physics engine demonstrations

### Core Features
- **User Authentication** - Registration, login, and session management
- **Real-time Multiplayer** - Socket.io integration for live gaming
- **Admin Panel** - Administrative interface for content management
- **Chat System** - Real-time messaging between users
- **Responsive Design** - Bootstrap-powered responsive UI

### Games Included
- **Intension: Space** - A multiplayer space shooter game
- **Dexter's Gallery** - Interactive visual gallery
- Various demo games and examples for each engine

## 🛠 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication
- **Passport.js** - Authentication middleware

### Frontend
- **Jade/Pug** - Template engine
- **Bootstrap** - CSS framework
- **jQuery** - JavaScript library
- Multiple game engines (Phaser, Impact, Three.js, etc.)

### Build Tools
- **Grunt** - Task runner and build automation
- **Mocha** - Testing framework
- **JSHint** - Code quality tools

## 📦 Installation

### Prerequisites
- Node.js (v12 or higher)
- MongoDB
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/skipperjim/Website.git
   cd Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   ```bash
   # On Windows
   mongod
   
   # Or use the provided script
   ./startmongodb.sh
   ```

4. **Run the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Main site: http://localhost:80
   - Socket.io server: http://localhost:3700
   - HTTPS (if configured): https://localhost:443

## 🎯 Usage

### Available Routes
- `/` - Homepage
- `/game` - Main game area (Intension: Space)
- `/phaser` - Phaser.js demos
- `/impactjs` - ImpactJS games and Weltmeister editor
- `/canvas` - HTML5 Canvas examples
- `/three` - Three.js 3D demos
- `/pixi` - PIXI.js 2D graphics
- `/p2` - P2.js physics demonstrations
- `/dexter` - Dexter's Gallery
- `/chat` - Real-time chat interface
- `/admin` - Administrative panel (requires authentication)

### User Management
- Register: `/register`
- Login: `/login`
- Logout: `/logout`

## 🏗 Project Structure

```
├── app.js                 # Main application entry point
├── database.js            # Database configuration
├── package.json           # Dependencies and scripts
├── models/                # Mongoose data models
│   ├── account.js         # User account model
│   └── comments.js        # Comments model
├── routes/                # Express route handlers
│   ├── index.js           # Main routes
│   ├── game.js            # Game-related routes
│   ├── admin.js           # Admin panel routes
│   └── ...               # Other route modules
├── views/                 # Jade/Pug templates
├── public/                # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   ├── images/            # Image assets
│   └── bootstrap/         # Bootstrap framework
├── game/                  # Standalone game project
├── impactjs/              # ImpactJS games and editor
└── test/                  # Test files
```

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
make test
```

## 🔧 Development

### Using Grunt
The project includes Grunt for task automation:
```bash
grunt          # Run default tasks
grunt watch    # Watch for file changes
grunt build    # Build for production
```

### Game Development
Each game engine has its own directory structure:
- `game/` - Phaser.js-based space shooter
- `impactjs/` - ImpactJS games with Weltmeister editor
- `public/` - Various demo games and examples

## 🚀 Deployment

1. **Environment Configuration**
   - Set `NODE_ENV=production`
   - Configure SSL certificates (optional)
   - Update MongoDB connection strings

2. **Build Assets**
   ```bash
   grunt build
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project contains multiple components with different licenses:
- Main application: Check repository for license details
- Game assets: Various licenses (see individual game directories)
- Third-party libraries: See respective package licenses

## 👥 Authors

- **Steven Gray** - *Project Creator* - [skipperjim](https://github.com/skipperjim)
- **Luke Wilde** - *Phaser.js Boilerplate* - Game template contributions

## 🙏 Acknowledgments

- Phaser.js community for game development resources
- ImpactJS for the game engine and Weltmeister editor
- Express.js and Node.js communities
- All contributors to the various game engines and libraries used

## 📞 Support

For support, email sgrayjr289@gmail.com or create an issue in the GitHub repository.

---

*This project serves as both a functional gaming platform and a demonstration of various web game development technologies.*
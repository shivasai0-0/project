# Barter-Based Learning Platform

A platform where users can exchange skills instead of money. This project features a classy gold-accented UI with dark theme and a comprehensive set of features for skill exchange and learning.

## Features

- **Authentication**: Login and signup with Firebase
- **Profile Management**: Set up your profile with skills you can teach and want to learn
- **Barter System**: Match with other users based on complementary skills
- **Learning Content**: Upload videos and PDFs to generate summaries and notes
- **Quiz System**: Take quizzes to test your knowledge and earn points
- **Leaderboard**: See top learners in the community
- **Community Chat**: Chat with other users and an AI assistant

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: TailwindCSS with custom theme
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **API Integration**: Axios for backend communication

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/barter-learning-platform.git
cd barter-learning-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Backend Integration

This project includes a mock backend service that simulates API responses. In a production environment, you would replace these with actual API calls to your backend server.

The mock backend includes:
- Authentication endpoints
- Profile management
- Recommendations for barter
- Learning content processing
- Quiz system
- Leaderboard
- Chat functionality

To integrate with a real backend:
1. Update the `baseURL` in `src/services/api.ts`
2. Replace the mock responses with actual API calls
3. Update the Firebase configuration in `src/firebase/config.ts`

## Deployment

To build the app for production:

```bash
npm run build
# or
yarn build
```

This creates a `build` folder with optimized production files.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Axios](https://axios-http.com/)


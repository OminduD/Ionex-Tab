# Contributing to Ionex Tab

First off, thank you for considering contributing to Ionex Tab! It's people like you that make Ionex Tab such a great tool for everyone.

## Code of Conduct
By participating in this project, you are expected to uphold a welcoming and inclusive environment. Please be respectful to all contributors.

## How Can I Contribute?

### 🐛 Reporting Bugs
- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/OminduD/Ionex-Tab/issues).
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### 🎨 Suggesting Enhancements
- Open a new issue with a clear title and description.
- Provide specific examples to demonstrate the steps and the context.
- Wait for feedback from maintainers before starting significant work.

### 💻 Pull Requests
1. Fork the repo and create your branch from `main`.
2. Ensure you follow the code style of the project.
3. Make sure all builds and checks pass.
4. Issue that pull request! Please provide a descriptive PR title and summarize your changes in the PR body.

## Development Setup

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Local Development Workflow
```bash
# Fork the repository & clone your fork
git clone https://github.com/YOUR_USERNAME/Ionex-Tab.git
cd Ionex-Tab

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name

# Start development server
npm run dev

# Type check
npm run type-check

# Build for testing (Chrome/Edge/Brave)
npm run build:chrome

# Build for testing (Firefox)
npm run build:firefox

# Commit and push
git add .
git commit -m "feat: Add your amazing feature"
git push origin feature/your-feature-name
```

## Styleguides

### Commit Messages
- Use the imperative mood ("Add feature" not "Added feature" or "Adds feature")
- Limit the first line to 72 characters or less
- Consider using conventional commits (e.g., `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`)

### Coding Guidelines
- We use **TypeScript** and **React**. Ensure your code is strictly typed and avoids `any` types where possible.
- Functional components with Hooks are our standard pattern.
- For styling, we use **Tailwind CSS**. Avoid writing custom CSS in separate files unless necessary for complex keyframe animations. Always try to match the existing theme colors using CSS variables.

Thank you for contributing! 🎉

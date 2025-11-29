# Contributing to Flinxx

## Development Setup

1. Clone the repository
2. Follow instructions in `QUICK_START.md`

## Code Style

- Use ES6+ syntax
- Use functional components in React
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

## File Structure

```
Frontend:
src/
├── pages/          # Page components (Home, Chat)
├── components/     # Reusable components
├── services/       # API/Socket services
├── utils/          # Utility functions
└── hooks/          # Custom React hooks

Backend:
├── server.js       # Main server file
├── middleware/     # Express middleware
└── utils/          # Utility functions
```

## Testing

To test locally:
1. Open two browser windows/tabs
2. Go to http://localhost:3000 in both
3. Click "Start Video Chat" in both
4. They should match and establish connection

## Reporting Issues

Include:
- Browser and OS
- Steps to reproduce
- Error messages
- Screenshot if applicable

## Pull Request Process

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request with description

## License

MIT - See LICENSE file

---

Thank you for contributing! 🙏

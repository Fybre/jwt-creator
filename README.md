# Therefore JWT Generator

A client-side web application for generating and decoding JSON Web Tokens (JWTs) for authentication with Therefore document management systems.

## Features

### JWT Generator

- **Client-side generation**: All JWT creation happens in your browser - your secret key never leaves your device
- **Therefore-specific claims**: Pre-configured for Therefore authentication requirements
- **Flexible identity claims**: Support for Windows Account Name, Name, and Email Address identity claims
- **Permission calculator**: Interactive calculator for Therefore permission values
- **Object-specific permissions**: Configure granular permissions for categories, cases, documents, workflows, eForms, and indexing profiles
- **Token validity control**: Set custom Not Before (nbf) and Expiry (exp) timestamps with quick preset options
- **Secret management**: Generate secure random secrets or use your own (minimum 32 characters)

### JWT Decoder

- **Token inspection**: Decode and examine JWT header and payload contents
- **Token validation**: Check token status (valid, expired, not yet valid)
- **Copy functionality**: Easily copy generated tokens and authorization headers

## Prerequisites

- Modern web browser with JavaScript enabled
- For Docker deployment: Docker and Docker Compose

## Quick Start

### Option 1: Run Locally

1. Clone or download the project files
2. Open `index.html` in your web browser
3. The application runs entirely client-side

### Option 2: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application at http://localhost:8080
```

### Option 3: Manual Docker Build

```bash
# Build the image
docker build -t jwt-creator .

# Run the container
docker run -p 8080:80 jwt-creator
```

## Usage

### Generating a JWT

1. **Configure JWT Settings**:
   - **Issuer (iss)**: Your Therefore tenant URL (e.g., `https://tenantname.au`)
   - **Audience (aud)**: Your Therefore Customer ID (e.g., `5JML5D71XX`)
   - **Secret**: Minimum 32 characters, must match your Therefore JWT configuration

2. **Set User Identity**:
   - Choose identity claim type (Windows Account Name recommended)
   - Enter user credentials (username/domain for Windows accounts)

3. **Configure Permissions**:
   - Select scope: `therefore_user`, `therefore_read`, or `therefore_specific`
   - For `therefore_specific`: Use the permission calculator and object permissions

4. **Set Token Validity**:
   - Not Before (nbf): Token activation time
   - Expiry (exp): Token expiration time
   - Optional: Include Issued At (iat) timestamp

5. **Generate**: Click "Generate JWT" to create your token

### Decoding a JWT

1. Switch to the "Decoder" tab
2. Paste your JWT token
3. Click "Decode JWT" to inspect the token contents

## Security Notes

- **Client-side processing**: All cryptographic operations occur in your browser
- **Secret stays local**: Your secret key is never transmitted over the network
- **HTTPS recommended**: For production use, serve over HTTPS
- **Secret requirements**: Use strong, unique secrets of at least 32 characters
- **Token validation**: Always validate tokens on the server side

## Dependencies

- [jose](https://github.com/panva/jose) - JavaScript library for JWT operations
- [nginx:alpine](https://hub.docker.com/_/nginx) - For Docker deployment

## Development

The application consists of:

- `index.html` - Main HTML structure and UI
- `css/style.css` - Styling and responsive design
- `js/app.js` - Application logic and JWT operations
- `Dockerfile` - Container build configuration
- `docker-compose.yml` - Orchestration configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**MIT License Summary:**

- You can use this software for personal, commercial, or open-source projects
- You can modify and distribute the code
- You must include the original copyright notice
- The software is provided "as is" without warranty

## Links

- [Therefore JWT Documentation](https://therefore.net/help/Online/en-us/sd_t_authmeth_admintasks_jwt.html)
- [RFC 7519 - JWT Specification](https://tools.ietf.org/html/rfc7519)

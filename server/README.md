# Travel Plan Server

## Getting Started

### Prerequisites

Add .env to `/server`

```bash
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
FACEBOOK_APP_ID=<YOUR_FACEBOOK_APP_ID>
FACEBOOK_APP_SECRET=<YOUR_FACEBOOK_APP_SECRET>
SESSION_SECRET=<YOUR_SESSION_SECRET>
JWT_SECRET=<YOUR_JWT_SECRET>
MONGODB_URL=<YOUR_MONGODB_URL>
```

### Install Dependencies

```bash
yarn install
```

### Start Server

```bash
yarn dev
```

### Start Server in Production Mode

```bash
yarn build
```

Then

```bash
yarn start
```

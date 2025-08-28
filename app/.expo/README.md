
# Unified Wishlist App

This project is a unified wishlist application that uses **WatermelonDB** for local storage, migrations, and persistence.

> ⚠️ Note: Since WatermelonDB is not part of Expo modules, we need a **prebuild and expo-dev-client setup**. The app cannot be run directly on Expo Go. You must create a development build and run it in dev-client mode.

----------

## Setup & Run Instructions

### App

1.  **Install dependencies**
    

```bash
npm run app:install
```

2.  **Create and install dev-client build**
    
    -   You can use the shared APK (over email) for simplicity, or create your own build.
        
    -   Install the APK on your emulator or physical device.
        
3.  **Update local IP**
    
    -   Open `app/src/utils/constants.ts`
        
    -   Replace `NETWORK_IP` with your local IP address.
        
4.  **Start the app in dev-client mode**
    

```bash
npm run start:app:client
```

-   Select `android` when prompted.
    

----------

### Server

1.  **Install dependencies**
    

```bash
npm run server:install
```

2.  **Start the server**
   

```bash
npm run dev
```

----------
# Deep Link Test Script

This project includes a convenient script to test deep links on Android using the `uri-scheme` tool.

## Script

```json
"deeplink:test": "cd app && npx uri-scheme open --android $URL"
```

## Usage Instructions

### 1. URL Encoding

When testing deep links, any special characters (spaces, `&`, `=`, etc.) must be URL-encoded. For example:

-   Original URL:
    

```
myapp://wishlist?item=New Product & Price=500
```

-   URL-encoded:
    

```
myapp://wishlist?item=New%20Product%20%26%20Price%3D500
```

### 2. Run the Script with a User-Provided URL

**Option 1: Using environment variable (Linux/macOS)**

```bash
URL="myapp://wishlist?item=New%20Product%20%26%20Price%3D500" npm run deeplink:test
```
> ⚠️ Ensure the URL is properly encoded to avoid errors when launching the deep link.

## AI Usage Disclosure

Some portions of this project were assisted by AI tools, for:

-   Writing some common utility functions
    
-   Creating regular expressions
    
-   Drafting test cases
    

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

## Engineering tradeoffs & risks

 **Objective**

Select a storage solution that meets the following requirements:

- Persistence
- Migration support
- Structured data storage
- Reliability

---

## **Storage Options Considered**

### **1. AsyncStorage**

**Trade-offs:**
- Easy to implement
- Lightweight
- Supported by Expo

**Risks / Limitations:**
- No proper schema structure
- Suitable only for small datasets
- Migration not supported (manual migration possible but not recommended for large datasets)
- Not secure

---

### **2. MMKV**

**Trade-offs:**
- Easy to implement
- Lightweight
- Secure (encryption support)
- High performance

**Risks / Limitations:**
- No proper schema structure
- Suitable only for small datasets
- Migration not supported (manual migration possible but not ideal for large datasets)
- Requires Expo prebuild for use

---

### **3. WatermelonDB**

**Trade-offs:**
- Provides proper schema structure (relational database)
- Handles large datasets efficiently
- Built-in migration support
- High performance

**Risks / Limitations:**
- Setup complexity higher compared to AsyncStorage or MMKV
- Not secure (encryption not built-in; current project does not require sensitive data storage)
- Requires Expo prebuild for use

---

## **Conclusion**

For the current project requirements, **WatermelonDB** was chosen due to:

- Structured schema support
- Migration support
- High performance for large datasets

> **Note:**  
> For a full-fledged application, a combination of **WatermelonDB** (for relational data), **MMKV** (for secure/sensitive data), and **Redux** (for global state management) would be ideal.  

Global state management was not implemented in this project due to its small scope, to avoid extra boilerplate, and time constraints.

---

## AI Usage Disclosure

Some portions of this project were assisted by AI tools, for:

-   Writing some common utility functions
    
-   Creating regular expressions
    
-   Drafting test cases
    

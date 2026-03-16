# Custom File System Provider Example

This example demonstrates how to build a **Custom File System Provider (FSP)** for the Beefree SDK using **Fastify** and **TypeScript**.

It implements the API specification described in the [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/server-side-configurations/server-side-options/storage-options/connect-your-file-storage-system).

## Features

-   **File Operations**: List, Create Directory, Upload, Delete, Move.
-   **Metadata**: Returns MIME types, dimensions (basic), permissions.
-   **Conflict Resolution**: Handles `keep`, `replace`, and `ask` strategies for uploads and moves.
-   **Local Storage**: Uses the local file system (`./storage` folder) to store files.
-   **Static Serving**: Serves uploaded files publicly so they can be previewed in the editor.

## Setup

1.  **Install Dependencies**:
    ```bash
    yarn install
    ```

2.  **Configure Environment**:
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    Adjust `PORT` or `STORAGE_ROOT` if needed.

3.  **Run the Server**:
    ```bash
    yarn dev
    ```
    The server will start at `http://localhost:3000`.

## Exposing Localhost (Required)

The Beefree SDK servers need to access your FSP API over the internet via **HTTPS**. Localhost URLs (like `http://localhost:3000`) will not work.

You can use a tool like **ngrok** to create a secure tunnel:

1.  **Install ngrok** (if not installed):
    ```bash
    brew install ngrok/ngrok/ngrok
    # or try running via npx
    npx ngrok http 3000
    ```
2.  **Start the tunnel**:
    ```bash
    ngrok http 3000
    ```
3.  Copy the `https` URL provided by ngrok (e.g., `https://abc-123.ngrok-free.app`) and use it as the **Base URL**.

## Usage with Beefree SDK

To use this FSP with your Beefree SDK application:

1.  Go to the **Beefree SDK Console**.
2.  Navigate to **Server-side configuration** > **Storage options**.
3.  Select **Connect your file storage system**.
4.  Enter the following details:
    *   **Base URL**: `https://your-tunnel-url.com` (Use ngrok or similar to expose localhost, or deploy this server). Note: Beefree requires **HTTPS**.
    *   **Username/Password**: Any values (this example checks for presence of Basic Auth but accepts any for demo purposes).

## Project Structure

*   `src/server.ts`: Main server entry point, API routes, and authentication middleware.
*   `src/filesystem.ts`: Core logic for file system operations (fs calls, metadata generation).
*   `storage/`: Default directory where files will be saved.


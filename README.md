# Create Replay Links from CSV file

This script will convert a CSV file into a JSON array and automate the process of adding links to your published replay using Puppeteer.

## Setup/Prerequisites

- You will need to have a Reprise username and password to login (Google auth is currently not compatible)
- You will need to have node installed on your local machine.
- Clone this repo locally
- From the main directory, run `npm i`
- Create a `.env` and enter your Reprise credentials with the format below:
  ```
  REPRISE_EMAIL="<YOUR REPRISE EMAIL>"
  REPRISE_PASSWORD="<YOUR REPRISE PASSWORD>"
  ```

## Run the Script

- Run `node csv_convert.js`
- Run `node create_links.js`

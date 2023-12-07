# Stock Reports AI

**Stock Reports AI** harnesses the power of AI to analyze recent stock data, offering users tailored reports on selected stock tickers.
Additionally, it provides company background information and relevant links on demand.


## Origin and Development

### Project Background
**Stock Reports AI** is inspired by and based on a project from the Scrimba course "Intro to AI Engineering" in ["The AI Engineer Path"](https://scrimba.com/learn/aiengineer) by _Per Harald Borgen_. This foundational project provided a springboard for the development of a more sophisticated and practical tool for stock market analysis. 

### Course Project Overview
The original project from the course was a pure frontend application using Vanilla JavaScript. The basic HTML structure included:

- A header with a logo
- An action panel for inputting stock tickers and generating reports
- A loading panel to display while querying the Stocks API
- An output panel to render the generated reports
- A footer with a disclaimer

The functionality was straightforward:

1. **Ticker Input**: Users input stock tickers through a form.
2. **Ticker Display and Report Generation**: The selected tickers are then displayed in a paragraph underneath. The "Generate Report" button becomes enabled once a ticker is selected, allowing users to initiate the report generation process.
3. **Polygon API Integration**:
    - **About Polygon.io**: Polygon.io is a financial data platform providing real-time and historical data on stocks, cryptocurrencies, and other financial instruments, widely used in market analysis and financial applications.
    - **API Key Registration**: Users need to register at [Polygon.io](https://polygon.io/) to access the API. The free tier permits up to 5 API calls per minute and provides access to end-of-day data for the last two years.
    - **API Request Format**: The application uses the following API request format: 
        ```
        https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apiKey=${YOUR_API_KEY}
        ```
        Here, `${ticker}` represents the stock ticker symbol, `${startDate}` and `${endDate}` are the dates for data retrieval (formatted as YYYY-MM-DD), and `${YOUR_API_KEY}` is the user's personal API key from Polygon.
    - **API Response Structure**: The API responds with a JSON object containing detailed stock data, with key fields including:
        - `ticker`: Stock ticker symbol.
        - `queryCount`: Total number of queries made.
        - `resultsCount`: Number of results returned.
        - `adjusted`: Boolean indicating if data is adjusted for splits.
        - `results`: An array of data points, each containing fields like volume (`v`), weighted average price (`vw`), open (`o`), close (`c`), high (`h`), low (`l`), and timestamp (`t`).
        - `status`: Status of the API call.
        - `request_id`: Unique identifier for the request.
        - `count`: Count of data points returned.
4. **OpenAI API Integration for GPT-4 Model**:
    - **Data Processing**: The stock data fetched from the Polygon API is then sent to the OpenAI API.
    - **OpenAI Account and Credits**: To use the OpenAI API, users need to create an account and have credits available. Detailed information can be found at [OpenAI API Documentation](https://platform.openai.com/docs/overview).
    - **API Cost**: Usage of the OpenAI API is based on the number of tokens processed. For pricing details, refer to [OpenAI Pricing](https://openai.com/pricing).
    - **API Prompt**: The API call is made with a `messages` array, which includes two roles: `system` and `user`.
        - **System Role**: This is set to provide a specific instruction for the model: 
          ```
          'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell.'
          ```
        - **User Role**: This role is used to pass the actual stock data (in JSON format) to the model.
    - **API Response Structure**: The response from the OpenAI API is a structured JSON object. Key elements in the response include:
        - `id`: A unique identifier for the response.
        - `object`: Type of the object, usually "chat.completion".
        - `created`: Timestamp of when the response was created.
        - `model`: Specifies the model used, e.g., "gpt-4-0613".
        - `choices`: An array containing the generated responses.
            - Each element in `choices` is an object with `index`, `message`, and `finish_reason`.
            - The `message` object includes `role` and `content`, where `content` holds the generated text.
        - `usage`: Contains token usage information with fields like `prompt_tokens`, `completion_tokens`, and `total_tokens`.
    - To access the generated content, use `response.choices[0].message.content`. This provides the actual output from the GPT-4 model, such as the stock performance report.
5. **Loading Panel Display**: While the API calls are in progress, a loading panel is displayed to the user.
6. **Rendering Reports in Output Panel**:
    - After receiving the response from the OpenAI API, the application switches to the output panel.
    - The output panel is then used to render the generated reports. Each report provides an analysis and recommendation based on the stock data for the selected tickers.


## Project Extensions 

The most significant enhancement in **Stock Reports AI** is the division into a Frontend and Backend architecture. This structural change was implemented for several reasons:

- **Improved Management of Application Functionality**: It allows for more efficient handling of different functionalities of the application, making the system more modular and maintainable.
- **Streamlined Querying Process**: The Backend acts as a centralized point for querying various external APIs, streamlining the data retrieval process.
- **Enhanced Security**: By separating the Backend, sensitive information like API keys can be securely stored in environment variables (`.env` file). This prevents exposure of critical credentials in the Frontend code, enhancing the overall security of the application.

### Technology Stack
**Frontend**: 
- Developed using [Svelte](https://svelte.dev/), chosen to facilitate learning this technology.
- This project also served as a first-time experience in implementing [Tailwind CSS](https://tailwindcss.com/), exploring  its utility-first design principles for styling.

**Backend**: 
- Built with [Express.js](https://expressjs.com/), the Backend serves as a proxy to various external APIs. 

### Project Structure

**Stock Reports AI** is structured into distinct Frontend and Backend components, each with its dedicated files and directories, ensuring a clear separation of concerns.

- **Frontend Components**:
  - `/src`: The source directory for Svelte components and logic.
  - `/static`: Houses static files like images and global styles.
  - `package.json`: Manages project dependencies and scripts.
  - Automatically generated file to lock the versions of installed packages, ensuring consistent installs across environments.
  - `svelte.config.js`: Configuration file for Svelte.
  - `vite.config.js`: Configuration file for Vite, which is used for building the Frontend.
  - `postcss.config.cjs`: The PostCSS configuration file, essential for integrating Tailwind CSS with the project's build process.
  - `tailwind.config.js`: Configuration file for Tailwind CSS, used to customize and control the Tailwind styling aspects of the project. 

- **Backend Components**:
  - `/api`: Contains the main logic for API interactions.
  - `/apiRoutes`: Manages the routing for API endpoints.
  - `/data`: Stores data files that function as caches to reduce calls to external APIs.
  - `server.js`: The main server file for the Backend.
  - `.env`: A configuration file for storing environment variables and API keys securely. Excluded from the repository push for security reasons (listed in `.gitignore`).

#### Frontend Details
- **Enhanced Ticker Input**: The text input field now suggests stock tickers based on user input, using data from the Polygon API. This ensures users can only select existing tickers, improving input control and user experience.
- **Ticker Selection Limit**: The number of tickers a user can select for reports is limited to five to manage API call frequency. Duplicate ticker entries are prevented.
- **Date Range Selection**: Users can choose the time range for the stock data to be considered, from the last day up to the last five days. Weekends are excluded as they are non-trading days.
- **Report Visualization**: Each report is accompanied by a DALL-E generated icon reflecting the AI recommendation (buy, sell, hold, further investigation).
- **Company Information and Links**: For each report, brief company information and a list of three links for further details are provided, generated by the same model.

#### Backend Details
- **Language Model Integration**: We utilize GPT models in the project. For testing and cost efficiency, the GPT-3 Turbo model is specifically employed.
- **Dedicated OpenAI Integration Directory**: All code responsible for interacting with the GPT model is contained within the `/api/openai` directory. This centralized approach means that if there's a need to switch to a different underlying model, modifications can be made simply by adjusting the files in this directory.
- **Backend API Endpoints**:
    - `localhost:3000/api/stock-data/generate-report?ticker={ticker}&days={days}`: This endpoint requires `ticker` and `days` parameters. `ticker` is the stock ticker symbol, and `days` specifies the number of days for data retrieval, counting from today. 
        - Generates the stock data report similar to the original Scrimba version.
        - Returns a JSON response with `status` and `data` fields. The `data` object includes the `ticker` and a detailed `report` on the stock's performance. The report covers aspects such as opening and closing prices, highs, lows, and an overall analysis with a trading recommendation. The generalized response format is:
            ```json
            {
                "status": "success",
                "data": {
                    "ticker": "SPECIFIED_TICKER",
                    "report": "Detailed report on the stock's performance, including key statistics, trend analysis, and a trading recommendation based on the observed data."
                }
            }
    - `localhost:3000/api/stock-data/ticker-search?q=${userInput}`: Uses `userInput` to query and return a list of stock tickers for suggestion purposes. This reduces the need for frequent calls to the Polygon API.
        - The ticker list `/data/ticker.json` was generated by `/data/fetch-tickers-paginated.js`, which considers the API call limits to efficiently fetch data.
        - This endpoint returns an array of objects, each representing a stock ticker and its associated company name. The response is structured as an array, where each element contains a `ticker` and `name` field. The generalized response format is:
            ```json
            [
                {"ticker": "TICKER1", "name": "Company Name 1"},
                {"ticker": "TICKER2", "name": "Company Name 2"},
                {"ticker": "TICKER3", "name": "Company Name 3"}
            ]
    - `localhost:3000/api/company/info?q={companyName}`: Takes `companyName` as a query parameter to provide a brief description of the company's business model.
        - Provides a JSON response containing `status` and `data` fields. The `data` object includes the `companyName` and a `description` of the company's business model. The response structure is generalized as follows:
            ```json
            {
                "status": "success",
                "data": {
                    "companyName": "Example Company",
                    "description": "Description of the company's business model, covering its main activities, product lines, and notable features."
                }
            }
    - `localhost:3000/api/company/links?q={companyName}`: Generates three links to pages with further information about the company represented by `companyName`, though it's still prone to hallucinations.
        - Returns a JSON object with the status and data fields. The `data` field contains the `companyName` and an array of `links`. Each link object in the array includes a `description` and a `link`.
            ```json
            {
                "status": "success",
                "data": {
                    "companyName": "Example Company",
                    "links": [
                        {
                            "description": "Description of Link 1",
                            "link": "URL of Link 1"
                        },
                        {
                            "description": "Description of Link 2",
                            "link": "URL of Link 2"
                        },
                        {
                            "description": "Description of Link 3",
                            "link": "URL of Link 3"
                        }
                    ]
                }
            }
- **Data Caching**: To save on API calls, reports and company information are cached. Reports are cached in `/api/cacheManager.js`, and company information in `/data/CompanyInfoCache.json`.

## How to Run the Project

### Prerequisites
Before you start, ensure you have [Node.js](https://nodejs.org/en) installed on your machine.

### Installation
1. **Clone the Repository**: Download the project from GitHub. You can clone the repository using the following command:
    ```bash
    git clone https://github.com/andreasCanSee/stock-reports-ai
    ```
2. **Create `.env` File**: In the root directory of the project, create a `.env` file. This file should contain your API keys for Polygon and OpenAI. You can obtain these keys by registering at [Polygon.io](https://polygon.io/) and [OpenAI API Documentation](https://platform.openai.com/docs/overview). Add the following lines to your `.env` file:
    
    ```
    POLYGON_API_KEY='Your_Polygon_API_Key'
    OPENAI_API_KEY='Your_OpenAI_API_Key'
    ```
3. **Install Dependencies**: Navigate to the project directory and run the following command to install the necessary dependencies:
    ```
    npm install
    ```

### Running the Application
1. **Start the Backend Server**: In the project directory, start the backend server by running:

        node --env-file .env server.js

    This command starts the server and loads the environment variables from the `.env` file.
    - As of Node.js 20.6.0, the use of `dotenv` for managing environment variables is no longer necessary. Node.js now includes built-in support for environment variables. For more details, see [this article](https://dev.to/cjreads665/nodejs-2060-say-goodbye-to-dotenv-2ijl).
2. **Start the Frontend Development Server**: Open a new terminal window and run the following command to start the frontend development server:
    ```
    npm run dev
    ```
    This command starts the Svelte development server, making the frontend accessible through a web browser.
    - In some environments, you might need to use `sudo` to start the development server, especially if it requires to bind to a privileged port or if there are permission-related issues. If so, use `sudo npm run dev`. However, be cautious with `sudo` as it grants elevated privileges.


### Accessing the Application
Once both servers are running, you can access the frontend of the application. Typically, Vite will provide a URL in the terminal output, like

        
        ➜ Local: http://localhost:5173/
            
- The URL (http://localhost:5173/ in this case) might vary depending on your Vite configuration and the available ports on your machine. Use the URL provided in your terminal to access the application.

### Local Usage and Security Considerations

**Stock Reports AI** is primarily designed for local development and usage. It's important to be aware of certain aspects of its configuration:

- **Hardcoded Ports**: The ports used in the application are hardcoded. This means the application is set up to run on pre-defined ports, which is suitable for local development but might require adjustments for deployment in a production environment.

- **CORS Configuration**: The Express server in the backend uses `app.use(cors())`. This enables Cross-Origin Resource Sharing (CORS), which is a security feature allowing or restricting requested resources on a web server based on where the HTTP request was initiated. While this is convenient for development purposes, it poses potential security risks if used in a production environment. Specifically, it allows unrestricted access from any origin, which can expose the server to cross-site scripting (XSS) attacks or other cross-origin threats.

For these reasons, it is recommended to use this project for local development only. If you plan to deploy it to a production environment, it's crucial to implement proper security measures, including configuring CORS appropriately and ensuring ports are set up securely and dynamically.

## Future Steps

As **Stock Reports AI** continues to evolve, several enhancements are planned to improve its functionality and user experience:

- **Prompt Engineering**: Improve the quality of generated reports and the value of information through advanced prompt engineering with the AI models.

- **Experimenting with Different LLMs**: Test and integrate various Large Language Models (LLMs) to compare performance and report quality.

- **Expanding Data Sources**: Increase the range of data retrieved from Polygon.io to enrich the stock reports with more comprehensive market data.

- **Error Handling**: Strengthen error handling, especially in the communication between the Frontend, Backend, and external APIs to ensure smoother user experiences.

- **UI Enhancements**: Continuously refine and polish the user interface to enhance its intuitiveness and visual appeal.
    - For example, improve the ticker suggestion feature to only suggest tickers that have not already been chosen by the user

- **Code Documentation**: Currently, the project lacks detailed code comments, which are essential for understanding the functionality and facilitating future enhancements. The plan is to methodically go through the code, adding descriptive and helpful comments that explain complex logic, function purposes, and the reasoning behind certain coding decisions.
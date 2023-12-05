# Stock Reports AI

**Stock Reports AI** harnesses the power of AI to analyze recent stock data, offering users tailored reports on selected stock tickers.
Additionally, it provides company background information and relevant links on demand.


## Origin and Development

### Project Background
**Stock Reports AI** is inspired by and based on a project from the Scrimba course "Intro to AI Engineering" in ["The AI Engineer Path"](https://scrimba.com/learn/aiengineer). This foundational project provided a springboard for the development of a more sophisticated and practical tool for stock market analysis. 

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
- Frontend: Developed using [Svelte](https://svelte.dev/), chosen to facilitate learning this technology.
- Backend: Built with [Express.js](https://expressjs.com/), the Backend serves as a proxy to various external APIs. 

#### Frontend Details
- **Enhanced Ticker Input**: The text input field now suggests stock tickers based on user input, using data from the Polygon API. This ensures users can only select existing tickers, improving input control and user experience.
- **Ticker Selection Limit**: The number of tickers a user can select for reports is limited to five to manage API call frequency. Duplicate ticker entries are prevented.
- **Date Range Selection**: Users can choose the time range for the stock data to be considered, from the last day up to the last five days. Weekends are excluded as they are non-trading days.
- **Report Visualization**: Each report is accompanied by a DALL-E generated icon reflecting the AI recommendation (buy, sell, hold, further investigation).
- **Company Information and Links**: For each report, brief company information and a list of three links for further details are provided, generated by the same model.

#### Backend Details
- **Testing with GPT-3 Turbo**: For cost efficiency, GPT-3 Turbo is used for testing purposes.
- **Backend API Endpoints**:
    - `localhost:3000/api/stock-data/generate-report`: Generates the report similar to the original Scrimba version.
    - `localhost:3000/api/stock-data/ticker-search`: Maintains a list of all stock tickers for suggestion purposes, avoiding frequent calls to the Polygon API. The ticker list is generated by `/data/fetch-tickers-paginated.js`, considering the API call limit.
    - `localhost:3000/api/company/info`: Provides a brief description of any company's business model.
    - `localhost:3000/api/company/links`: Generates three links to pages with further information, though it's still prone to hallucinations.
- **Data Caching**: To save on API calls, reports and company information are cached. Reports are cached in `/api/cacheManager.js`, and company information in `/data/CompanyInfoCache`.

## To Be Continued...
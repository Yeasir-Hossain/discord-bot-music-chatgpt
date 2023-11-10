/**
 * Asynchronously makes a request to the Discord API.
 * @param {Object} options - Request options.
 * @param {string} options.uri - The API endpoint to access.
 * @param {string} [options.method='GET'] - The HTTP method for the request.
 * @param {Object} [options.body] - The data to be sent in the request body.
 * @param {Object} [options.rest] - Additional options for the request.
 * @returns {Promise} - A Promise containing the JSON response from the API.
 */
export default async function ({ uri, method = 'GET', body, ...rest }) {
  try {
    // Constructing the API URL
    const url = `https://discord.com/api/v10/${uri}`;

    // Setting the request headers with authorization
    const headers = {
      'Authorization': `Bot ${process.env.BOT_TOKEN}`
    };

    // Checking if there's a request body to include the Content-Type header
    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    // Making the API request using fetch
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
      ...rest
    });

    // Returning the JSON content of the response
    return response.json();
  } catch (e) {
    console.log(e);
  }
}

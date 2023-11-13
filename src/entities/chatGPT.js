/**
 * Handler for the API endpoint that sends question to chatgpt and returns the response.
 * @param {Object} options - Options object containing necessary properties.
 * @param {Object} options.chatGPT - The chatGPT instance providing access to chat functionality.
 * @returns -  The response sent by chat gpt.
 */
export const chat = ({ chatGPT }) => async (req, res) => {
  try {
    if (!req?.body?.question) return res.status(400).send({ message: 'Please ask me something' });
    const answer = await chatGPT.prompt(req.body.question);
    res.status(200).send(`<p>${answer}</p>`);
  }
  catch (e) {
    console.log(e);
  }
};

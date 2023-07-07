async function createResponseForMongoDB(param) {
  const { promptInput, matchChoice, commentInput, apiResponse } = param;
  console.log(
    `\nIniciando gravação em MongoDB\npromptInput: ${promptInput}\nmatchChoice: ${matchChoice}\ncommentInput: ${commentInput}\napiResponse: ${JSON.stringify(
      apiResponse
    )}\n`
  );

  const getTime = new Date();
  const response = {
    promptInput: promptInput,
    matchChoice: matchChoice,
    commentInput: commentInput,
    apiResponse: { response: apiResponse },
    time: getTime,
  };
  
  console.log(`\n=====================\nJSON.stringify(response):\n${JSON.stringify(response)}\n=====================\n`);

  return response;
}





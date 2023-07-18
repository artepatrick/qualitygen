
async function fetchApi(param) {
  const { pergunta, matchChoice, commentInput, responseDiv } = param;
  /* console.log(`\n=====\nparam`);
  console.log(param);
  console.log(`\n===== Stringify\n`);
  console.log(JSON.stringify(param)); */

  try {
    const apiUrlPrompt = "https://artepatrick-mongodb-api.herokuapp.com/prompt";
    const apiResponse = await fetch(apiUrlPrompt, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param),
    });

    const finalResponse = await apiResponse.json();

    if (!apiResponse.ok) {
      throw new Error(`\nopa!\nHTTP error! status: ${finalResponse}`);
    } else {
      console.log(`\n\n\n====\n--> apiResponse.ok = true\n`);
      // console.log(finalResponse);
    }

    return finalResponse ? finalResponse : null;
  } catch (error) {
    responseDiv.innerHTML = `<p>&#128542</p><p style="font-weight: bold;"> Ocorreu um erro</p><p>Por favor, tente novamente mais tarde.</p><p>Veja o código do erro:</p><p>${error}</p>}`;
    console.error(
      `\nNão foi possível realizar o fetch no "script.js"\nEvento "submit" do forms\nO erro\n ${error}\n`
    );
    throw new Error(`HTTP error! status: ${error}\n${error.status}`);
  }
}

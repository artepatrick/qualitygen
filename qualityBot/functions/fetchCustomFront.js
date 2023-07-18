const apiUrlPrompt =
  "https://artepatrick-mongodb-api.herokuapp.com/readPromptCustom";

async function fetchCustomFront(param) {

  let rawMatchChoice = param || "mdquality";
  console.log("função fetchCustomFront() acionada");
  if (rawMatchChoice) {
    //matchChoice = param.toLowerCase().replace(/^match_/, "");
    let matchChoice = rawMatchChoice.toLowerCase().replace(/^match_/, "")
    const fetchBody = JSON.stringify({ matchChoice });

    try {
      const apiResponse = await fetch(apiUrlPrompt, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: fetchBody,
      });
    
      console.log('Response status:', apiResponse.status);
      console.log('Response headers:', apiResponse.headers);
    
      const responseBody = await apiResponse.text();
      console.log('Response body:', responseBody);
    
      const response = JSON.parse(responseBody);
      console.log("\n=====\n response:");
      console.log(response);
      return response;
    } catch (error) {
      console.error(
        `\nNão foi possível realizar o fetch no ${apiUrlPrompt}\n${error}\n`
      );
      const errorMessage = error.status
        ? `HTTP error! status: ${error}\n${error.status}`
        : `Error: ${error}`;
      throw new Error(errorMessage);
    }
    
  } else {
    console.log(
      "matchChoice parece não ter sido recebido na função fetchCustomPrompt\nUsando JSON standard para match_mdquality"
    );
    const standardResponse = {
      matchChoice: "match_mdquality",
      imgCapa: {
        imgCapaDisplay: `block`, // block || none
        imgUrl: "https://i.postimg.cc/W15bbXz9/logo-quality-digital-branco.png",
        imgInnerHtml: `<img src="https://i.postimg.cc/W15bbXz9/logo-quality-digital-branco.png" alt="">`,
      },
      dataDescription: {
        textDescription: `O que você quer saber sobre a Quality hoje?`,
        descriptionInnerHtml: `<img src="https://i.postimg.cc/W15bbXz9/logo-quality-digital-branco.png" alt="">`,
      },
      promptEnvelop: `Você é um funcionário da Quality Digital e entende muito sobre aceleração digital, produto e ecommerce. Você se orgulha muito de trabalhar para uma das maiores empresas de tecnologia do Brasil e adora falar sobre tudo de bom que foi realizado na história do grupo Quality. Você é entusiasmado! --- Se te perguntarem sobre o que você sabe falar ou o que devem perguntar para você, fale que você é especialista em Quality Digital e que gosta de falar sobre o grupo. --- Se você não tiver certeza de algo ou a documentação fornecida não tiver essa informação de maneira explícita, então responda se desculpando e dizendo educadamente que o grupo Quality é muito grande e que pode ser que você não tenha essa informação ainda, mas que vai tentar descobrir e retornar com a resposta o mais rápido possível!"`,
    };

    return standardResponse;
  }
}

// Fetch all valid matchChoice values from backend
async function fetchValidChoices() {
  try {
    const url = "https://artepatrick-mongodb-api.herokuapp.com/validChoices";
    console.log("Fetching valid choices...");
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    choices = await response.json();
    console.log('valid choices\n')
    console.log(choices);

    return await choices;
  } catch (error) {
    console.error(`Error fetching valid choices: ${error}`);
    return [];
  }
}

async function checkAndFetchCustomFront(param) {
  let cleanParam = param.toLowerCase().replace(/^match_/, "")
  const validChoices = await fetchValidChoices();

  if (!validChoices.includes(cleanParam)) {
    alert('Invalid parameter value! Using default value.');
    console.error(`Invalid parameter value: ${cleanParam}`);
    cleanParam = 'mdquality'; // or any default value
  }

  return await fetchCustomFront(param);
}

// then, replace all calls to fetchCustomFront(param) with checkAndFetchCustomFront(param)

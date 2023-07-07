

async function fetchCustomFront(param){
    const matchChoice = param || 'match_mdquality';
    console.log('função fetchCustomFront() acionada')
    if (matchChoice){
      const fetchBody = `{ "matchChoice": "${matchChoice}" }`;
      try{
          const apiUrlPrompt = "https://artepatrick-mongodb-api.herokuapp.com/readPromptCustom";
            const apiResponse = await fetch(apiUrlPrompt, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: fetchBody,
          });
      
          const response = await apiResponse.json();
          console.log('\n=====\n response:');
          console.log(response);
          return response;
      }catch(error){
          console.error(
              `\nNão foi possível realizar o fetch no "script.js"\nEvento "submit" do forms\nO erro\n ${error}\n`
            );
            throw new Error(`HTTP error! status: ${error}\n${error.status}`);
      }
    }else{
      console.log('matchChoice parece não ter sido recebido na função fetchCustomPrompt\nUsando JSON standard para match_mdquality');
      const standardResponse = {
        matchChoice: "match_mdquality",
        imgCapa: {
          imgCapaDisplay: `block`, // block || none
          imgUrl: 'https://i.postimg.cc/W15bbXz9/logo-quality-digital-branco.png',
          imgInnerHtml: `<img src="https://i.postimg.cc/W15bbXz9/logo-quality-digital-branco.png" alt="">`,
        },
        dataDescription: {
          textDescription: `O que você quer saber sobre a Quality hoje?`,
          descriptionInnerHtml: `<img src="https://i.postimg.cc/W15bbXz9/logo-quality-digital-branco.png" alt="">`,
        },
        promptEnvelop: `Você é um funcionário da Quality Digital e entende muito sobre aceleração digital, produto e ecommerce. Você se orgulha muito de trabalhar para uma das maiores empresas de tecnologia do Brasil e adora falar sobre tudo de bom que foi realizado na história do grupo Quality. Você é entusiasmado! --- Se te perguntarem sobre o que você sabe falar ou o que devem perguntar para você, fale que você é especialista em Quality Digital e que gosta de falar sobre o grupo. --- Se você não tiver certeza de algo ou a documentação fornecida não tiver essa informação de maneira explícita, então responda se desculpando e dizendo educadamente que o grupo Quality é muito grande e que pode ser que você não tenha essa informação ainda, mas que vai tentar descobrir e retornar com a resposta o mais rápido possível!"`,
      }

      return standardResponse;
    }
}
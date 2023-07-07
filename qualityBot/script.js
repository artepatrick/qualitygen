const form = document.getElementById("apiForm");
const loadingDiv = document.getElementById("loading1");
const loadingDiv2 = document.getElementById("loading2");
const responseDiv = document.getElementById("response");
const promptInputElement = document.getElementById("prompt");
const commentInputElement = document.getElementById("comment");
const button = document.getElementById("button");
const commentLabel = document.getElementById("commentLabel");
const descriptionP = document.getElementById("descriptionP");
const headingH1 = document.getElementById("headingH1");
const matchVariable = document.getElementById("matchChoice");
const imgCapa = document.getElementById("imgCapa");
const dataDescription = document.getElementById("dataBaseDescription");
const formGroup = document.getElementById("comment-group");
const urlParams = new URLSearchParams(window.location.search);
const urlQuery = urlParams.get("matchchoice");
console.log(`urlQuery: ${urlQuery}`);

let matchChoice = "";

if (!urlQuery) {
  matchChoice = "match_mdquality";
  console.log(`\n=====\nVariável NÃO VEIO de URL:\nmatchChoice: "${matchChoice}" por padrão\nSe quiser parametrizar, use:\nhttps://firstbot-front.netlify.app/?matchchoice=match_documents\nO parâmetro que vem depois do "=" identificará a base de dados de que deseja obter informações\n=====\n`);
  } else {
    matchChoice = urlQuery;
    console.log(
      `\n=====\nVariável VEIO de URL:\nmatchChoice: ${matchChoice}\nSe quiser parametrizar, use:\nhttps://firstbot-front.netlify.app/?matchchoice=match_documents\nO parâmetro que vem depois do "=" identificará a base de dados de que deseja obter informações\n=====\n`
      );
    }
    
    responseDiv.style.display  = "none";
    loadingDiv.style.display  = "block";
    loadingDiv2.style.display  = "none";
    commentInputElement.style.display  = "none";
    commentLabel.style.display = "none";
    matchVariable.style.visibility = "show";
    matchVariable.innerHTML = `<p>${matchChoice}</p>`;
    imgCapa.style.display = "block";

    resetFront(); 
    personalizaFront(matchChoice);
    
    promptInputElement.addEventListener("input", (event) => {
      if (promptInputElement.value) {
        commentInputElement.style.display = "block";
        formGroup.style.display = "block";
        button.style = "background-color: #4caf50";
        button.ariaDisabled = false;
        button.style = "background-color: #4caf50";
      } else {
        commentInputElement.style.display = "none";
        formGroup.style.display = "none";
        button.style = "background-color: #606060";
        button.ariaDisabled = true;
      }
    });

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  buttonInProcess();
  loadingDiv.style.display  = "none";
  loadingDiv2.style.display  = "block";


  const promptInput = promptInputElement.value;
  const commentInput = commentInputElement.value;

  if (!commentInputElement.value){commentInputElement.style.display = "none";}else{
    commentInputElement.style.display = "block";
  }

  if (!promptInput) {
    console.log("promptInput vazio");
    alert("Por favor, preencha o campo de pergunta.");
    return;
  } else {
    let time = setTime(null);
    const param = {
      pergunta: promptInput,
      matchChoice,
      commentInput,
      responseDiv,
      time,
      /*  a API recebe assim: 
          promptInput: param.pergunta,
          matchChoice: param.matchChoice,
          commentInput: param.commentInput,
          rawRpcObj: param.rawRpcObj,
          finalPrompt: param.finalPrompt,
          time: getTime,
          apiResponse: param.apiResponse,
      */
    };
    console.log(`\n\nEnviando para a API:\n${JSON.stringify(param)}`);

    const responseData = await fetchApi(param);

    try {
      console.log(`Manipulando a DOM`);
      resetButton();
      responseDiv.textContent = responseData;
      responseDiv.style.display = "block";
      loadingDiv.style.display  = "block";
      loadingDiv2.style.display  = "none";
      if (!commentInput){commentInputElement.style.display = "none";}
      console.log(`\n-> Texto retirado do json:\n`);
      console.log(responseData);

      
      if (!responseData) {
        console.log(`\n=====\nATENÇÃO!\nO fetch voltou nulo.\nIniciando gravação da tentativa no MongoDB\n=====\n`)
        const getTime = setTime(null);
        let response = {
          promptInput,
          commentInput: "Usuário não conseguiu receber a resposta para essa pergunta porque o Fetch falhou. Registrando a intenção de busca e outros dados da tentativa",
          matchChoice,
          apiResponse: responseData,
          finalPrompt,
          time: getTime,
        };
        await storeInMongoDB(response);
      }
    } catch (error) {
      responseDiv.textContent = `${JSON.stringify(responseData)}`;
      responseDiv.style.display = "block";
      if(!commentInput){commentInputElement.style.display = "none";}
      console.log(
        `\n\nNão foi possível gravar no MongoDB!!\nerro:\n${error}\n\n`
      );
    }
  }
});

promptInputElement.addEventListener("click", (event) => {
  event.preventDefault();
  if (!event.target.value) {
    resetFront();
    promptInputElement.value = "";
    commentInputElement.value = "";
    responseDiv.style.display = "none";
    loadingDiv.style.display  = "block";
    loadingDiv2.style.display  = "none";
    if(!commentInputElement.value){commentInputElement.style.display = "none";}
  }
});

commentInputElement.addEventListener("click", (event) => {
  event.preventDefault();
});

function resetButton() {
  button.textContent = "Perguntar!";
  button.style = "background-color: #4caf50";
  button.ariaDisabled = false;
  loadingDiv.style.display = "none";
  loadingDiv2.style.display  = "block";
  console.log(`resetando botão`);
}

function buttonInProcess() {
  button.textContent = "AGUARDE...";
  button.style = "background-color: #606060";
  button.ariaDisabled = true;
  loadingDiv.style.display = "block";
  responseDiv.textContent = "...";
  loadingDiv2.style.display  = "block";
  loadingDiv.style.display  = "none";
  if (!commentInputElement.value){commentInputElement.style.display = "none";}
}

function resetFront() {
  loadingDiv.style.display = "block";
  loadingDiv2.style.display  = "none";
  responseDiv.style.display = "none";
  responseDiv.textContent = "...";
  button.style = "background-color: #4caf50";
}

async function storeInMongoDB(response) {
  if (!response)
    throw new Error(`Não foi possível gravar no MongoDB!!\nresponse vazio`);

  const urlApiGravaMongo =
    "https://artepatrick-mongodb-api.herokuapp.com/response";

  try {
    const apiReturn = await fetch(urlApiGravaMongo, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });

    return apiReturn;
  } catch (error) {
    console.log(
      `Erro ao fazer a requisição para a API\nURL utilizada:\n${urlApiGravaMongo}\nerro:\n${error}`
    );
    return error;
  }
}

function setTime(param) {
  let time = param;
  if (!time || isNaN(Date.parse(time))) {
    time = new Date();
    time.setUTCHours(time.getUTCHours()); // Adjust time to UTC-3
    // Set the language to Portuguese
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const formattedTime = time.toLocaleString("pt-BR", options);
      
      return formattedTime;
  }else{return time;}
}

/* 
{
  matchChoice: "match_mdquality",
  imgCapa: {
    imgCapaDisplay: "block",
    imgUrl: "url",
    imgInnerHtml: "",
  },
  dataDescription: {
    textDescription: "plain text",
    descriptionInnerHtml: "<div></div>",
  },
  promptEnvelop: "String",
};
 */

  async function personalizaFront(param) {
    try{
      const apiReturn = await fetchCustomFront(param);
      const {
        matchChoice,
        imgCapa: { imgUrl, imgInnerHtml, imgCapaDisplay },
        dataDescription: { textDescription, descriptionInnerHtml },
      } = apiReturn;
  
      imgCapa.style.display = "none";
  
      if (matchChoice) {
        imgCapa.style.display = imgCapaDisplay || "none";
        imgCapa.innerHTML = imgInnerHtml || `<img src=${imgUrl} alt="">`;
        if (imgInnerHtml || imgUrl) {headingH1.style.display = "none";}else{headingH1.style.display = "block";}
        if (dataDescription.textContent.length != 0) {
          descriptionP.textContent =
            textDescription ||
            `O que você deseja saber sobre o grupo Quality hoje?`;
        } else {
          dataDescription.innerHTML =
            descriptionInnerHtml ||
            `<p>O que você deseja saber sobre o grupo Quality hoje?</p>`;
        }
      }
    }catch(e){
      console.log(`tivemos um problema ao tentar acessar a base de dados para customizar o front\nerro: ${e}`);
    }
  }

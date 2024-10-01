const BASE_URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/<baseCurrency>.json`;
const dropdowns = document.querySelectorAll(".dropdown select");
const currentRate = document.querySelector("#current-rate");
const calculatedValue = document.querySelector("#calc-value");

let baseCurrency = "usd";
let toCurrency = "inr";

for (const dropdown of dropdowns) {
    for (currencyCode in countryList) {
        const newOption = document.createElement("option");
        newOption.innerText = currencyCode;
        newOption.value = currencyCode;
        if (currencyCode == "USD" && dropdown.id == "from") {
            newOption.selected = "selected";
        }
        if (currencyCode == "INR" && dropdown.id == "to") {
            newOption.selected = "selected";
        }
        dropdown.appendChild(newOption);
    }
    dropdown.addEventListener("change", (evt) => {
        changeFLag(evt.target);
        settingFromTo(evt.target);
    });
}

function changeFLag(targetedSelect) {
    const currencyCode = targetedSelect.value;
    const countryCode = countryList[currencyCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = targetedSelect.parentElement.querySelector("img");
    img.src = newSrc;
}

function settingFromTo(targetedSelect) {
    if (targetedSelect.id == "from") {
        baseCurrency = targetedSelect.value.toLowerCase();
    } else if (targetedSelect.id == "to") {
        toCurrency = targetedSelect.value.toLowerCase();
    }
}

function getInputValue() {
    const inputValue = document.querySelector("#amount");
    return inputValue.value;
}

let dataf;
async function getExchange() {
    let inputValue = Number(getInputValue());
    if (inputValue < 0) {
        document.querySelector("#amount").value = 1;
        inputValue = 1;
    }
    // here fetching the promise(fetch API) will give another promise (data) for base currency
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`;
    const reponse = await fetch(url);
    const data = reponse.json();
    data.then((res) => {
        // res is an object
        let currency_rate = res[baseCurrency][toCurrency];
        currency_rate = Number(currency_rate).toFixed(2);
        const totalValue = Number(inputValue) * Number(currency_rate);
        currentRate.textContent = `1 ${baseCurrency.toUpperCase()} = ${currency_rate} ${toCurrency.toUpperCase()}`;
        calculatedValue.textContent = `${totalValue.toFixed(
            2
        )} ${toCurrency.toUpperCase()}`;
    });
}

getExchange();
const getExchangeBtn = document.querySelector("button");
getExchangeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    getExchange();
});

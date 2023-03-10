import { useEffect, useState } from "react";
import CurrencyRow from "./components/CurrencyRow/CurrencyRow";
import round from "./components/helpers/round";
import styles from "./App.module.css";

const BASE_URL = "https://api.apilayer.com/exchangerates_data/latest";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [exchangeRates, setExchangeRates] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  var myHeaders = new Headers();
  myHeaders.append("apikey", "tqiwu2Y42AtTHyuRVMTWR4sA1U8JGhG1");

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  useEffect(() => {
    fetch(`${BASE_URL}?symbols=USD,EUR,GBP,AED&base=UAH`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
        setExchangeRates([...Object.values(data.rates)]);
      })
      .catch((error) => console.log("error", error));
  }, []);

  // async function fetchData() {
  //   try {
  //     const response = await fetch(
  //       `${BASE_URL}?symbols=USD,EUR,GBP,AED&base=UAH`,
  //       requestOptions
  //     );
  //     const data = await response.json();
  //     const firstCurrency = Object.keys(data.rates)[0];
  //     setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
  //     setFromCurrency(data.base);
  //     setToCurrency(firstCurrency);
  //     setExchangeRate(data.rates[firstCurrency]);
  //     setExchangeRates([...Object.values(data.rates)]);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `${BASE_URL}?symbols=${toCurrency}&base=${fromCurrency}`,
        requestOptions
      )
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[toCurrency]));
    }
  }, [fromCurrency, toCurrency]);

  // async function fetchData1() {
  //   try {
  //     if (fromCurrency != null && toCurrency != null) {
  //       const response = await fetch(
  //         `${BASE_URL}?symbols=${toCurrency}&base=${fromCurrency}`,
  //         requestOptions
  //       );
  //       const data = await response.json();
  //       setExchangeRate(data.rates[toCurrency]);
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }

  // useEffect(() => {
  //   fetchData1();
  // }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }
  return (
    <>
      <h1 className={styles.header}>
        {exchangeRates &&
          exchangeRates.map(function (object, i) {
            return (
              currencyOptions.length > 0 &&
              currencyOptions.length > 0 && (
                <span key={i}>
                  100 UAH = {round(object * 100, 4)}
                  {currencyOptions[i + 1]}
                  <br />
                </span>
              )
            );
          })}
      </h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className={styles.equals}>=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;

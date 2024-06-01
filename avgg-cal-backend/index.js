const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9856;

app.use(cors());

const windowSize = 10;

const numberStore = {
  p: [],
  f: [],
  e: [],
  r: []
};

const apiBaseURL = 'http://20.244.56.144/test/';


const num = async (type) => {
  try {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel(`Request timed out for type ${type}`);
    }, 500);

    const response = await axios.get(`${apiBaseURL}${type}`, { cancelToken: source.token });
    clearTimeout(timeout);
    return response.data.number;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.warn(error.message);
    } else {
      console.error('Error fetching number:', error);
    }
    throw error;
  }
};

const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

// const authdata={
//   companyName: 'Dayananda Sagar College Of Enginnering',
//   ownerName: 'saksham',
//   ownerEmail: 'sakshamagarwal1616@gmail.com',
//   rollNo: '1DS21EE089',  
//     accessCode: 'sMYzGa'
// }
// axios.post("http://20.244.56.144/test/register", authdata)
//     .then(response => {
//         console.log("Registration successful!");
//         console.log("Response data:", response.data);
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error("Error in response:", error.response.status);
//             console.error("Error details:", error.response.data);
//         } else if (error.request) {
//             console.error("No response received:", error.request);
//         } else {
//             console.error("Error creating request:", error.message);
//         }
//     });

app.get('/numbers/:numberType', async (req, res) => {
  const numberType = req.params.numberType;
  console.log(numberType)
  if (!['p', 'f', 'e', 'r'].includes(numberType)) {
    return res.status(400).json({ error: 'Invalid number type' });
  }
      const authdata={
        companyName: 'Dayananda Sagar College Of Enginnering',
        clientID: 'f8a97301-2537-41e1-9c74-5fed2aa2feff',
        clientSecret: 'CMSLymtchJXloyGi',
        ownerName: 'saksham',
        ownerEmail: 'sakshamagarwal1616@gmail.com',
        rollNo: '1DS21EE089'      
    }
    let token;
    try {
      const authResponse = await axios.post('http://20.244.56.144/test/auth', authdata);
      console.log("Authentication successful!");
      console.log("Response data:", authResponse.data);
      token = authResponse.data.access_token;
    } catch (error) {
      if (error.response) {
        console.error("Error in response:", error.response.status);
        console.error("Error details:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error creating request:", error.message);
      }
      return res.status(500).json({ error: 'Authentication failed' });
    }
    console.log(token)
    let value = "";
    if (numberType === "p")
      value = "primes"
    else if (numberType === "r")
      value = "rand"
    else if (numberType === "f")
      value = "fibo"
    else if (numberType === "e")
      value = "even"
    
    const url = `http://20.244.56.144/test/${value}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log(response.data); // Log the response data from the external API
  
      const numbersBefore = [...numberStore[numberType]];
  
      if (!numberStore[numberType].includes(response.data.number)) {
        if (numberStore[numberType].length >= windowSize) {
          numberStore[numberType].shift();
        }
  
        numberStore[numberType].push(response.data.number);
      }
  
      const average = calculateAverage(numberStore[numberType]);
      const numbersAfter = [...numberStore[numberType]];
  
      res.json({ average, numbersBefore, numbersAfter });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch number and no numbers stored' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
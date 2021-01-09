const axios = require('axios');

exports.handler = async (event, context) => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users/1');

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(res.data)
    }
}
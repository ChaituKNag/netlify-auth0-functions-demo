exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/json'
        },
        body: JSON.stringify({message: "Hello World from me..."})
    };
}
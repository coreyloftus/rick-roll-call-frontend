export default async function geminiTest(req: string) {
    console.log('geminiTest called with req:', req)
    const res = await fetch('http://0.0.0.0:8000/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ prompt: req })
    })

    const responseBody = await res.json()
    console.log('geminiTest response:', responseBody)
    return responseBody.response
}

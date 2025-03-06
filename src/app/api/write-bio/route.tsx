import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError, AxiosResponse } from "axios";
import { OpenaiResponse } from "@/types";


export async function POST(request: NextRequest) {
//   try {
    const prompt = await request.text();
    console.log(`The prompt is: ${prompt}`)
    console.log(process.env.OPENAI_API_KEY)
    const openaiResponse: OpenaiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
        model: "gpt-4o",
        messages: [
            {
            role: "developer",
            content: "You are writing an employee bio for a lawyer.",
            },
            { role: "user", content: prompt },
        ],
        },
        {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        },
    ).then((response: AxiosResponse) => {
        console.log(response.data.choices[0].message.content)
        const result: OpenaiResponse = {
            status: response.status,
            data: response.data.choices[0].message.content,
            error: ""
        }
        return result
    }).catch((error: AxiosError) => {
        console.log(error.response?.data)
        const result: OpenaiResponse = {
            status: error.status ? error.status : 400,
            data: "",
            error: "There was a system error. Please try again soon.",
        }
        return result;
    });

    if (openaiResponse.error.length > 0 ) {
        return new NextResponse(`Error: ${openaiResponse.error}`, { status: openaiResponse.status });
    } else {
        return new NextResponse(openaiResponse.data, {status: 200})    
    }
}

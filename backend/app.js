import express from 'express'
import cors from 'cors'
import connectDB from './db.js'
import Wf from './models/wfSchema.js'
import Household from './models/householdSchema.js'


import ollama from "ollama";

let modelResponse = ""

const chatConfig = ({
    model: "llama2",
    role: "user",
    content: ""
})

const app = express()
app.use(express.json())

app.use(cors())

const port = 8000
app.post("/detectImage", async (req, res) => {
    const { className } = req.body;
    console.log(className);
    const object = className;

    try {
        const product_returned = await Wf.findOne({
            // product: object
            product: { $regex: object, $options: 'i' }
        })

        if (!product_returned) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        else {
            return res.json({
                waterfootprint: JSON.stringify(product_returned.waterfootprint)
            })
        }
    } catch (error) {
        console.log(error);
    }

    try {
        const appliance_returned = await Household.findOne({
            appliance: object
        })

        if (!appliance_returned) {
            return res.status(404).json({
                message: "Appliance not found"
            });
        }
        else {
            return res.json({
                waterfootprint: JSON.stringify(product_returned.waterfootprintPerDay)
            })
        }
    } catch (error) {
        console.log(error);
    }
});



//object recognition

app.post("/detect", async (req, res) => {
    const detectedObj = req.body;
    console.log(detectedObj.obj);
    const object = detectedObj.obj;

    try {
        const product_returned = await Wf.findOne({
            product: object
        })

        if (!product_returned) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        else {
            return res.json({
                waterfootprint: JSON.stringify(product_returned.waterfootprint)
            })
        }
    } catch (error) {
        console.log(error);
    }

    try {
        const appliance_returned = await Household.findOne({
            appliance: object
        })

        if (!appliance_returned) {
            return res.status(404).json({
                message: "Appliance not found"
            });
        }
        else {
            return res.json({
                waterfootprint: JSON.stringify(product_returned.waterfootprint)
            })
        }
    } catch (error) {
        console.log(error);
    }
});

app.post("/inputDetect", async (req, res) => {
    const detectedObj = req.body;
    console.log(detectedObj.input);
    const object = detectedObj.input;

    console.log(object);

    try {
        const product_returned = await Wf.findOne({
            product: object
        })

        if (!product_returned) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        else {
            return res.json({
                waterfootprint: JSON.stringify(product_returned.waterfootprint)
            })
        }
    } catch (error) {
        console.log(error);
    }

    try {
        const appliance_returned = await Household.findOne({
            appliance: object
        })

        if (!appliance_returned) {
            return res.status(404).json({
                message: "Appliance not found"
            });
        }
        else {
            return res.json({
                waterfootprint: JSON.stringify(appliance_returned.waterfootprintPerDay)
            })
        }
    } catch (error) {
        console.log(error);
    }
});

app.post('/ask', async (req, res) => {
    try {
        const question = req.body.question.trim()
        const response = await invoke(question)
        res.status(200).json({
            success: true,
            message: "Response fetched successfully",
            response
        })


    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch response"
        })
    }
})


async function invoke(question) {
    console.log(`-----`)
    console.log(`[${chatConfig.model}]: ${question}`)
    console.log(`-----`)
    try {
        console.log(`Running prompt...`)
        const response = await ollama.chat({
            model: chatConfig.model,
            messages: [{ role: chatConfig.role, content: question }],
        })
        console.log(`${response.message.content}\n`)
        modelResponse = response.message.content
        return modelResponse
    }
    catch (error) {
        console.log(`Query failed!`)
        console.log(error)
    }
}

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on http://localhost:${port}`);
});
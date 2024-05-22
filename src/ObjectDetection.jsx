import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import axios from "axios";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { InputBox } from "./components/InputBox";

function ObjectDetection() {
    const [result, setResult] = useState("");
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const runCoco = async () => {

        const net = await cocossd.load();

        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 10);
    };

    let detectionInProgress = false;
    const detect = async (net) => {


        if (detectionInProgress) {
            return;
        }

        detectionInProgress = true;

        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const obj = await net.detect(video);

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");

            // 5. TODO - Update drawing utility
            // drawSomething(obj, ctx)

            drawRect(obj, ctx);

            if (obj.length > 0) {
                const firstObj = obj[0];
                const response = await axios.post("http://localhost:8000/detect", {
                    obj: firstObj.class
                })

                setResult(response.data.waterfootprint);

                detectionInProgress = false
            }

        }
    };

    useEffect(() => {
        runCoco()
    }, []);
    return (
        <>
            <div>
                {result}
            </div>
            <div className="App">
                <header className="App-header">
                    <Webcam
                        ref={webcamRef}
                        muted={true}
                        style={{
                            position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            zindex: 9,
                            width: 640,
                            height: 480,
                        }}
                    />

                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            zindex: 8,
                            width: 640,
                            height: 480,
                        }}
                    />
                </header>
            </div>

            {/* <BrowserRouter>
                <Routes>
                    <Route path="/chat" element={<InputBox />} />
                </Routes>
            </BrowserRouter> */}
        </>
    )
}

export default ObjectDetection

// import { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs";
// import * as cocossd from "@tensorflow-models/coco-ssd";
// import Webcam from "react-webcam";
// import "./App.css";
// import { drawRect } from "./utilities";
// import axios from "axios";

// function ObjectDetection() {
//     const [result, setResult] = useState<string>("");
//     const webcamRef = useRef<Webcam>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     const runCoco = async () => {
//         const net = await cocossd.load();

//         // Loop and detect hands
//         setInterval(() => {
//             detect(net);
//         }, 10);
//     };

//     let detectionInProgress = false;
//     const detect = async (net: cocossd.ObjectDetection) => {
//         if (detectionInProgress) {
//             return;
//         }

//         detectionInProgress = true;

//         // Check data is available
//         if (
//             webcamRef.current &&
//             webcamRef.current.video &&
//             webcamRef.current.video.readyState === 4
//         ) {
//             // Get Video Properties
//             const video = webcamRef.current.video as HTMLVideoElement;
//             const videoWidth = video.videoWidth;
//             const videoHeight = video.videoHeight;

//             // Set video width
//             video.width = videoWidth;
//             video.height = videoHeight;

//             // Set canvas height and width
//             if (canvasRef.current) {
//                 canvasRef.current.width = videoWidth;
//                 canvasRef.current.height = videoHeight;
//             }

//             // Make Detections
//             const obj = await net.detect(video);

//             // Draw mesh
//             const ctx = canvasRef.current?.getContext("2d");

//             if (ctx) {
//                 // TODO: Update drawing utility
//                 // drawSomething(obj, ctx)
//                 drawRect(obj, ctx);
//             }
//             if (obj.length > 0) {
//                 const firstObj = obj[0];
//                 try {
//                     const response = await axios.post<{ waterfootprint: string }>("http://localhost:8000/detect", {
//                         obj: firstObj.class
//                     });
//                     setResult(response.data.waterfootprint);
//                 } catch (error) {
//                     console.error("Error fetching data:", error);
//                 }
//             }

//         }

//         detectionInProgress = false;
//     };

//     useEffect(() => {
//         runCoco();
//     }, []);

//     return (
//         <>
//             <div>{result}</div>
//             <div className="App">
//                 <header className="App-header">
//                     <Webcam
//                         ref={webcamRef}
//                         muted={true}
//                         style={{
//                             position: "absolute",
//                             marginLeft: "auto",
//                             marginRight: "auto",
//                             left: 0,
//                             right: 0,
//                             textAlign: "center",
//                             zIndex: 9,
//                             width: 640,
//                             height: 480,
//                         }}
//                     />

//                     <canvas
//                         ref={canvasRef}
//                         style={{
//                             position: "absolute",
//                             marginLeft: "auto",
//                             marginRight: "auto",
//                             left: 0,
//                             right: 0,
//                             textAlign: "center",
//                             zIndex: 8,
//                             width: 640,
//                             height: 480,
//                         }}
//                     />
//                 </header>
//             </div>
//         </>
//     );
// }

// export default ObjectDetection;

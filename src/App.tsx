import * as mobilenet from '@tensorflow-models/mobilenet'
import axios from 'axios';

import { useEffect, useRef, useState } from 'react'


interface Prediction {
  className: string;
  probability: number;
}

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])

  const imageRef = useRef<HTMLImageElement>(null)

  const [result, setResult] = useState("No data")

  const identifyImage = async () => {
    if (!model || !imageRef.current) return;

    try {
      const predictions = await model.classify(imageRef.current)
      setPredictions(predictions)
      sendPredictionsToBackend(predictions)
      console.log(predictions);
    } catch (error) {
      console.log(error);
    }
  }

  const sendPredictionsToBackend = async (predictions: Prediction[]) => {
    try {
      if (predictions.length > 0) {
        const firstPrediction = predictions[0]
        const response = await axios.post('http://localhost:8000/detectImage', {
          className: firstPrediction.className.trim().split(' ')[0]
        })
        setResult(response.data.waterfootprint)
        console.log('Backend response:', response.data)
        console.log('Response:', response.data.waterfootprint)
      }
    } catch (error) {
      console.error('Error sending prediction to backend:', error)
    }
  }

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    }
    else {
      setImageURL(null)
    }
  }

  const loadModel = async () => {
    setIsModelLoading(true)

    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsModelLoading(false)
    } catch (error) {
      console.log(error);
      setIsModelLoading(false)
    }
  }

  useEffect(() => {
    loadModel()
  }, [])

  if (isModelLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='flex justify-center items-center'>
        Image Identification
      </div>
      <div className='flex justify-center'>
        <input type="file" accept='image/*' capture='user' onChange={uploadImage} />
      </div>
      <div>
        <div>
          <div>
            {imageURL && <img src={imageURL} alt="img" crossOrigin='anonymous' ref={imageRef} />}
          </div>
          {predictions.length > 0 && <div>
            {predictions.map((prediction, index) => {
              return (
                <div key={prediction.className}>
                  <span>{prediction.className}</span>
                  <span>Confidence level: {(prediction.probability * 100).toFixed(2)}%</span>
                  {index === 0 &&
                    <span>Best Guess</span>
                  }
                </div>
              )
            })}
          </div>}
          {imageURL &&
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={identifyImage}>Identify Image</button>
          }
          {result}
        </div>
      </div>
    </>
  )
}

export default App

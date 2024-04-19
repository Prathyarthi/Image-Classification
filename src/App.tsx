import * as mobilenet from '@tensorflow-models/mobilenet'

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

  const identifyImage = async () => {
    if (!model || !imageRef.current) return;
    const predictions = await model.classify(imageRef.current)
    setPredictions(predictions)
    console.log(predictions);
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
        </div>
      </div>
    </>
  )
}

export default App

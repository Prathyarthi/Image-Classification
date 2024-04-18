import * as mobilenet from '@tensorflow-models/mobilenet'
import { useEffect, useRef, useState } from 'react'

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)

  const imageRef = useRef<HTMLImageElement>(null)

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
      <div>
        Image Identification
      </div>
      <div>
        <input type="file" accept='image/*' capture='user' onChange={uploadImage} />
      </div>
      <div>
        <div>
          <div>
            {imageURL && <img src={imageURL} alt="img" crossOrigin='anonymous' ref={imageRef} />}
          </div>
          {imageURL &&
            <button>Identify Image</button>
          }
        </div>
      </div>
    </>
  )
}

export default App

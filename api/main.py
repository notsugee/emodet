from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os
import cv2

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "../saved_model/112")

# Load the model with custom layers
MODEL = tf.keras.models.load_model(model_path)

# Class names
CLASS_NAMES = ["angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised"]

@app.get("/ping")
async def ping():
    return "Hello"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

def preprocess_image(image: np.ndarray) -> tf.Tensor:
    # Convert to grayscale if the image has 3 channels (RGB)
    if image.ndim == 3 and image.shape[-1] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    if len(image.shape) > 2 and image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_BGRA2GRAY)
    
    # Resize and normalize the image
    image = cv2.resize(image, (48, 48))
    image = image / 255.0
    # Ensure the image has only one channel
    image = np.expand_dims(image, axis=-1)  # Add the channel dimension
    
    # Expand dimensions to match the expected input shape of the model
    image = np.expand_dims(image, axis=0)
    return image







@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())

    # Print the shape of the original image
    print("Original image shape:", image.shape)

    processed_image = preprocess_image(image)

    print("Processed image shape:", processed_image.shape)

    # Prediction
    prediction = MODEL.predict(processed_image)
    class_index = np.argmax(prediction)
    predicted_class = CLASS_NAMES[class_index]
    confidence = float(prediction[0, class_index])

    print(predicted_class, ", ", confidence)

    return {"predicted_class": predicted_class, "confidence": confidence, "prediction": prediction.tolist()}

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

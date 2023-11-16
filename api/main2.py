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
model_path = os.path.join(script_dir, "../saved_model/1")

MODEL = tf.keras.models.load_model(model_path)

CLASS_NAMES = ["angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised"]

@app.get("/ping")
async def ping():
    return "Hello"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

def preprocess_image(image: np.ndarray) -> tf.Tensor:
    if len(image.shape) not in (2, 3):
        raise ValueError("Input image must have 2 or 3 dimensions (H, W) or (H, W, C)")

    if len(image.shape) == 2:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)

    image = tf.image.resize(image, [224, 224])
    image = tf.expand_dims(image, axis=0)
    image = image / 255.0

    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    processed_image = preprocess_image(image)

    prediction = MODEL.predict(processed_image)
    class_index = np.argmax(prediction)
    predicted_class = CLASS_NAMES[class_index]
    confidence = float(prediction[0, class_index])

    print(predicted_class,", ",confidence)

    return {"predicted_class": predicted_class, "confidence": confidence, "prediction": prediction.tolist()}

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

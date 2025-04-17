// Content-Aware Fill (TensorFlow.js)

import * as tf from '@tensorflow/tfjs';

export async function inpaint(imageTensor, maskTensor) {
  const model = await tf.loadGraphModel('inpainting-model/model.json');
  const output = model.predict([imageTensor, maskTensor]);
  return output;
}

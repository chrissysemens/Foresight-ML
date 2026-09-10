import { ModelMetadata } from "@predict-flow/core";
import * as tf from "@tensorflow/tfjs-node";


export const createModel = (inputSize: number, metadata: ModelMetadata) => {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [inputSize],
      units: 32,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.dense({
      units: 16,
      activation: "relu",
    })
  );

  if (metadata.taskType === "classification") {
    const classCount = Object.keys(metadata.targetMapping ?? {}).length;

    model.add(
      tf.layers.dense({
        units: classCount,
        activation: "softmax",
      })
    );

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
  } else {
    model.add(
      tf.layers.dense({
        units: 1,
      })
    );

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: "meanSquaredError",
      metrics: ["mse"],
    });
  }

  return model;
}